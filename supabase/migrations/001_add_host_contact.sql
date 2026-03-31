-- Add host contact columns to resorts table
ALTER TABLE public.resorts 
ADD COLUMN IF NOT EXISTS host_phone text,
ADD COLUMN IF NOT EXISTS host_email text,
ADD COLUMN IF NOT EXISTS host_whatsapp text;
