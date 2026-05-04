"""Seed sample blogs for ReCircle Foundation Knowledge Centre.

Run: python -m backend.scripts.seed_blogs  (from /app)
or:  python /app/backend/scripts/seed_blogs.py
"""
import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from slugify import slugify
import uuid

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / '.env')
sys.path.insert(0, str(ROOT.parent))

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


SAMPLE_BLOGS = [
    {
        "title": "Why Formalising Safai Saathis Is the Missing Link in India's Circular Economy",
        "summary": "India's recycling system runs on the labour of waste workers who remain invisible to the formal economy. Recognising and protecting them is the first step toward a truly inclusive circular future.",
        "featured_image": "https://recircle.in/wp-content/uploads/2026/03/FORMALISATION-OF-SAFAI-SAATHIS-1.png",
        "author": "Rahul Nainani",
        "category": "Safai Saathis",
        "tags": ["formalisation", "livelihoods", "policy"],
        "days_ago": 0,
        "content_html": (
            "<p>India recovers an estimated 60% of its recyclable waste, and almost all of that work is carried out by informal waste workers—Safai Saathis—who lack formal recognition, social security, and access to basic protective equipment.</p>"
            "<h2>Where the system breaks</h2>"
            "<p>Despite being the backbone of recovery, Safai Saathis are not visible in formal data, payrolls, or supply chains. This invisibility means they have:</p>"
            "<ul><li>No fair wage benchmarks</li><li>No insurance or healthcare access</li><li>No bargaining power with aggregators</li></ul>"
            "<h2>What formalisation looks like</h2>"
            "<p>Formalisation is more than issuing ID cards. It is about creating dignified employment with predictable income, safe working conditions, and a verifiable place in the value chain.</p>"
            "<blockquote>If circularity can give materials a second life, why should people be left behind?</blockquote>"
            "<p>That is the question we keep returning to. Through partnerships with corporates, urban local bodies, and ecosystem players, ReCircle Foundation is building the social infrastructure that makes formalisation real on the ground.</p>"
        ),
    },
    {
        "title": "From Landfill to Loop: How Material Recovery Reduces Climate Risk",
        "summary": "Every kilo of waste diverted from a landfill is a small but real climate intervention. Here is how organised recovery systems compound into measurable environmental outcomes.",
        "featured_image": "https://recircle.in/wp-content/uploads/2025/11/image-2.jpeg",
        "author": "Gurashish Sahni",
        "category": "Waste Diversion",
        "tags": ["climate", "recovery", "esg"],
        "days_ago": 5,
        "content_html": (
            "<p>Landfills are not neutral storage; they are slow-release emitters of methane, leachate, and microplastics. Organised material recovery flips that equation.</p>"
            "<h2>Why diversion matters</h2>"
            "<p>India generates over 20 million tonnes of recoverable waste each year. Most of it never makes it back into the circular loop because collection is fragmented, sorting is inconsistent, and processing capacity is unevenly distributed.</p>"
            "<h2>The compounding effect</h2>"
            "<p>When recovery is structured—traceable bins, trained collection teams, verified processors—it does three things at once:</p>"
            "<ul><li>Reduces emissions by displacing virgin material extraction</li><li>Prevents waste from reaching ecologically sensitive zones</li><li>Generates dignified work in the recovery economy</li></ul>"
            "<p>For CSR teams, this is a rare opportunity: an intervention that delivers climate, social, and governance value simultaneously.</p>"
        ),
    },
    {
        "title": "Behaviour Change Begins at the Bin: A Field Note from Mumbai's Housing Societies",
        "summary": "We spent six months working with residents in Mumbai. The biggest unlock for circularity was not technology — it was a clearer label, a friendlier conversation, and a small daily ritual.",
        "featured_image": "https://recircle.in/wp-content/uploads/2026/03/DRIVING-BEHAVIORAL-CHANGE.png",
        "author": "Shraddha Shelatkar",
        "category": "Behavioural Change",
        "tags": ["awareness", "community", "iec"],
        "days_ago": 12,
        "content_html": (
            "<p>Behaviour change is often pitched as a campaign. We have come to believe it is closer to a habit—small, repeatable, and contagious.</p>"
            "<h2>What worked</h2>"
            "<ol><li>Replacing technical labels with everyday language</li><li>Putting bins where people already pause</li><li>Letting Safai Saathis themselves explain segregation</li></ol>"
            "<h2>What didn't</h2>"
            "<p>Glossy posters. One-time workshops. Top-down mandates without context.</p>"
            "<p>The lesson: programmes that respect the everyday rhythm of households outperform programmes that ask people to change everything at once.</p>"
        ),
    },
    {
        "title": "Designing Transparent Waste Systems: Why Traceability Is the New Trust",
        "summary": "Traceability turns waste recovery from a black box into a trusted supply chain. It is also the single biggest enabler of corporate accountability under EPR.",
        "featured_image": "https://recircle.in/wp-content/uploads/2026/03/Waste-to-resource2.png",
        "author": "Rohit Lalwani",
        "category": "Innovation",
        "tags": ["traceability", "epr", "infrastructure"],
        "days_ago": 22,
        "content_html": (
            "<p>Extended Producer Responsibility (EPR) regulations have moved waste from a back-office cost to a board-room conversation.</p>"
            "<h2>From paper trails to digital trails</h2>"
            "<p>For decades, waste flowed through informal aggregators with no audit trail. Today, modern recovery systems can record:</p>"
            "<ul><li>Where the waste was collected</li><li>Who recovered it</li><li>Which processor handled it</li><li>What it became next</li></ul>"
            "<p>That data is the difference between a CSR press release and a credible impact statement.</p>"
        ),
    },
    {
        "title": "The Quiet Economy: What Health Access Means for Frontline Waste Workers",
        "summary": "Healthcare for Safai Saathis is not a perk—it is the floor on which everything else stands. We share what we have learned from running mobile health camps across recovery sites.",
        "featured_image": "https://recircle.in/wp-content/uploads/2026/03/HEALTH-SAFETY-ACCESS-1.png",
        "author": "Shraddha Shelatkar",
        "category": "Health & Safety",
        "tags": ["healthcare", "safety", "livelihoods"],
        "days_ago": 35,
        "content_html": (
            "<p>Most Safai Saathis we work with have not had a basic medical check-up in over five years. That number alone tells you why health access cannot be optional.</p>"
            "<h2>What our camps cover</h2>"
            "<ul><li>Vital screenings and vaccinations</li><li>Respiratory and skin assessments</li><li>Linkage to public healthcare schemes</li></ul>"
            "<p>Health access is not charity. It is what makes the recovery economy resilient.</p>"
        ),
    },
]


async def seed():
    inserted = 0
    skipped = 0
    for i, b in enumerate(SAMPLE_BLOGS):
        date_obj = (datetime.now(timezone.utc) - timedelta(days=b["days_ago"])).date()
        slug = slugify(b["title"])
        existing = await db.blogs.find_one({"slug": slug}, {"_id": 0, "id": 1})
        if existing:
            skipped += 1
            continue
        doc = {
            "id": str(uuid.uuid4()),
            "slug": slug,
            "title": b["title"],
            "summary": b["summary"],
            "content_html": b["content_html"],
            "featured_image": b["featured_image"],
            "author": b["author"],
            "category": b["category"],
            "tags": b["tags"],
            "date": date_obj.isoformat(),
            "meta_title": b["title"],
            "meta_description": b["summary"],
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.blogs.insert_one(doc)
        inserted += 1
    print(f"Seed complete. Inserted={inserted} Skipped(existing)={skipped}")


if __name__ == "__main__":
    asyncio.run(seed())
