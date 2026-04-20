-- Sample local listings for MVP (Seattle / Bellevue, WA)

INSERT INTO public.local_data (type, city, state, data)
SELECT 'representative', 'Seattle', 'WA',
  '{"name":"Seattle City Council","title":"Legislative body","office":"Seattle City Hall","phone":"(206) 684-8888","website":"https://www.seattle.gov/council"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Seattle' AND d.state ILIKE 'WA'
    AND d.type = 'representative'
    AND d.data->>'website' = 'https://www.seattle.gov/council'
);

INSERT INTO public.local_data (type, city, state, data)
SELECT 'organization', 'Seattle', 'WA',
  '{"name":"Seattle Public Library — civic programs","mission":"Free programs on civics, citizenship, and community resources.","url":"https://www.spl.org"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Seattle' AND d.state ILIKE 'WA'
    AND d.type = 'organization'
    AND d.data->>'url' = 'https://www.spl.org'
);

INSERT INTO public.local_data (type, city, state, data)
SELECT 'event', 'Seattle', 'WA',
  '{"title":"Neighborhood council meeting (example)","datetime":"First Tuesday monthly, 7:00 p.m.","location":"Community center (check your district)","url":"https://www.seattle.gov/neighborhoods"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Seattle' AND d.state ILIKE 'WA'
    AND d.type = 'event'
    AND d.data->>'title' LIKE 'Neighborhood council%'
);

INSERT INTO public.local_data (type, city, state, data)
SELECT 'representative', 'Bellevue', 'WA',
  '{"name":"Bellevue City Council","title":"City legislative body","office":"Bellevue City Hall","phone":"(425) 452-6800","website":"https://bellevuewa.gov/city-government/departments/city-council"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Bellevue' AND d.state ILIKE 'WA'
    AND d.type = 'representative'
    AND d.data->>'website' LIKE '%bellevuewa.gov%'
);

INSERT INTO public.local_data (type, city, state, data)
SELECT 'organization', 'Bellevue', 'WA',
  '{"name":"Bellevue Library — community learning","mission":"Workshops and resources for new residents and civic engagement.","url":"https://www.kcls.org/locations/1430"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Bellevue' AND d.state ILIKE 'WA'
    AND d.type = 'organization'
    AND d.data->>'name' LIKE 'Bellevue Library%'
);

INSERT INTO public.local_data (type, city, state, data)
SELECT 'event', 'Bellevue', 'WA',
  '{"title":"City council study session (example)","datetime":"Check city calendar for dates","location":"Bellevue City Hall","url":"https://bellevuewa.gov/city-government/departments/city-council"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.local_data d
  WHERE d.city ILIKE 'Bellevue' AND d.state ILIKE 'WA'
    AND d.type = 'event'
    AND d.data->>'title' LIKE 'City council study%'
);
