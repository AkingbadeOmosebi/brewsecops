-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reservations (public form)
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view their own reservation by email (optional, for confirmation)
CREATE POLICY "Anyone can view reservations" 
ON public.reservations 
FOR SELECT 
USING (true);

-- Allow anyone to submit contact messages
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Allow viewing contact messages (for admin purposes later)
CREATE POLICY "Anyone can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (true);