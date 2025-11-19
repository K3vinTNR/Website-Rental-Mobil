-- Fix show_available() function to include search_path
CREATE OR REPLACE FUNCTION show_available()
RETURNS TABLE (
  ID_Mobil UUID,
  Plat_Mobil TEXT,
  Merek TEXT,
  Model TEXT,
  Tahun INTEGER,
  Harga_Sewa_Per_Hari DECIMAL(10,2),
  Status TEXT
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ID_Mobil,
    Plat_Mobil,
    Merek,
    Model,
    Tahun,
    Harga_Sewa_Per_Hari,
    Status
  FROM public.mobil
  WHERE Status = 'Tersedia';
$$;

-- RLS Policies for users table (users manage their own data)
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for karyawan table (only admins can manage)
CREATE POLICY "Anyone can view karyawan"
ON public.karyawan
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for asuransi table (read-only for customers)
CREATE POLICY "Anyone can view asuransi"
ON public.asuransi
FOR SELECT
TO authenticated
USING (true);