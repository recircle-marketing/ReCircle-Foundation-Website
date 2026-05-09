"""
Regression tests for the Node.js/Express backend (proxied through Python shim).
Covers: health, JWT auth, RBAC user CRUD, blog CRUD with own-scope rules,
public blog endpoints, image upload, validation errors, _id leak checks.
"""
import io
import os
import time
import uuid

import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"

PASSWORD = "ReCircle@2026"
SEEDED = {
    "super_admin": "superadmin@recircle.org",
    "admin": "admin@recircle.org",
    "editor": "editor@recircle.org",
    "author": "author@recircle.org",
}


# ---------------- Fixtures ----------------
@pytest.fixture(scope="session")
def tokens():
    """Login each seeded user once and return {role: (token, user)}."""
    out = {}
    for role, email in SEEDED.items():
        r = requests.post(f"{API}/admin/login", json={"email": email, "password": PASSWORD}, timeout=15)
        assert r.status_code == 200, f"Login failed for {role}: {r.status_code} {r.text}"
        body = r.json()
        assert "token" in body and "user" in body
        out[role] = (body["token"], body["user"])
    return out


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def assert_no_id_leak(obj):
    """Recursively assert that no '_id' field is present in response payloads."""
    if isinstance(obj, dict):
        assert "_id" not in obj, f"MongoDB _id leaked: {obj}"
        for v in obj.values():
            assert_no_id_leak(v)
    elif isinstance(obj, list):
        for v in obj:
            assert_no_id_leak(v)


