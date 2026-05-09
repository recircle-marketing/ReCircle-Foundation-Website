from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Header, Query
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from slugify import slugify


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme')

# FastAPI app
app = FastAPI()

# Static uploads under /api/uploads to keep all backend routes /api-prefixed
app.mount('/api/uploads', StaticFiles(directory=str(UPLOAD_DIR)), name='uploads')

api_router = APIRouter(prefix="/api")


# ========== Models ==========
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BlogBase(BaseModel):
    title: str
    summary: str
    content_html: str = ""
    featured_image: str = ""
    author: str
    category: str = ""
    tags: List[str] = Field(default_factory=list)
    date: str  # ISO date string (YYYY-MM-DD)
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    published: bool = True


class BlogCreate(BlogBase):
    slug: Optional[str] = None


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content_html: Optional[str] = None
    featured_image: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    date: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    published: Optional[bool] = None


class Blog(BlogBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlogListItem(BaseModel):
    id: str
    slug: str
    title: str
    summary: str
    featured_image: str
    author: str
    category: str
    tags: List[str]
    date: str
    published: bool


class BlogListResponse(BaseModel):
    items: List[BlogListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str


# ========== Auth ==========
def require_admin(authorization: Optional[str] = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")
    parts = authorization.split()
    token = parts[1] if len(parts) == 2 and parts[0].lower() == "bearer" else authorization
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return True


# ========== Helpers ==========
async def _ensure_unique_slug(base_slug: str, exclude_id: Optional[str] = None) -> str:
    slug = base_slug
    suffix = 2
    while True:
        query = {"slug": slug}
        if exclude_id:
            query["id"] = {"$ne": exclude_id}
        existing = await db.blogs.find_one(query, {"_id": 0, "id": 1})
        if not existing:
            return slug
        slug = f"{base_slug}-{suffix}"
        suffix += 1


def _to_list_item(doc: dict) -> dict:
    return {
        "id": doc.get("id"),
        "slug": doc.get("slug"),
        "title": doc.get("title", ""),
        "summary": doc.get("summary", ""),
        "featured_image": doc.get("featured_image", ""),
        "author": doc.get("author", ""),
        "category": doc.get("category", ""),
        "tags": doc.get("tags", []) or [],
        "date": doc.get("date", ""),
        "published": doc.get("published", True),
    }


# ========== Routes ==========
@api_router.get("/")
async def root():
    return {"message": "ReCircle Foundation API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ----- Admin auth -----
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return AdminLoginResponse(token=ADMIN_PASSWORD)


@api_router.get("/admin/verify")
async def admin_verify(_: bool = Depends(require_admin)):
    return {"ok": True}


# ----- Blog public -----
@api_router.get("/blogs", response_model=BlogListResponse)
async def list_blogs(
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=50),
    search: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    sort: str = Query("date_desc"),
    include_unpublished: bool = False,
    authorization: Optional[str] = Header(default=None),
):
    query: dict = {}

    # only admin can request unpublished
    is_admin = False
    if authorization:
        token = authorization.split()[-1] if authorization.split() else ""
        is_admin = token == ADMIN_PASSWORD
    if not (include_unpublished and is_admin):
        query["published"] = True

    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        # Simple case-insensitive title + summary + content text match
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"title": regex},
            {"summary": regex},
            {"content_html": regex},
            {"author": regex},
            {"category": regex},
            {"tags": regex},
        ]

    sort_field = "date"
    sort_dir = -1
    if sort == "date_asc":
        sort_dir = 1
    elif sort == "date_desc":
        sort_dir = -1

    total = await db.blogs.count_documents(query)
    skip = (page - 1) * per_page
    cursor = (
        db.blogs.find(query, {"_id": 0})
        .sort([(sort_field, sort_dir), ("created_at", -1)])
        .skip(skip)
        .limit(per_page)
    )
    docs = await cursor.to_list(per_page)
    items = [_to_list_item(d) for d in docs]
    total_pages = max(1, (total + per_page - 1) // per_page)
    return BlogListResponse(
        items=items, total=total, page=page, per_page=per_page, total_pages=total_pages
    )


@api_router.get("/blogs/slug/{slug}", response_model=Blog)
async def get_blog_by_slug(slug: str):
    doc = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog(**doc)


@api_router.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog_by_id(blog_id: str, _: bool = Depends(require_admin)):
    doc = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog(**doc)


@api_router.get("/blogs/related/{slug}", response_model=List[BlogListItem])
async def get_related_blogs(slug: str, limit: int = 5):
    current = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    query: dict = {"published": True, "slug": {"$ne": slug}}
    if current and current.get("tags"):
        query["tags"] = {"$in": current["tags"]}
    docs = await db.blogs.find(query, {"_id": 0}).sort([("date", -1)]).limit(limit).to_list(limit)
    if len(docs) < limit:
        # backfill with most recent
        seen_ids = {d["id"] for d in docs}
        more_query = {"published": True, "slug": {"$ne": slug}, "id": {"$nin": list(seen_ids)}}
        more = (
            await db.blogs.find(more_query, {"_id": 0})
            .sort([("date", -1)])
            .limit(limit - len(docs))
            .to_list(limit)
        )
        docs.extend(more)
    return [_to_list_item(d) for d in docs]


# ----- Blog admin CRUD -----
@api_router.post("/admin/blogs", response_model=Blog)
async def create_blog(payload: BlogCreate, _: bool = Depends(require_admin)):
    base = payload.slug or payload.title
    base_slug = slugify(base) or str(uuid.uuid4())[:8]
    final_slug = await _ensure_unique_slug(base_slug)

    blog = Blog(**{**payload.model_dump(), "slug": final_slug})
    doc = blog.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.blogs.insert_one(doc)
    return blog


@api_router.put("/admin/blogs/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, payload: BlogUpdate, _: bool = Depends(require_admin)):
    existing = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")

    update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}

    if "slug" in update_data or ("title" in update_data and not existing.get("slug")):
        base = update_data.get("slug") or update_data.get("title") or existing["title"]
        base_slug = slugify(base) or existing["slug"]
        update_data["slug"] = await _ensure_unique_slug(base_slug, exclude_id=blog_id)

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.blogs.update_one({"id": blog_id}, {"$set": update_data})
    doc = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    return Blog(**doc)


@api_router.delete("/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str, _: bool = Depends(require_admin)):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}


# ----- Image upload -----
ALLOWED_IMAGE_EXT = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), _: bool = Depends(require_admin)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXT:
        raise HTTPException(status_code=400, detail="Unsupported image type")
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 5MB)")
    new_name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / new_name
    with dest.open("wb") as f:
        f.write(contents)
    return {"url": f"/api/uploads/{new_name}", "filename": new_name}


# ----- Categories / tags helpers -----
@api_router.get("/blogs-meta/categories")
async def get_categories():
    cats = await db.blogs.distinct("category", {"published": True})
    return [c for c in cats if c]


@api_router.get("/blogs-meta/tags")
async def get_tags():
    tags = await db.blogs.distinct("tags", {"published": True})
    return [t for t in tags if t]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def _ensure_indexes():
    try:
        await db.blogs.create_index("slug", unique=True)
        await db.blogs.create_index("date")
        await db.blogs.create_index("published")
        await db.blogs.create_index("category")
        await db.blogs.create_index("tags")
    except Exception as e:  # noqa: BLE001
        logger.warning(f"Index creation issue: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
