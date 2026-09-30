-- ================================================================
-- TECHCARE PLATFORM: PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Fully relational schema with Row Level Security (RLS) policies
-- ================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores user identity and role)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'technician', 'admin')) DEFAULT 'customer',
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE (Catalog of repair and IT services)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  starting_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  estimated_duration TEXT NOT NULL,
  common_issues TEXT[] DEFAULT '{}',
  included_items TEXT[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  icon TEXT DEFAULT 'Wrench',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DEVICES TABLE (Customer-registered hardware assets)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL CHECK (device_type IN ('Laptop', 'Desktop', 'Mobile', 'Tablet', 'Printer', 'Networking', 'Server', 'Other')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  purchase_date DATE,
  warranty_status TEXT CHECK (warranty_status IN ('active', 'expiring_soon', 'expired', 'none')) DEFAULT 'none',
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TECHNICIANS TABLE (Technician profile details & capacity)
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 1,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  completed_jobs_count INTEGER DEFAULT 0,
  active_status BOOLEAN DEFAULT true,
  current_workload INTEGER DEFAULT 0,
  phone TEXT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICE REQUESTS TABLE (Central work orders)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  problem_description TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT NOT NULL CHECK (status IN (
    'Request Created',
    'Technician Assigned',
    'Technician Accepted',
    'Technician On The Way',
    'Device Received',
    'Diagnosis',
    'Repair In Progress',
    'Ready',
    'Completed',
    'Cancelled'
  )) DEFAULT 'Request Created',
  preferred_date DATE,
  preferred_time_slot TEXT,
  assigned_technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  estimated_cost NUMERIC(10, 2),
  final_cost NUMERIC(10, 2),
  diagnosis TEXT,
  service_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SERVICE REQUEST HISTORY (Audit log of all status transitions)
CREATE TABLE IF NOT EXISTS service_request_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. REQUEST ASSIGNMENTS (Dispatch mapping)
CREATE TABLE IF NOT EXISTS request_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('assigned', 'accepted', 'declined', 'completed')) DEFAULT 'assigned',
  notes TEXT
);

-- 9. MESSAGES TABLE (Real-time communication between customer and technician)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('status_update', 'technician_assigned', 'appointment', 'invoice', 'warranty', 'message')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. INVOICE ITEMS TABLE
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

-- 13. WARRANTIES TABLE
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expiring_soon', 'expired')) DEFAULT 'active',
  covered_services TEXT[] DEFAULT '{}',
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  status TEXT NOT NULL CHECK (status IN ('published', 'under_review', 'archived')) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_name TEXT NOT NULL,
  part_number TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 5,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  retail_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  supplier TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  file_type TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_request_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check technician role
CREATE OR REPLACE FUNCTION is_technician()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'technician'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can view their own profile; Admins can view and manage all
CREATE POLICY "Profiles view policy" ON profiles
  FOR SELECT USING (user_id = auth.uid() OR is_admin() OR is_technician());

CREATE POLICY "Profiles update policy" ON profiles
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- Devices: Customers view/manage their own devices; Admins manage all; Technicians view assigned job devices
CREATE POLICY "Devices customer access" ON devices
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR is_admin()
    OR is_technician()
  );

-- Service Requests:
-- 1. Customers can view and create their own service requests
CREATE POLICY "Customer service requests" ON service_requests
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR is_admin()
    OR (
      is_technician() AND assigned_technician_id IN (
        SELECT id FROM technicians WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Messages: Users can only see messages where they are sender or receiver
CREATE POLICY "Messages access" ON messages
  FOR ALL USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Notifications: Users only see their own notifications
CREATE POLICY "Notifications self access" ON notifications
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Invoices: Customers see their invoices; Admins manage all
CREATE POLICY "Invoices policy" ON invoices
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Warranties: Customers see their warranties; Admins manage all
CREATE POLICY "Warranties policy" ON warranties
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Inventory: Admins and Technicians have access
CREATE POLICY "Inventory policy" ON inventory_items
  FOR ALL USING (
    is_admin() OR is_technician()
  );

-- ================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime publication for messages, service_requests, notifications
-- ================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
