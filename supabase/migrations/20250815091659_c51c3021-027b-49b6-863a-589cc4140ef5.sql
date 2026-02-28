-- Enable Row Level Security on the portfolio_1 table
ALTER TABLE public.portfolio_1 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit contact forms (INSERT only)
CREATE POLICY "Allow contact form submissions" 
ON public.portfolio_1 
FOR INSERT 
WITH CHECK (true);

-- Create policy to deny all SELECT operations for public users
-- Only authenticated admin users should be able to read contact data
CREATE POLICY "Deny public access to contact data" 
ON public.portfolio_1 
FOR SELECT 
USING (false);

-- Create policy to deny UPDATE operations 
CREATE POLICY "Deny contact data updates" 
ON public.portfolio_1 
FOR UPDATE 
USING (false);

-- Create policy to deny DELETE operations
CREATE POLICY "Deny contact data deletion" 
ON public.portfolio_1 
FOR DELETE 
USING (false);