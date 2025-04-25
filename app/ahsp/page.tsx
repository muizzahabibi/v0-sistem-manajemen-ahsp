import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function AHSPPage() {
  const supabase = createClient()

  const { data: ahsp, error } = await supabase
    .from("ahsp")
    .select(`
      *,
      satuan:satuan_id (
        nama,
        simbol
      )
    `)
    .order("kategori", { ascending: true })
    .order("nama", { ascending: true })

  if (error) {
    console.error("Error fetching AHSP:", error)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen AHSP</h1>
        <Link href="/ahsp/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah AHSP
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={ahsp || []} />
    </div>
  )
}
