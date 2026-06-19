-- SQL Schema for URBAN WASH Student Registration Campaign
-- Run this in your Supabase SQL Editor or PostgreSQL database

-- Create the students table
CREATE TABLE IF NOT EXISTS public.students (
    customer_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    hostel TEXT NOT NULL,
    room TEXT NOT NULL,
    services TEXT[] NOT NULL DEFAULT '{}',
    offer TEXT NOT NULL,
    referral_status TEXT NOT NULL CHECK (referral_status IN ('Yes', 'No')),
    referred_by TEXT REFERENCES public.students(customer_id) ON DELETE SET NULL,
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'Lead Registered' CHECK (status IN ('Lead Registered', 'Contacted', 'First Order Completed', 'Repeat Customer', 'Referral Customer', 'VIP Customer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security (RLS) on Supabase
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow anonymous users to select and insert for campaigns, and admins to manage)
-- Note: In a production app, you might restrict administrative access, but for simple campaign setups
-- we allow public read/write or authenticate agents.
CREATE POLICY "Allow public read access to students" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to students" ON public.students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to students" ON public.students
    FOR UPDATE USING (true);

-- Indexing for search and filters
CREATE INDEX IF NOT EXISTS idx_students_hostel ON public.students(hostel);
CREATE INDEX IF NOT EXISTS idx_students_referred_by ON public.students(referred_by);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);
