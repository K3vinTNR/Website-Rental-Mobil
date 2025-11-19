import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations_supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id_rental: string;
  tanggal_sewa: string;
  total_biaya: number;
  status: string;
  mobil: {
    merek: string;
    model: string;
    tahun: number;
  };
  payment: Array<{
    tanggal_bayar: string;
    jumlah_bayar: number;
    metode_bayar: string;
  }>;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchTransactions();
  };

  const fetchTransactions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get customer ID
      const { data: customerData, error: customerError } = await supabase
        .from("customer")
        .select("id_customer")
        .eq("user_id", session.user.id)
        .single();

      if (customerError) throw customerError;

      // Get transactions with related data
      const { data, error } = await supabase
        .from("transaksi")
        .select(`
          *,
          mobil:id_mobil (merek, model, tahun),
          payment (tanggal_bayar, jumlah_bayar, metode_bayar)
        `)
        .eq("id_customer", customerData.id_customer)
        .order("tanggal_sewa", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">4Carrus</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Dashboard Saya</h2>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Belum ada transaksi</p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Sewa Mobil Sekarang
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id_rental}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>
                      {transaction.mobil.merek} {transaction.mobil.model} ({transaction.mobil.tahun})
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      transaction.status === "DP Dibayar" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {transaction.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Sewa</p>
                      <p className="font-semibold">
                        {new Date(transaction.tanggal_sewa).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Biaya</p>
                      <p className="font-semibold">
                        Rp {transaction.total_biaya.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {transaction.payment.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Riwayat Pembayaran</p>
                      {transaction.payment.map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-sm">
                              {new Date(payment.tanggal_bayar).toLocaleDateString("id-ID")}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {payment.metode_bayar}
                            </p>
                          </div>
                          <p className="font-semibold">
                            Rp {payment.jumlah_bayar.toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
