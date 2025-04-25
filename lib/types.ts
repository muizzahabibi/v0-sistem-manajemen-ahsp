export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      ahsp: {
        Row: {
          id: number
          kategori: string
          nama: string
          satuan_id: number
        }
        Insert: {
          id?: number
          kategori: string
          nama: string
          satuan_id: number
        }
        Update: {
          id?: number
          kategori?: string
          nama?: string
          satuan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ahsp_satuan_id_fkey"
            columns: ["satuan_id"]
            referencedRelation: "satuan"
            referencedColumns: ["id"]
          },
        ]
      }
      ahsp_detail: {
        Row: {
          id: number
          ahsp_id: number
          tukang_id: number | null
          material_id: number | null
          koefisien: number
        }
        Insert: {
          id?: number
          ahsp_id: number
          tukang_id?: number | null
          material_id?: number | null
          koefisien: number
        }
        Update: {
          id?: number
          ahsp_id?: number
          tukang_id?: number | null
          material_id?: number | null
          koefisien?: number
        }
        Relationships: [
          {
            foreignKeyName: "ahsp_detail_ahsp_id_fkey"
            columns: ["ahsp_id"]
            referencedRelation: "ahsp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ahsp_detail_tukang_id_fkey"
            columns: ["tukang_id"]
            referencedRelation: "tukang"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ahsp_detail_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "material"
            referencedColumns: ["id"]
          },
        ]
      }
      material: {
        Row: {
          id: number
          nama: string
          satuan_id: number
          harga_satuan: number
        }
        Insert: {
          id?: number
          nama: string
          satuan_id: number
          harga_satuan: number
        }
        Update: {
          id?: number
          nama?: string
          satuan_id?: number
          harga_satuan?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_satuan_id_fkey"
            columns: ["satuan_id"]
            referencedRelation: "satuan"
            referencedColumns: ["id"]
          },
        ]
      }
      proyek: {
        Row: {
          id: number
          nama: string
          lokasi: string
          luas: number
          tanggal_mulai: string
          tanggal_selesai: string
          status: string
        }
        Insert: {
          id?: number
          nama: string
          lokasi: string
          luas: number
          tanggal_mulai: string
          tanggal_selesai: string
          status: string
        }
        Update: {
          id?: number
          nama?: string
          lokasi?: string
          luas?: number
          tanggal_mulai?: string
          tanggal_selesai?: string
          status?: string
        }
        Relationships: []
      }
      rab: {
        Row: {
          id: number
          proyek_id: number
          total_biaya: number
        }
        Insert: {
          id?: number
          proyek_id: number
          total_biaya: number
        }
        Update: {
          id?: number
          proyek_id?: number
          total_biaya?: number
        }
        Relationships: [
          {
            foreignKeyName: "rab_proyek_id_fkey"
            columns: ["proyek_id"]
            referencedRelation: "proyek"
            referencedColumns: ["id"]
          },
        ]
      }
      rab_detail: {
        Row: {
          id: number
          rab_id: number
          ahsp_id: number
          volume: number
          subtotal: number
        }
        Insert: {
          id?: number
          rab_id: number
          ahsp_id: number
          volume: number
          subtotal: number
        }
        Update: {
          id?: number
          rab_id?: number
          ahsp_id?: number
          volume?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "rab_detail_rab_id_fkey"
            columns: ["rab_id"]
            referencedRelation: "rab"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rab_detail_ahsp_id_fkey"
            columns: ["ahsp_id"]
            referencedRelation: "ahsp"
            referencedColumns: ["id"]
          },
        ]
      }
      satuan: {
        Row: {
          id: number
          nama: string
          simbol: string
        }
        Insert: {
          id?: number
          nama: string
          simbol: string
        }
        Update: {
          id?: number
          nama?: string
          simbol?: string
        }
        Relationships: []
      }
      tukang: {
        Row: {
          id: number
          nama: string
          jabatan: string
          harga_per_hari: number
        }
        Insert: {
          id?: number
          nama: string
          jabatan: string
          harga_per_hari: number
        }
        Update: {
          id?: number
          nama?: string
          jabatan?: string
          harga_per_hari?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
