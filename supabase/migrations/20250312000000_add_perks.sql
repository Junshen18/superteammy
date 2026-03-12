-- Perks table for member dashboard (ETHGlobal-style layout)
CREATE TABLE IF NOT EXISTS perks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  value_badge TEXT DEFAULT '',
  icon_url TEXT DEFAULT '',
  redeem_url TEXT DEFAULT '',
  redeem_label TEXT DEFAULT 'Redeem',
  is_limited BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE perks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read perks" ON perks FOR SELECT USING (true);
CREATE POLICY "Admin insert perks" ON perks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update perks" ON perks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete perks" ON perks FOR DELETE USING (auth.role() = 'authenticated');

-- Storage bucket for perk icons (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('perk-icons', 'perk-icons', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read perk icons"
ON storage.objects FOR SELECT
USING (bucket_id = 'perk-icons');

CREATE POLICY "Admin upload perk icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'perk-icons');

CREATE POLICY "Admin update perk icons"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'perk-icons');

CREATE POLICY "Admin delete perk icons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'perk-icons');
