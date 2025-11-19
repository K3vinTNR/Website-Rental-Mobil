import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations_supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, LogIn, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Bg1 from "@/asset/Bg1.png";
import Bg2 from "@/asset/Bg2.png";
import Bg3 from "@/asset/Bg3.png";

interface Mobil {
  id_mobil: string;
  plat_mobil: string;
  merek: string;
  model: string;
  tahun: number;
  harga_sewa_per_hari: number;
  status: string;
}

export default function Index() {
  const [mobil, setMobil] = useState<Mobil[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Background slider images
  const bgImages = [
    Bg1,
    Bg2,
    Bg3,
  ];

  // Color gradients untuk tiap mobil
  const carGradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-orange-500 to-red-400",
    "from-green-500 to-teal-400",
    "from-indigo-500 to-blue-400",
    "from-red-500 to-orange-400",
  ];

  const getCarGradient = (index: number) => carGradients[index % carGradients.length];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    fetchAvailableCars();

    // Auto slider interval
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bgImages.length);
    }, 5000); // Change image every 5 seconds

    return () => {
      subscription.unsubscribe();
      clearInterval(slideInterval);
    };
  }, []);

  const fetchAvailableCars = async () => {
    try {
      const { data, error } = await supabase.rpc("show_available");
      
      if (error) throw error;
      setMobil(data || []);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa lagi!",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });
      setIsLoginModalOpen(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: customerError } = await supabase
          .from("customer")
          .insert({
            user_id: data.user.id,
            nama: nama,
          });

        if (customerError) throw customerError;
      }

      toast({
        title: "Registrasi berhasil",
        description: "Akun Anda telah dibuat!",
      });
      setIsLoginModalOpen(false);
      setIsSignupMode(false);
      setEmail("");
      setPassword("");
      setNama("");
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bgImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">4Carrus</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isSignupMode ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-4">
                    {isSignupMode && (
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input
                          id="nama"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="submit" className="w-full">
                        {isSignupMode ? "Daftar" : "Masuk"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setIsSignupMode(!isSignupMode);
                          setEmail("");
                          setPassword("");
                          setNama("");
                        }}
                      >
                        {isSignupMode ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          {bgImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Background ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-white/5" />
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/30 p-3 hover:bg-white/50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/30 p-3 hover:bg-white/50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Slider Indicators */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {bgImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-block rounded-full bg-primary/10 p-3">
              <Car className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl text-white drop-shadow-xl">
              Selamat Datang di 4Carrus
            </h2>
            <p className="mb-8 text-lg text-white/95 md:text-xl drop-shadow-lg">
              Sewa mobil berkualitas dengan mudah, cepat, dan terpercaya.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => document.getElementById('mobil-tersedia')?.scrollIntoView({ behavior: 'smooth' })}>
                Lihat Mobil Tersedia
              </Button>
              {!user && (
                <Button size="lg" variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                  Mulai Sekarang
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <section id="mobil-tersedia" className="container py-16">
        <h3 className="mb-8 text-3xl font-bold">Mobil Tersedia</h3>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : mobil.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada mobil tersedia saat ini
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mobil.map((car, index) => (
              <Card 
                key={car.id_mobil} 
                className="group overflow-hidden transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <div className={`aspect-video bg-gradient-to-br ${getCarGradient(index)} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <Car className="h-full w-full text-white/30" />
                  </div>
                  <Car className="h-24 w-24 text-white/80 relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {car.merek} {car.model}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {car.tahun} • {car.plat_mobil}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      Rp {car.harga_sewa_per_hari.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-muted-foreground">per hari</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {car.status}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full group-hover:bg-primary/90" 
                    onClick={() => navigate(`/car/${car.id_mobil}`)}
                  >
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
