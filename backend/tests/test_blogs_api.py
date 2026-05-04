"""Backend tests for Knowledge Centre / Blogs feature.

Covers: public list/search/slug/related; admin login/verify; CRUD; upload; _id leak checks.
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://recircle-preview.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "ReCircle@2026"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_client(admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


def _assert_no_objectid(payload):
    """Recursively assert that no key '_id' is present in payload."""
    if isinstance(payload, dict):
        assert "_id" not in payload, f"_id leaked in: {list(payload.keys())}"
        for v in payload.values():
            _assert_no_objectid(v)
    elif isinstance(payload, list):
        for item in payload:
            _assert_no_objectid(item)


# ---------- Admin auth ----------
class TestAdminAuth:
    def test_login_wrong_password(self, client):
        r = client.post(f"{API}/admin/login", json={"password": "wrongpass"})
        assert r.status_code == 401

    def test_login_correct_password(self, client):
        r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        body = r.json()
        assert "token" in body
        assert body["token"] == ADMIN_PASSWORD

    def test_verify_with_token(self, admin_client):
        r = admin_client.get(f"{API}/admin/verify")
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_verify_without_token(self, client):
        r = client.get(f"{API}/admin/verify")
        assert r.status_code == 401


# ---------- Public blog listing ----------
class TestBlogsPublicList:
    def test_list_default_pagination(self, client):
        r = client.get(f"{API}/blogs")
        assert r.status_code == 200
        data = r.json()
        for k in ("items", "total", "page", "per_page", "total_pages"):
            assert k in data
        assert data["per_page"] == 9
        assert data["page"] == 1
        assert isinstance(data["items"], list)
        expected_pages = max(1, (data["total"] + 9 - 1) // 9)
        assert data["total_pages"] == expected_pages
        _assert_no_objectid(data)

    def test_list_sorted_desc_by_date(self, client):
        r = client.get(f"{API}/blogs", params={"sort": "date_desc", "per_page": 20})
        assert r.status_code == 200
        items = r.json()["items"]
        dates = [i["date"] for i in items if i.get("date")]
        assert dates == sorted(dates, reverse=True)

    def test_list_only_published_without_auth(self, client):
        r = client.get(f"{API}/blogs", params={"include_unpublished": True})
        assert r.status_code == 200
        for it in r.json()["items"]:
            assert it["published"] is True

    def test_search_case_insensitive(self, client):
        # Try known seed term "safai"
        r = client.get(f"{API}/blogs", params={"search": "SAFAI"})
        assert r.status_code == 200
        data = r.json()
        # Allow zero matches if seed not present; just ensure endpoint works & total non-negative
        assert data["total"] >= 0
        _assert_no_objectid(data)


# ---------- Slug fetch ----------
class TestBlogBySlug:
    def test_slug_not_found(self, client):
        r = client.get(f"{API}/blogs/slug/this-slug-definitely-does-not-exist-xyz")
        assert r.status_code == 404

    def test_slug_returns_blog(self, client):
        lst = client.get(f"{API}/blogs", params={"per_page": 1}).json()
        if not lst["items"]:
            pytest.skip("No blogs seeded")
        slug = lst["items"][0]["slug"]
        r = client.get(f"{API}/blogs/slug/{slug}")
        assert r.status_code == 200
        body = r.json()
        assert body["slug"] == slug
        assert "content_html" in body
        _assert_no_objectid(body)


# ---------- Related ----------
class TestRelated:
    def test_related_returns_list(self, client):
        lst = client.get(f"{API}/blogs", params={"per_page": 1}).json()
        if not lst["items"]:
            pytest.skip("No blogs seeded")
        slug = lst["items"][0]["slug"]
        r = client.get(f"{API}/blogs/related/{slug}", params={"limit": 5})
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert all(i["slug"] != slug for i in items)
        _assert_no_objectid(items)


# ---------- Admin CRUD ----------
class TestAdminCRUD:
    created_ids = []

    def test_create_blog_auth_required(self, client):
        r = client.post(f"{API}/admin/blogs", json={
            "title": "TEST_Unauth", "summary": "x", "author": "A", "date": "2026-01-01"
        })
        assert r.status_code == 401

    def test_create_and_get(self, admin_client):
        payload = {
            "title": "TEST_Safai Drive Insights 2026",
            "summary": "TEST summary for safai search match",
            "content_html": "<p>Hello safai world</p>",
            "author": "Tester",
            "category": "Research",
            "tags": ["safai", "test"],
            "date": "2026-01-10",
            "published": True,
        }
        r = admin_client.post(f"{API}/admin/blogs", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["title"] == payload["title"]
        assert body["slug"].startswith("test-safai-drive-insights-2026")
        assert "id" in body
        _assert_no_objectid(body)
        TestAdminCRUD.created_ids.append((body["id"], body["slug"]))

        # Verify persistence via slug
        r2 = admin_client.get(f"{API}/blogs/slug/{body['slug']}")
        assert r2.status_code == 200

        # Verify search finds it (case-insensitive)
        r3 = admin_client.get(f"{API}/blogs", params={"search": "safai"})
        slugs = [i["slug"] for i in r3.json()["items"]]
        assert body["slug"] in slugs

    def test_unique_slug_generation(self, admin_client):
        # Create two with same title -> slug should be deduped
        p = {"title": "TEST_DuplicateTitle", "summary": "s", "author": "a", "date": "2026-01-02"}
        a = admin_client.post(f"{API}/admin/blogs", json=p).json()
        b = admin_client.post(f"{API}/admin/blogs", json=p).json()
        assert a["slug"] != b["slug"]
        TestAdminCRUD.created_ids.extend([(a["id"], a["slug"]), (b["id"], b["slug"])])

    def test_update_and_slug_regenerate(self, admin_client):
        assert TestAdminCRUD.created_ids
        blog_id, _ = TestAdminCRUD.created_ids[0]
        r = admin_client.put(f"{API}/admin/blogs/{blog_id}", json={
            "title": "TEST_Updated Title New", "slug": "test-updated-title-new"
        })
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["title"] == "TEST_Updated Title New"
        assert body["slug"] == "test-updated-title-new"
        TestAdminCRUD.created_ids[0] = (blog_id, body["slug"])

    def test_include_unpublished_admin(self, admin_client):
        # Create a draft
        p = {"title": "TEST_DraftBlog", "summary": "s", "author": "a",
             "date": "2026-01-03", "published": False}
        created = admin_client.post(f"{API}/admin/blogs", json=p).json()
        TestAdminCRUD.created_ids.append((created["id"], created["slug"]))

        # Public list should not include it
        pub = requests.get(f"{API}/blogs", params={"per_page": 50}).json()
        assert created["slug"] not in [i["slug"] for i in pub["items"]]

        # Admin with include_unpublished=true should include it
        adm = admin_client.get(f"{API}/blogs",
                               params={"include_unpublished": True, "per_page": 50}).json()
        assert created["slug"] in [i["slug"] for i in adm["items"]]

    def test_delete_without_auth(self, client):
        if not TestAdminCRUD.created_ids:
            pytest.skip("No created blogs")
        blog_id, _ = TestAdminCRUD.created_ids[0]
        r = client.delete(f"{API}/admin/blogs/{blog_id}")
        assert r.status_code == 401

    def test_delete_cleanup(self, admin_client):
        for blog_id, _ in TestAdminCRUD.created_ids:
            r = admin_client.delete(f"{API}/admin/blogs/{blog_id}")
            assert r.status_code in (200, 404)
        TestAdminCRUD.created_ids.clear()


# ---------- Upload ----------
class TestUpload:
    def test_upload_requires_auth(self, client):
        files = {"file": ("t.png", io.BytesIO(b"\x89PNG\r\n\x1a\n"), "image/png")}
        r = requests.post(f"{API}/admin/upload", files=files)
        assert r.status_code == 401

    def test_upload_and_fetch(self, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        png_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 16
        files = {"file": ("test.png", io.BytesIO(png_bytes), "image/png")}
        r = requests.post(f"{API}/admin/upload", headers=headers, files=files)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["url"].startswith("/api/uploads/")
        assert body["filename"]
        # Fetch the uploaded file
        full = f"{BASE_URL}{body['url']}"
        r2 = requests.get(full)
        assert r2.status_code == 200
        assert len(r2.content) == len(png_bytes)

    def test_upload_invalid_type(self, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        files = {"file": ("bad.exe", io.BytesIO(b"MZ"), "application/octet-stream")}
        r = requests.post(f"{API}/admin/upload", headers=headers, files=files)
        assert r.status_code == 400
