-- Daily Logs Tables
-- Based on entity matrix and permission indicators

-- Daily Logs
CREATE TABLE daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weather_conditions TEXT,
  temperature_high INTEGER,
  temperature_low INTEGER,
  manpower_count INTEGER,
  status daily_log_status NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, log_date)
);

-- Daily Log Entries (detailed activities)
CREATE TABLE daily_log_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('work_performed', 'visitors', 'deliveries', 'equipment', 'safety_incident', 'other')),
  entry_time TIME,
  description TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  cost_code_id UUID REFERENCES cost_codes(id),
  quantity DECIMAL(15,4),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Daily Log Manpower (track workers by company/trade)
CREATE TABLE daily_log_manpower (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id),
  trade TEXT,
  worker_count INTEGER NOT NULL CHECK (worker_count > 0),
  hours_worked DECIMAL(4,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(daily_log_id, company_id, trade)
);

-- Create indexes
CREATE INDEX idx_daily_logs_project ON daily_logs(project_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_status ON daily_logs(status);
CREATE INDEX idx_daily_log_entries_log ON daily_log_entries(daily_log_id);
CREATE INDEX idx_daily_log_entries_type ON daily_log_entries(entry_type);
CREATE INDEX idx_daily_log_manpower_log ON daily_log_manpower(daily_log_id);
CREATE INDEX idx_daily_log_manpower_company ON daily_log_manpower(company_id);

-- Add update triggers
CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_log_entries_updated_at BEFORE UPDATE ON daily_log_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_manpower ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Daily logs viewable by project members
CREATE POLICY "Daily logs viewable by project members" ON daily_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = daily_logs.project_id 
      AND project_users.user_id = auth.uid()
    )
  );

-- Daily log entries follow parent log permissions
CREATE POLICY "Daily log entries viewable by project members" ON daily_log_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM daily_logs dl
      JOIN project_users pu ON pu.project_id = dl.project_id
      WHERE dl.id = daily_log_entries.daily_log_id
      AND pu.user_id = auth.uid()
    )
  );

-- Daily log manpower follow parent log permissions
CREATE POLICY "Daily log manpower viewable by project members" ON daily_log_manpower
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM daily_logs dl
      JOIN project_users pu ON pu.project_id = dl.project_id
      WHERE dl.id = daily_log_manpower.daily_log_id
      AND pu.user_id = auth.uid()
    )
  );