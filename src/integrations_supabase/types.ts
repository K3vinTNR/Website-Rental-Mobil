export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      asuransi: {
        Row: {
          id_asuransi: string
          id_mobil: string
          jenis_asuransi: string
          nama_perusahaan: string
          no_polis: string
          tanggal_berakhir: string
        }
        Insert: {
          id_asuransi?: string
          id_mobil: string
          jenis_asuransi: string
          nama_perusahaan: string
          no_polis: string
          tanggal_berakhir: string
        }
        Update: {
          id_asuransi?: string
          id_mobil?: string
          jenis_asuransi?: string
          nama_perusahaan?: string
          no_polis?: string
          tanggal_berakhir?: string
        }
        Relationships: [
          {
            foreignKeyName: "asuransi_id_mobil_fkey"
            columns: ["id_mobil"]
            isOneToOne: false
            referencedRelation: "mobil"
            referencedColumns: ["id_mobil"]
          },
        ]
      }
      customer: {
        Row: {
          alamat: string | null
          id_customer: string
          nama: string
          no_ktp: string | null
          no_sim: string | null
          no_telephone: string | null
          user_id: string
        }
        Insert: {
          alamat?: string | null
          id_customer?: string
          nama: string
          no_ktp?: string | null
          no_sim?: string | null
          no_telephone?: string | null
          user_id: string
        }
        Update: {
          alamat?: string | null
          id_customer?: string
          nama?: string
          no_ktp?: string | null
          no_sim?: string | null
          no_telephone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      karyawan: {
        Row: {
          id_karyawan: string
          jabatan: string | null
          nama: string
          no_telephone: string | null
        }
        Insert: {
          id_karyawan?: string
          jabatan?: string | null
          nama: string
          no_telephone?: string | null
        }
        Update: {
          id_karyawan?: string
          jabatan?: string | null
          nama?: string
          no_telephone?: string | null
        }
        Relationships: []
      }
      mobil: {
        Row: {
          harga_sewa_per_hari: number
          id_mobil: string
          merek: string
          model: string
          plat_mobil: string
          status: string
          tahun: number
        }
        Insert: {
          harga_sewa_per_hari: number
          id_mobil?: string
          merek: string
          model: string
          plat_mobil: string
          status?: string
          tahun: number
        }
        Update: {
          harga_sewa_per_hari?: number
          id_mobil?: string
          merek?: string
          model?: string
          plat_mobil?: string
          status?: string
          tahun?: number
        }
        Relationships: []
      }
      payment: {
        Row: {
          id_pembayaran: string
          id_rental: string
          jumlah_bayar: number
          metode_bayar: string
          tanggal_bayar: string | null
        }
        Insert: {
          id_pembayaran?: string
          id_rental: string
          jumlah_bayar: number
          metode_bayar: string
          tanggal_bayar?: string | null
        }
        Update: {
          id_pembayaran?: string
          id_rental?: string
          jumlah_bayar?: number
          metode_bayar?: string
          tanggal_bayar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_id_rental_fkey"
            columns: ["id_rental"]
            isOneToOne: false
            referencedRelation: "transaksi"
            referencedColumns: ["id_rental"]
          },
        ]
      }
      transaksi: {
        Row: {
          id_customer: string
          id_karyawan: string | null
          id_mobil: string
          id_rental: string
          status: string
          tanggal_selesai_sewa: string | null
          tanggal_sewa: string
          total_biaya: number | null
        }
        Insert: {
          id_customer: string
          id_karyawan?: string | null
          id_mobil: string
          id_rental?: string
          status?: string
          tanggal_selesai_sewa?: string | null
          tanggal_sewa?: string
          total_biaya?: number | null
        }
        Update: {
          id_customer?: string
          id_karyawan?: string | null
          id_mobil?: string
          id_rental?: string
          status?: string
          tanggal_selesai_sewa?: string | null
          tanggal_sewa?: string
          total_biaya?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_id_customer_fkey"
            columns: ["id_customer"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id_customer"]
          },
          {
            foreignKeyName: "transaksi_id_karyawan_fkey"
            columns: ["id_karyawan"]
            isOneToOne: false
            referencedRelation: "karyawan"
            referencedColumns: ["id_karyawan"]
          },
          {
            foreignKeyName: "transaksi_id_mobil_fkey"
            columns: ["id_mobil"]
            isOneToOne: false
            referencedRelation: "mobil"
            referencedColumns: ["id_mobil"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          password_hash: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          password_hash: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_available: {
        Args: never
        Returns: {
          harga_sewa_per_hari: number
          id_mobil: string
          merek: string
          model: string
          plat_mobil: string
          status: string
          tahun: number
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "admin" | "karyawan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin", "karyawan"],
    },
  },
} as const
