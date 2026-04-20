from __future__ import annotations

from supabase import Client

from models.schemas import CategoryOut, TopicExplanationOut, TopicSummaryOut


def _normalize_lang(lang: str) -> str:
    short = (lang or "en").strip().split("-", 1)[0].lower()[:10]
    return short if short else "en"


def list_categories(client: Client, lang: str) -> list[CategoryOut]:
    lang = _normalize_lang(lang)
    cats_res = (
        client.table("categories")
        .select("id, slug, icon, color, order_index")
        .order("order_index")
        .execute()
    )
    rows = cats_res.data or []
    if not rows:
        return []

    cat_ids = [str(c["id"]) for c in rows]

    tr_res = (
        client.table("category_translations")
        .select("category_id, name, description")
        .in_("category_id", cat_ids)
        .eq("language_code", lang)
        .execute()
    )
    tr_by_cat: dict[str, dict] = {str(r["category_id"]): r for r in (tr_res.data or [])}

    if lang != "en":
        tr_en = (
            client.table("category_translations")
            .select("category_id, name, description")
            .in_("category_id", cat_ids)
            .eq("language_code", "en")
            .execute()
        )
        for r in tr_en.data or []:
            cid = str(r["category_id"])
            tr_by_cat.setdefault(cid, r)

    topics_res = (
        client.table("topics")
        .select("category_id")
        .in_("category_id", cat_ids)
        .execute()
    )
    counts: dict[str, int] = {}
    for t in topics_res.data or []:
        cid = str(t["category_id"])
        counts[cid] = counts.get(cid, 0) + 1

    out: list[CategoryOut] = []
    for c in rows:
        cid = str(c["id"])
        tr = tr_by_cat.get(cid)
        name = (tr or {}).get("name") or str(c["slug"]).replace("-", " ").title()
        desc = (tr or {}).get("description") or ""
        color = (c.get("color") or "blue").lower()
        if color not in ("blue", "green"):
            color = "blue"
        out.append(
            CategoryOut(
                id=cid,
                slug=str(c["slug"]),
                icon=str(c.get("icon") or ""),
                color=color,
                name=str(name),
                description=str(desc),
                topic_count=counts.get(cid, 0),
            )
        )
    return out


def list_topics_for_category(
    client: Client, category_slug: str, lang: str
) -> list[TopicSummaryOut] | None:
    """Returns None if the category slug does not exist."""
    lang = _normalize_lang(lang)
    cat_res = (
        client.table("categories")
        .select("id")
        .eq("slug", category_slug)
        .limit(1)
        .execute()
    )
    if not cat_res.data:
        return None
    cid = str(cat_res.data[0]["id"])

    topics_res = (
        client.table("topics")
        .select("id, slug")
        .eq("category_id", cid)
        .order("order_index")
        .execute()
    )
    topic_rows = topics_res.data or []
    if not topic_rows:
        return []

    tids = [str(t["id"]) for t in topic_rows]

    tr_res = (
        client.table("topic_translations")
        .select("topic_id, title")
        .in_("topic_id", tids)
        .eq("language_code", lang)
        .execute()
    )
    titles: dict[str, str] = {
        str(r["topic_id"]): str(r["title"]) for r in (tr_res.data or [])
    }

    if lang != "en":
        tr_en = (
            client.table("topic_translations")
            .select("topic_id, title")
            .in_("topic_id", tids)
            .eq("language_code", "en")
            .execute()
        )
        for r in tr_en.data or []:
            tid = str(r["topic_id"])
            titles.setdefault(tid, str(r["title"]))

    out: list[TopicSummaryOut] = []
    for t in topic_rows:
        tid = str(t["id"])
        slug = str(t["slug"])
        title = titles.get(tid) or slug.replace("-", " ").title()
        out.append(TopicSummaryOut(id=tid, slug=slug, title=title))
    return out


def get_topic_explanation(
    client: Client, category_slug: str, topic_slug: str, lang: str
) -> TopicExplanationOut | None:
    """
    Returns None if category or topic is missing, or topic is not in that category.
    Uses topic_translations for `lang`, then falls back to English titles and body fields.
    """
    lang = _normalize_lang(lang)
    cat_res = (
        client.table("categories")
        .select("id")
        .eq("slug", category_slug)
        .limit(1)
        .execute()
    )
    if not cat_res.data:
        return None
    cid = str(cat_res.data[0]["id"])

    topic_res = (
        client.table("topics")
        .select("id, slug, category_id")
        .eq("slug", topic_slug)
        .eq("category_id", cid)
        .limit(1)
        .execute()
    )
    if not topic_res.data:
        return None
    topic = topic_res.data[0]
    tid = str(topic["id"])

    def fetch_row(code: str) -> dict | None:
        r = (
            client.table("topic_translations")
            .select("title, what_it_is, why_it_matters, what_you_can_do")
            .eq("topic_id", tid)
            .eq("language_code", code)
            .limit(1)
            .execute()
        )
        return (r.data or [None])[0]

    row = fetch_row(lang) or (fetch_row("en") if lang != "en" else None)
    if not row:
        title = str(topic["slug"]).replace("-", " ").title()
        return TopicExplanationOut(
            id=tid,
            category_id=cid,
            slug=str(topic["slug"]),
            title=title,
            what_it_is=None,
            why_it_matters=None,
            what_you_can_do=None,
        )

    return TopicExplanationOut(
        id=tid,
        category_id=cid,
        slug=str(topic["slug"]),
        title=str(row.get("title") or topic["slug"]).strip(),
        what_it_is=row.get("what_it_is"),
        why_it_matters=row.get("why_it_matters"),
        what_you_can_do=row.get("what_you_can_do"),
    )
