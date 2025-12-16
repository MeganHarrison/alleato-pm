-- Create cost_code_divisions table (parent table for cost code categories)
CREATE TABLE IF NOT EXISTS public.cost_code_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,  -- e.g., "01", "02", etc.
    title TEXT NOT NULL,         -- e.g., "01 General Requirements", "02 Existing Conditions"
    sort_order INTEGER NOT NULL DEFAULT 999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cost_codes table
CREATE TABLE IF NOT EXISTS public.cost_codes (
    id TEXT PRIMARY KEY,         -- e.g., "01-1000", "02-2010"
    division TEXT NOT NULL,      -- e.g., "01", "02" (references cost_code_divisions.code)
    division_title TEXT,         -- Denormalized for quick access
    description TEXT NOT NULL,   -- e.g., "Supervision", "Demolition"
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_division FOREIGN KEY (division) REFERENCES public.cost_code_divisions(code) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cost_codes_division ON public.cost_codes(division);
CREATE INDEX IF NOT EXISTS idx_cost_code_divisions_sort_order ON public.cost_code_divisions(sort_order);

-- Enable RLS (Row Level Security)
ALTER TABLE public.cost_code_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all authenticated users to read)
CREATE POLICY "Allow authenticated users to read cost_code_divisions"
    ON public.cost_code_divisions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read cost_codes"
    ON public.cost_codes FOR SELECT
    TO authenticated
    USING (true);

-- Insert standard CSI MasterFormat divisions
INSERT INTO public.cost_code_divisions (code, title, sort_order) VALUES
('01', '01 General Requirements', 1),
('02', '02 Existing Conditions', 2),
('03', '03 Concrete', 3),
('04', '04 Masonry', 4),
('05', '05 Metals', 5),
('06', '06 Wood, Plastics, and Composites', 6),
('07', '07 Thermal and Moisture Protection', 7),
('08', '08 Openings', 8),
('09', '09 Finishes', 9),
('10', '10 Specialties', 10),
('11', '11 Equipment', 11),
('12', '12 Furnishings', 12),
('13', '13 Special Construction', 13),
('14', '14 Conveying Equipment', 14),
('21', '21 Fire Suppression', 15),
('22', '22 Plumbing', 16),
('23', '23 HVAC', 17),
('26', '26 Electrical', 18),
('27', '27 Communications', 19),
('28', '28 Electronic Safety and Security', 20),
('31', '31 Earthwork', 21),
('32', '32 Exterior Improvements', 22),
('33', '33 Utilities', 23)
ON CONFLICT (code) DO NOTHING;

-- Insert sample cost codes for Division 01 - General Requirements
INSERT INTO public.cost_codes (id, division, division_title, description) VALUES
('01-1000', '01', '01 General Requirements', 'Project Management & Coordination'),
('01-2000', '01', '01 General Requirements', 'Allowances'),
('01-3000', '01', '01 General Requirements', 'Administrative Requirements'),
('01-4000', '01', '01 General Requirements', 'Quality Requirements'),
('01-5000', '01', '01 General Requirements', 'Temporary Facilities & Controls'),
('01-6000', '01', '01 General Requirements', 'Product Requirements'),
('01-7000', '01', '01 General Requirements', 'Execution Requirements'),
('01-8000', '01', '01 General Requirements', 'Facility Operation'),
('01-9000', '01', '01 General Requirements', 'Performance Requirements')
ON CONFLICT (id) DO NOTHING;

-- Insert sample cost codes for Division 03 - Concrete
INSERT INTO public.cost_codes (id, division, division_title, description) VALUES
('03-1000', '03', '03 Concrete', 'Concrete Forming & Accessories'),
('03-2000', '03', '03 Concrete', 'Concrete Reinforcing'),
('03-3000', '03', '03 Concrete', 'Cast-in-Place Concrete'),
('03-4000', '03', '03 Concrete', 'Precast Concrete'),
('03-5000', '03', '03 Concrete', 'Cementitious Decks & Underlayment'),
('03-6000', '03', '03 Concrete', 'Grout'),
('03-7000', '03', '03 Concrete', 'Mass Concrete'),
('03-8000', '03', '03 Concrete', 'Concrete Cutting & Boring')
ON CONFLICT (id) DO NOTHING;

-- Insert sample cost codes for Division 09 - Finishes
INSERT INTO public.cost_codes (id, division, division_title, description) VALUES
('09-1000', '09', '09 Finishes', 'Plaster & Gypsum Board'),
('09-2000', '09', '09 Finishes', 'Tiling'),
('09-3000', '09', '09 Finishes', 'Ceilings'),
('09-4000', '09', '09 Finishes', 'Flooring'),
('09-5000', '09', '09 Finishes', 'Ceiling Finishes'),
('09-6000', '09', '09 Finishes', 'Flooring Treatment'),
('09-7000', '09', '09 Finishes', 'Wall Finishes'),
('09-8000', '09', '09 Finishes', 'Acoustic Treatment'),
('09-9000', '09', '09 Finishes', 'Paints & Coatings')
ON CONFLICT (id) DO NOTHING;
