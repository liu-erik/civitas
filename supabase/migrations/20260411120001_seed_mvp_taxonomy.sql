-- MVP civic taxonomy (PRD.md) — idempotent inserts

-- Categories
INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'voting', 'Vote', 'blue', 10
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'voting');

INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'immigration-law', 'Globe', 'blue', 20
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'immigration-law');

INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'local-government', 'Landmark', 'blue', 30
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'local-government');

INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'rights-and-protections', 'Shield', 'blue', 40
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'rights-and-protections');

INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'how-to-get-involved', 'HandHelping', 'green', 50
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'how-to-get-involved');

INSERT INTO public.categories (slug, icon, color, order_index)
SELECT 'current-political-issues', 'Newspaper', 'blue', 60
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'current-political-issues');

-- Category translations (en, es, zh)
INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'Voting', 'Elections, registration, and how voting works in the United States.'
FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Votación', 'Elecciones, registro y cómo funciona el voto en Estados Unidos.'
FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '投票', '美国选举、选民登记与投票制度概览。'
FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'Immigration law', 'General information about immigration pathways and rules (not legal advice).'
FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Derecho migratorio', 'Información general sobre vías y normas migratorias (no es asesoría legal).'
FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '移民法', '关于移民途径与规则的概览信息（不构成法律建议）。'
FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'Local government', 'City councils, public meetings, and how to contact local officials.'
FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Gobierno local', 'Concejos municipales, reuniones públicas y cómo contactar autoridades locales.'
FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '地方政府', '市议会、公开会议以及如何联系地方官员。'
FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'Rights & protections', 'Rights in everyday life: police encounters, housing, work, and discrimination.'
FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Derechos y protecciones', 'Derechos en la vida cotidiana: interacciones con la policía, vivienda, trabajo y discriminación.'
FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '权利与保障', '日常生活中的权利：警察执法、住房、工作与歧视。'
FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'How to get involved', 'Practical steps: voting, contacting representatives, organizations, and events.'
FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Cómo participar', 'Pasos prácticos: votar, contactar representantes, organizaciones y eventos.'
FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '如何参与', '实用步骤：投票、联系代表、组织与活动。'
FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'en', 'Current political issues', 'Major issues, multiple perspectives, and how they affect immigrant communities.'
FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'en');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'es', 'Temas políticos actuales', 'Temas importantes, distintas perspectivas y su impacto en comunidades inmigrantes.'
FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'es');

INSERT INTO public.category_translations (category_id, language_code, name, description)
SELECT c.id, 'zh', '时政议题', '主要议题、不同视角及其对移民社区的影响。'
FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.category_translations x WHERE x.category_id = c.id AND x.language_code = 'zh');

-- Topics (global unique slug) + English titles only (API falls back to en for other langs)
INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'register-to-vote', 10 FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'register-to-vote');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'who-can-vote', 20 FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'who-can-vote');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'how-elections-work', 30 FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'how-elections-work');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'mail-in-voting', 40 FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'mail-in-voting');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'upcoming-local-elections', 50 FROM public.categories c WHERE c.slug = 'voting'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'upcoming-local-elections');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'police-stop-rights', 10 FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'police-stop-rights');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'tenant-rights', 20 FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'tenant-rights');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'workers-rights', 30 FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'workers-rights');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'anti-discrimination-rights', 40 FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'anti-discrimination-rights');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'immigration-rights-basics', 50 FROM public.categories c WHERE c.slug = 'rights-and-protections'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'immigration-rights-basics');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'city-council-basics', 10 FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'city-council-basics');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'public-meetings', 20 FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'public-meetings');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'contact-your-representative', 30 FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'contact-your-representative');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'mayor-council-role', 40 FROM public.categories c WHERE c.slug = 'local-government'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'mayor-council-role');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'register-to-vote-steps', 10 FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'register-to-vote-steps');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'contact-representative-templates', 20 FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'contact-representative-templates');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'local-community-orgs', 30 FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'local-community-orgs');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'civic-events-your-city', 40 FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'civic-events-your-city');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'city-council-attendance', 50 FROM public.categories c WHERE c.slug = 'how-to-get-involved'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'city-council-attendance');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'major-issues-overview', 10 FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'major-issues-overview');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'perspectives-neutral', 20 FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'perspectives-neutral');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'issues-and-immigrants', 30 FROM public.categories c WHERE c.slug = 'current-political-issues'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'issues-and-immigrants');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'immigration-law-overview', 10 FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'immigration-law-overview');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'paths-to-legal-status', 20 FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'paths-to-legal-status');

INSERT INTO public.topics (category_id, slug, order_index)
SELECT c.id, 'work-and-visas-basics', 30 FROM public.categories c WHERE c.slug = 'immigration-law'
AND NOT EXISTS (SELECT 1 FROM public.topics WHERE slug = 'work-and-visas-basics');

-- English topic titles
INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to register to vote' FROM public.topics t WHERE t.slug = 'register-to-vote'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Who is eligible to vote' FROM public.topics t WHERE t.slug = 'who-can-vote'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How elections work' FROM public.topics t WHERE t.slug = 'how-elections-work'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Mail-in voting' FROM public.topics t WHERE t.slug = 'mail-in-voting'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Upcoming local elections' FROM public.topics t WHERE t.slug = 'upcoming-local-elections'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Rights during police interactions' FROM public.topics t WHERE t.slug = 'police-stop-rights'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Tenant rights' FROM public.topics t WHERE t.slug = 'tenant-rights'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Workers'' rights' FROM public.topics t WHERE t.slug = 'workers-rights'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Right to not be discriminated against' FROM public.topics t WHERE t.slug = 'anti-discrimination-rights'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Immigration rights' FROM public.topics t WHERE t.slug = 'immigration-rights-basics'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How city council works' FROM public.topics t WHERE t.slug = 'city-council-basics'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to attend a public meeting' FROM public.topics t WHERE t.slug = 'public-meetings'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to contact your representative' FROM public.topics t WHERE t.slug = 'contact-your-representative'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'What your mayor or council member does' FROM public.topics t WHERE t.slug = 'mayor-council-role'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to register to vote (action steps)' FROM public.topics t WHERE t.slug = 'register-to-vote-steps'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to contact your representative (templates)' FROM public.topics t WHERE t.slug = 'contact-representative-templates'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Local community organizations near you' FROM public.topics t WHERE t.slug = 'local-community-orgs'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Upcoming civic events in your city' FROM public.topics t WHERE t.slug = 'civic-events-your-city'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How to attend city council meetings' FROM public.topics t WHERE t.slug = 'city-council-attendance'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Overview of major current issues' FROM public.topics t WHERE t.slug = 'major-issues-overview'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Different perspectives explained neutrally' FROM public.topics t WHERE t.slug = 'perspectives-neutral'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'How issues affect immigrant communities' FROM public.topics t WHERE t.slug = 'issues-and-immigrants'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Overview of immigration law basics' FROM public.topics t WHERE t.slug = 'immigration-law-overview'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Paths to legal status' FROM public.topics t WHERE t.slug = 'paths-to-legal-status'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');

INSERT INTO public.topic_translations (topic_id, language_code, title)
SELECT t.id, 'en', 'Work and visas basics' FROM public.topics t WHERE t.slug = 'work-and-visas-basics'
AND NOT EXISTS (SELECT 1 FROM public.topic_translations x WHERE x.topic_id = t.id AND x.language_code = 'en');
