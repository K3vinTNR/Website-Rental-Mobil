-- Create role enum type
CREATE TYPE app_role AS ENUM ('customer', 'admin', 'karyawan');

-- Create users table
CREATE TABLE public.users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create customer table
CREATE TABLE public.customer (
  ID_Customer UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
  Nama TEXT NOT NULL,
  Alamat TEXT,
  No_Telephone TEXT,
  No_SIM TEXT,
  No_KTP TEXT,
  UNIQUE(user_id)
);

ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;

-- Create karyawan table
CREATE TABLE public.karyawan (
  ID_Karyawan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Nama TEXT NOT NULL,
  Jabatan TEXT,
  No_Telephone TEXT
);

ALTER TABLE public.karyawan ENABLE ROW LEVEL SECURITY;

-- Create mobil table
CREATE TABLE public.mobil (
  ID_Mobil UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Plat_Mobil TEXT UNIQUE NOT NULL,
  Merek TEXT NOT NULL,
  Model TEXT NOT NULL,
  Tahun INTEGER NOT NULL,
  Harga_Sewa_Per_Hari DECIMAL(10,2) NOT NULL,
  Status TEXT NOT NULL DEFAULT 'Tersedia'
);

ALTER TABLE public.mobil ENABLE ROW LEVEL SECURITY;

-- Create transaksi table
CREATE TABLE public.transaksi (
  ID_Rental UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ID_Customer UUID REFERENCES public.customer(ID_Customer) ON DELETE CASCADE NOT NULL,
  ID_Mobil UUID REFERENCES public.mobil(ID_Mobil) ON DELETE CASCADE NOT NULL,
  ID_Karyawan UUID REFERENCES public.karyawan(ID_Karyawan) ON DELETE SET NULL,
  Tanggal_Sewa TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  Tanggal_Selesai_Sewa TIMESTAMP WITH TIME ZONE,
  Total_Biaya DECIMAL(10,2),
  Status TEXT NOT NULL DEFAULT 'Pending'
);

ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;

-- Create payment table
CREATE TABLE public.payment (
  ID_Pembayaran UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ID_Rental UUID REFERENCES public.transaksi(ID_Rental) ON DELETE CASCADE NOT NULL,
  Tanggal_Bayar TIMESTAMP WITH TIME ZONE DEFAULT now(),
  Jumlah_Bayar DECIMAL(10,2) NOT NULL,
  Metode_Bayar TEXT NOT NULL
);

ALTER TABLE public.payment ENABLE ROW LEVEL SECURITY;

-- Create asuransi table
CREATE TABLE public.asuransi (
  ID_Asuransi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  No_Polis TEXT UNIQUE NOT NULL,
  ID_Mobil UUID REFERENCES public.mobil(ID_Mobil) ON DELETE CASCADE NOT NULL,
  Tanggal_Berakhir DATE NOT NULL,
  Jenis_Asuransi TEXT NOT NULL,
  Nama_Perusahaan TEXT NOT NULL
);

ALTER TABLE public.asuransi ENABLE ROW LEVEL SECURITY;

-- Create show_available() function (PostgreSQL equivalent of stored procedure)
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

-- RLS Policies for public access to available cars
CREATE POLICY "Anyone can view available cars"
ON public.mobil
FOR SELECT
USING (Status = 'Tersedia');

-- RLS Policies for customer table
CREATE POLICY "Users can view own customer data"
ON public.customer
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customer data"
ON public.customer
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customer data"
ON public.customer
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for transaksi table
CREATE POLICY "Users can view own transactions"
ON public.transaksi
FOR SELECT
TO authenticated
USING (
  ID_Customer IN (
    SELECT ID_Customer FROM public.customer WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own transactions"
ON public.transaksi
FOR INSERT
TO authenticated
WITH CHECK (
  ID_Customer IN (
    SELECT ID_Customer FROM public.customer WHERE user_id = auth.uid()
  )
);

-- RLS Policies for payment table
CREATE POLICY "Users can view own payments"
ON public.payment
FOR SELECT
TO authenticated
USING (
  ID_Rental IN (
    SELECT t.ID_Rental 
    FROM public.transaksi t
    JOIN public.customer c ON t.ID_Customer = c.ID_Customer
    WHERE c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own payments"
ON public.payment
FOR INSERT
TO authenticated
WITH CHECK (
  ID_Rental IN (
    SELECT t.ID_Rental 
    FROM public.transaksi t
    JOIN public.customer c ON t.ID_Customer = c.ID_Customer
    WHERE c.user_id = auth.uid()
  )
);