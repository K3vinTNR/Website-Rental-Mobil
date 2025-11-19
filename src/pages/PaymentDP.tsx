import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations_supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mobil {
  id_mobil: string;
  plat_mobil: string;
  merek: string;
  model: string;
  tahun: number;
  harga_sewa_per_hari: number;
}

export default function PaymentDP() {
  const { id } = useParams();
  const [mobil, setMobil] = useState<Mobil | null>(null);
  const [metode, setMetode] = useState("transfer");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchCarDetail();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/auth?returnTo=/payment/${id}`);
    }
  };

  const fetchCarDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("mobil")
        .select("*")
        .eq("id_mobil", id)
        .single();

      if (error) throw error;
      setMobil(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!mobil) return;
    
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Get customer ID
      const { data: customerData, error: customerError } = await supabase
        .from("customer")
        .select("id_customer")
        .eq("user_id", session.user.id)
        .single();

      if (customerError) throw customerError;

      const dpAmount = mobil.harga_sewa_per_hari * 0.2;

      // Create transaction
      const { data: transaksiData, error: transaksiError } = await supabase
        .from("transaksi")
        .insert({
          id_customer: customerData.id_customer,
          id_mobil: mobil.id_mobil,
          total_biaya: mobil.harga_sewa_per_hari,
          status: "DP Dibayar",
        })
        .select()
        .single();

      if (transaksiError) throw transaksiError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from("payment")
        .insert({
          id_rental: transaksiData.id_rental,
          jumlah_bayar: dpAmount,
          metode_bayar: metode,
        });

      if (paymentError) throw paymentError;

      setIsPaid(true);
      toast({
        title: "Pembayaran Berhasil!",
        description: "DP Anda telah dibayar.",
      });
    } catch (error: any) {
      toast({
        title: "Pembayaran Gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!mobil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Mobil tidak ditemukan</p>
      </div>
    );
  }

  const dpAmount = mobil.harga_sewa_per_hari * 0.2;

  if (isPaid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Pembayaran Berhasil!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Mobil</p>
              <p className="font-semibold">{mobil.merek} {mobil.model}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Jumlah DP</p>
              <p className="text-2xl font-bold text-primary">
                Rp {dpAmount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Metode Pembayaran</p>
              <p className="font-semibold capitalize">{metode}</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                Kembali ke Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">4Carrus</h1>
          </div>
        </div>
      </header>

      {/* Payment Form */}
      <section className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Pembayaran Uang Muka (DP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Mobil</p>
              <p className="text-lg font-semibold">
                {mobil.merek} {mobil.model} ({mobil.tahun})
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Harga Sewa Per Hari</p>
              <p className="text-xl font-semibold">
                Rp {mobil.harga_sewa_per_hari.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Jumlah DP (20%)</p>
              <p className="text-3xl font-bold text-secondary">
                Rp {dpAmount.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-4">
              <Label>Metode Pembayaran</Label>
              <RadioGroup value={metode} onValueChange={setMetode}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="cursor-pointer">Transfer Bank</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="cursor-pointer">Kartu Kredit</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
