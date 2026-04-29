-- SQL to set up tables in Supabase --

-- 1. Create 'stats' table
CREATE TABLE IF NOT EXISTS stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'portfolio_items' table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist (Case where table was created before)
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS display_location TEXT DEFAULT 'portfolio';

-- 3. Create 'team_members' table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for easy local development
ALTER TABLE stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- 1. Create the 'uploads' bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Uploads (CRITICAL FIX)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'uploads');
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';


-- 4. Create 'tools' table
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create 'services' table (Using TEXT ID for slug-based management)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    deliverables TEXT[],
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS for new tables
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- 6. Create 'contacts' table for form submissions
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    service TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for contacts
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