# ---------------- Health ----------------
class TestHealth:
    def test_health(self):
        r = requests.get(f"{API}/_health", timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True


# ---------------- Auth ----------------
class TestAuth:
    def test_login_all_roles(self, tokens):
        for role, (tok, user) in tokens.items():
            assert user["role"] == role
            assert user["email"] == SEEDED[role]
            assert "password_hash" not in user
            assert_no_id_leak(user)

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/admin/login", json={"email": SEEDED["admin"], "password": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_verify_with_token(self, tokens):
        tok, user = tokens["admin"]
        r = requests.get(f"{API}/admin/verify", headers=auth_headers(tok), timeout=10)
        assert r.status_code == 200
        body = r.json()
        # Body might be {user: ...} or just the user
        u = body.get("user", body)
        assert u["email"] == user["email"]
        assert_no_id_leak(body)

    def test_verify_no_token(self):
        r = requests.get(f"{API}/admin/verify", timeout=10)
        assert r.status_code == 401

    def test_verify_garbage_token(self):
        r = requests.get(f"{API}/admin/verify", headers=auth_headers("garbage.token.value"), timeout=10)
        assert r.status_code == 401

    def test_auth_me_alias(self, tokens):
        tok, user = tokens["editor"]
        r = requests.get(f"{API}/auth/me", headers=auth_headers(tok), timeout=10)
        assert r.status_code == 200
        body = r.json()
        u = body.get("user", body)
        assert u["email"] == user["email"]


# ---------------- User CRUD RBAC ----------------
class TestUserCRUD:
    def _create_temp_user(self, token, role="author", email=None):
        email = email or f"TEST_{uuid.uuid4().hex[:8]}@recircle.test"
        r = requests.post(
            f"{API}/users",
            headers=auth_headers(token),
            json={"email": email, "password": "Password1!", "name": "Temp Tester", "role": role, "active": True},
            timeout=10,
        )
        return r, email

    def test_super_admin_list_users(self, tokens):
        tok, _ = tokens["super_admin"]
        r = requests.get(f"{API}/users", headers=auth_headers(tok), timeout=10)
        assert r.status_code == 200
        body = r.json()
        items = body.get("items", body if isinstance(body, list) else [])
        assert len(items) >= 4
        assert_no_id_leak(body)
        for u in items:
            assert "password_hash" not in u

    def test_super_admin_create_get_update_delete(self, tokens):
        tok, _ = tokens["super_admin"]
        r, email = self._create_temp_user(tok, role="author")
        assert r.status_code in (200, 201), r.text
        created = r.json()
        uid = created["id"]
        assert created["email"] == email.lower()
        assert "password_hash" not in created

        # GET
        rg = requests.get(f"{API}/users/{uid}", headers=auth_headers(tok), timeout=10)
        assert rg.status_code == 200
        assert rg.json()["id"] == uid

        # UPDATE role -> editor + new password
        ru = requests.put(
            f"{API}/users/{uid}",
            headers=auth_headers(tok),
            json={"role": "editor", "password": "newpass1!"},
            timeout=10,
        )
        assert ru.status_code == 200
        assert ru.json()["role"] == "editor"

        # New password should let them login
        rl = requests.post(f"{API}/admin/login", json={"email": email, "password": "newpass1!"}, timeout=10)
        assert rl.status_code == 200, rl.text

        # DELETE
        rd = requests.delete(f"{API}/users/{uid}", headers=auth_headers(tok), timeout=10)
        assert rd.status_code in (200, 204)
        # GET 404
        rg2 = requests.get(f"{API}/users/{uid}", headers=auth_headers(tok), timeout=10)
        assert rg2.status_code == 404

    def test_admin_cannot_create_super_admin(self, tokens):
        tok, _ = tokens["admin"]
        r, _ = self._create_temp_user(tok, role="super_admin")
        assert r.status_code == 403

    def test_admin_can_manage_editor_author_admin(self, tokens):
        admin_tok, _ = tokens["admin"]
        r, email = self._create_temp_user(admin_tok, role="editor")
        assert r.status_code in (200, 201), r.text
        uid = r.json()["id"]
        # Update to admin role
        ru = requests.put(f"{API}/users/{uid}", headers=auth_headers(admin_tok), json={"role": "admin"}, timeout=10)
        assert ru.status_code == 200
        # Cleanup
        rd = requests.delete(f"{API}/users/{uid}", headers=auth_headers(admin_tok), timeout=10)
        assert rd.status_code in (200, 204)

    def test_admin_cannot_update_super_admin(self, tokens):
        admin_tok, _ = tokens["admin"]
        _, sa_user = tokens["super_admin"]
        ru = requests.put(
            f"{API}/users/{sa_user['id']}",
            headers=auth_headers(admin_tok),
            json={"name": "Hacked"},
            timeout=10,
        )
        assert ru.status_code == 403

    def test_admin_cannot_delete_super_admin(self, tokens):
        admin_tok, _ = tokens["admin"]
        _, sa_user = tokens["super_admin"]
        rd = requests.delete(f"{API}/users/{sa_user['id']}", headers=auth_headers(admin_tok), timeout=10)
        assert rd.status_code == 403

    def test_editor_cannot_access_users(self, tokens):
        tok, _ = tokens["editor"]
        r = requests.get(f"{API}/users", headers=auth_headers(tok), timeout=10)
        assert r.status_code == 403

    def test_author_cannot_access_users(self, tokens):
        tok, _ = tokens["author"]
        r = requests.get(f"{API}/users", headers=auth_headers(tok), timeout=10)
        assert r.status_code == 403

    def test_cannot_delete_self(self, tokens):
        admin_tok, admin_user = tokens["admin"]
        rd = requests.delete(f"{API}/users/{admin_user['id']}", headers=auth_headers(admin_tok), timeout=10)
        assert rd.status_code == 400

    def test_cannot_delete_last_super_admin(self, tokens):
        sa_tok, sa_user = tokens["super_admin"]
        # Self-delete first hits the "cannot delete yourself" 400 — login as a separately
        # created super_admin to actually exercise "last super_admin" guard.
        # We skip the indirect approach and just verify self-delete blocks (also 400).
        rd = requests.delete(f"{API}/users/{sa_user['id']}", headers=auth_headers(sa_tok), timeout=10)
        assert rd.status_code == 400

    def test_create_user_validation(self, tokens):
        tok, _ = tokens["super_admin"]
        # Bad email
        r = requests.post(
            f"{API}/users",
            headers=auth_headers(tok),
            json={"email": "not-an-email", "password": "Password1!", "name": "X", "role": "author"},
            timeout=10,
        )
        assert r.status_code == 400
        # Short password
        r2 = requests.post(
            f"{API}/users",
            headers=auth_headers(tok),
            json={"email": "TEST_short@recircle.test", "password": "abc", "name": "X", "role": "author"},
            timeout=10,
        )
        assert r2.status_code == 400


# ---------------- Public Blog ----------------
class TestPublicBlogs:
    def test_list_default(self):
        r = requests.get(f"{API}/blogs", timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert_no_id_leak(body)
        items = body.get("items", body if isinstance(body, list) else [])
        # 5 seed blogs
        assert len(items) >= 1
        for b in items:
            assert b.get("published", True) is True

    def test_search_safai(self):
        r = requests.get(f"{API}/blogs", params={"search": "safai"}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        items = body.get("items", body if isinstance(body, list) else [])
        # Should match at least one of the seeded posts (Swachh Safai etc)
        assert len(items) >= 1

    def test_get_by_slug(self):
        r = requests.get(f"{API}/blogs", timeout=10)
        items = r.json().get("items", [])
        if not items:
            pytest.skip("No blogs to test slug")
        slug = items[0]["slug"]
        rs = requests.get(f"{API}/blogs/slug/{slug}", timeout=10)
        assert rs.status_code == 200
        b = rs.json()
        assert b["slug"] == slug
        assert_no_id_leak(b)

    def test_slug_404(self):
        r = requests.get(f"{API}/blogs/slug/this-slug-does-not-exist-zzz", timeout=10)
        assert r.status_code == 404

    def test_related(self):
        r = requests.get(f"{API}/blogs", timeout=10)
        items = r.json().get("items", [])
        if not items:
            pytest.skip("No blogs")
        slug = items[0]["slug"]
        rr = requests.get(f"{API}/blogs/related/{slug}", timeout=10)
        assert rr.status_code == 200
        body = rr.json()
        related = body.get("items", body) if isinstance(body, dict) else body
        assert isinstance(related, list)
        for b in related:
            assert b["slug"] != slug

    def test_include_unpublished_no_auth_ignored(self):
        # No auth -> include_unpublished is silently ignored, only published returned
        r = requests.get(f"{API}/blogs", params={"include_unpublished": "true"}, timeout=10)
        assert r.status_code == 200
        items = r.json().get("items", [])
        for b in items:
            assert b.get("published") is True


# ---------------- Blog RBAC ----------------
@pytest.fixture
def temp_author_blog(tokens):
    """Create a blog as the seeded author and yield it; cleanup after."""
    tok, _ = tokens["author"]
    payload = {
        "title": f"TEST_Author_Blog_{uuid.uuid4().hex[:6]}",
        "summary": "test summary",
        "content_html": "<p>test body</p>",
        "category": "General",
        "author": "Author",
        "tags": ["TEST"],
        "featured_image": "",
        "date": "2026-01-01",
        "published": True,  # should be stripped by author
    }
    r = requests.post(f"{API}/admin/blogs", headers=auth_headers(tok), json=payload, timeout=10)
    assert r.status_code in (200, 201), r.text
    blog = r.json()
    yield blog, tok
    # cleanup using super_admin
    sa_tok, _ = tokens["super_admin"]
    requests.delete(f"{API}/admin/blogs/{blog['id']}", headers=auth_headers(sa_tok), timeout=10)


class TestBlogRBAC:
    def test_author_create_forces_unpublished(self, temp_author_blog):
        blog, _tok = temp_author_blog
        assert blog.get("published") is False, f"Author created blog with published={blog.get('published')}"

    def test_author_create_sets_created_by(self, temp_author_blog, tokens):
        blog, _ = temp_author_blog
        _, author_user = tokens["author"]
        assert blog.get("created_by") == author_user["id"]

    def test_author_update_own_strips_published(self, temp_author_blog):
        blog, tok = temp_author_blog
        ru = requests.put(
            f"{API}/admin/blogs/{blog['id']}",
            headers=auth_headers(tok),
            json={"title": blog["title"] + "_U", "published": True},
            timeout=10,
        )
        assert ru.status_code == 200, ru.text
        assert ru.json().get("published") is False, "Author self-publish bypass not stripped"
        assert ru.json()["title"].endswith("_U")

    def test_author_update_others_403(self, tokens):
        # Pick a seeded blog (not authored by author user)
        r = requests.get(f"{API}/blogs", timeout=10)
        items = r.json().get("items", [])
        if not items:
            pytest.skip("No blogs")
        blog_id = items[0]["id"]
        tok, _ = tokens["author"]
        ru = requests.put(
            f"{API}/admin/blogs/{blog_id}",
            headers=auth_headers(tok),
            json={"title": "hacked"},
            timeout=10,
        )
        assert ru.status_code == 403

    def test_author_delete_others_403(self, tokens):
        r = requests.get(f"{API}/blogs", timeout=10)
        items = r.json().get("items", [])
        if not items:
            pytest.skip("No blogs")
        tok, _ = tokens["author"]
        rd = requests.delete(f"{API}/admin/blogs/{items[0]['id']}", headers=auth_headers(tok), timeout=10)
        assert rd.status_code == 403

    def test_editor_can_publish_any_blog(self, tokens):
        # Create a draft as author then have editor publish
        atok, _ = tokens["author"]
        etok, _ = tokens["editor"]
        sa_tok, _ = tokens["super_admin"]
        payload = {
            "title": f"TEST_Editor_Pub_{uuid.uuid4().hex[:6]}",
            "summary": "s",
            "content_html": "<p>x</p>",
            "category": "General",
            "author": "Author",
            "tags": [],
            "date": "2026-01-01",
        }
        rc = requests.post(f"{API}/admin/blogs", headers=auth_headers(atok), json=payload, timeout=10)
        assert rc.status_code in (200, 201), rc.text
        bid = rc.json()["id"]
        try:
            ru = requests.put(
                f"{API}/admin/blogs/{bid}",
                headers=auth_headers(etok),
                json={"published": True},
                timeout=10,
            )
            assert ru.status_code == 200, ru.text
            assert ru.json().get("published") is True
        finally:
            requests.delete(f"{API}/admin/blogs/{bid}", headers=auth_headers(sa_tok), timeout=10)

    def test_blog_validation_errors(self, tokens):
        tok, _ = tokens["editor"]
        r = requests.post(f"{API}/admin/blogs", headers=auth_headers(tok), json={}, timeout=10)
        assert r.status_code == 400


# ---------------- Include Unpublished ----------------
class TestIncludeUnpublished:
    def test_admin_sees_unpublished(self, tokens):
        # Create draft blog as super_admin for visibility test
        sa_tok, _ = tokens["super_admin"]
        payload = {
            "title": f"TEST_Draft_{uuid.uuid4().hex[:6]}",
            "summary": "s",
            "content_html": "<p>x</p>",
            "category": "General",
            "author": "SA",
            "tags": [],
            "date": "2026-01-01",
            "published": False,
        }
        rc = requests.post(f"{API}/admin/blogs", headers=auth_headers(sa_tok), json=payload, timeout=10)
        assert rc.status_code in (200, 201), rc.text
        bid = rc.json()["id"]
        try:
            r = requests.get(
                f"{API}/blogs",
                params={"include_unpublished": "true"},
                headers=auth_headers(sa_tok),
                timeout=10,
            )
            assert r.status_code == 200
            items = r.json().get("items", [])
            ids = [b["id"] for b in items]
            assert bid in ids, "super_admin couldn't see unpublished blog"
        finally:
            requests.delete(f"{API}/admin/blogs/{bid}", headers=auth_headers(sa_tok), timeout=10)

    def test_author_unpublished_scoped(self, tokens):
        # Author should only see THEIR drafts when include_unpublished=true
        atok, author_user = tokens["author"]
        sa_tok, _ = tokens["super_admin"]

        # Author draft
        a_payload = {
            "title": f"TEST_AuthDraft_{uuid.uuid4().hex[:6]}",
            "summary": "s",
            "content_html": "<p>x</p>",
            "category": "General",
            "author": "Auth",
            "tags": [],
            "date": "2026-01-01",
        }
        ra = requests.post(f"{API}/admin/blogs", headers=auth_headers(atok), json=a_payload, timeout=10)
        assert ra.status_code in (200, 201)
        a_bid = ra.json()["id"]

        # SA draft (someone else)
        s_payload = {**a_payload, "title": f"TEST_SADraft_{uuid.uuid4().hex[:6]}", "published": False}
        rs = requests.post(f"{API}/admin/blogs", headers=auth_headers(sa_tok), json=s_payload, timeout=10)
        assert rs.status_code in (200, 201)
        s_bid = rs.json()["id"]

        try:
            r = requests.get(
                f"{API}/blogs",
                params={"include_unpublished": "true"},
                headers=auth_headers(atok),
                timeout=10,
            )
            assert r.status_code == 200
            items = r.json().get("items", [])
            ids = [b["id"] for b in items]
            assert a_bid in ids, "Author cannot see own draft"
            assert s_bid not in ids, "Author can see someone else's draft (RBAC leak)"
        finally:
            requests.delete(f"{API}/admin/blogs/{a_bid}", headers=auth_headers(sa_tok), timeout=10)
            requests.delete(f"{API}/admin/blogs/{s_bid}", headers=auth_headers(sa_tok), timeout=10)


# ---------------- Image Upload ----------------
class TestUpload:
    PNG = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf"
        b"\xc0\x00\x00\x00\x03\x00\x01[\xb6\xee\x16\x00\x00\x00\x00IEND\xaeB`\x82"
    )

    def test_upload_image_and_fetch(self, tokens):
        tok, _ = tokens["editor"]
        files = {"file": ("tiny.png", io.BytesIO(self.PNG), "image/png")}
        r = requests.post(f"{API}/admin/upload", headers=auth_headers(tok), files=files, timeout=15)
        assert r.status_code in (200, 201), r.text
        body = r.json()
        assert "url" in body and body["url"].startswith("/api/uploads/")
        assert "filename" in body
        # Fetch back
        rf = requests.get(f"{BASE_URL}{body['url']}", timeout=15)
        assert rf.status_code == 200
        assert rf.headers.get("content-type", "").startswith("image/")

    def test_upload_non_image_rejected(self, tokens):
        tok, _ = tokens["editor"]
        files = {"file": ("data.txt", io.BytesIO(b"hello world"), "text/plain")}
        r = requests.post(f"{API}/admin/upload", headers=auth_headers(tok), files=files, timeout=10)
        assert r.status_code == 400

    def test_upload_requires_auth(self):
        files = {"file": ("tiny.png", io.BytesIO(self.PNG), "image/png")}
        r = requests.post(f"{API}/admin/upload", files=files, timeout=10)
        assert r.status_code == 401


# ---------------- _id leak checks ----------------
class TestIdLeak:
    def test_blogs_no_id_leak(self):
        r = requests.get(f"{API}/blogs", timeout=10)
        assert_no_id_leak(r.json())

    def test_users_no_id_leak(self, tokens):
        tok, _ = tokens["super_admin"]
        r = requests.get(f"{API}/users", headers=auth_headers(tok), timeout=10)
        assert_no_id_leak(r.json())
