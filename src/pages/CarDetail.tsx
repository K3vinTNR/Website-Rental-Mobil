import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations_supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mobil {
  id_mobil: string;
  plat_mobil: string;
  merek: string;
  model: string;
  tahun: number;
  harga_sewa_per_hari: number;
  status: string;
}

export default function CarDetail() {
  const { id } = useParams();
  const [mobil, setMobil] = useState<Mobil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCarDetail();
  }, [id]);

  const fetchCarDetail = async () => {
    try {
      const { data, error} = await supabase
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

  const handleBayarDP = async () => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Redirect to login with return URL
      navigate(`/auth?returnTo=/payment/${id}`);
      return;
    }

    // Navigate to payment page
    navigate(`/payment/${id}`);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">4Carrus</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </header>

      {/* Car Detail */}
      <section className="container py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden shadow-xl">
            {/* Car Image Placeholder */}
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center border-b">
              <Car className="h-32 w-32 text-primary/40" />
            </div>

            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-4xl mb-2">
                    {mobil.merek} {mobil.model}
                  </CardTitle>
                  <p className="text-xl text-muted-foreground">Tahun {mobil.tahun}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {mobil.status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Car Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Plat Nomor</p>
                  <p className="text-2xl font-bold">{mobil.plat_mobil}</p>
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Status Ketersediaan</p>
                  <p className="text-2xl font-bold text-green-600">{mobil.status}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 rounded-lg border bg-muted/30 p-6">
                <h3 className="text-lg font-semibold">Deskripsi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mobil.merek} {mobil.model} tahun {mobil.tahun} dalam kondisi prima dan siap untuk perjalanan Anda. 
                  Mobil ini dilengkapi dengan fitur kenyamanan modern dan telah melalui pemeriksaan rutin untuk 
                  memastikan keamanan dan kenyamanan berkendara Anda.
                </p>
              </div>

              {/* Pricing Section */}
              <div className="space-y-6 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Harga Sewa Per Hari</p>
                  <p className="text-5xl font-bold text-primary">
                    Rp {mobil.harga_sewa_per_hari.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="border-t border-primary/20 pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Uang Muka (DP) - 20%
                  </p>
                  <p className="text-3xl font-bold">
                    Rp {(mobil.harga_sewa_per_hari * 0.2).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <Button 
                className="w-full h-14 text-lg" 
                size="lg"
                onClick={handleBayarDP}
              >
                Pesan Sekarang
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Dengan memesan, Anda setuju dengan syarat dan ketentuan rental mobil kami
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
