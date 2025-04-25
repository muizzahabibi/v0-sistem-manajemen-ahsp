import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function MaterialPage() {
  const supabase = createClient()

  const { data: materials, error } = await supabase
    .from("material")
    .select(`
      *,
      satuan:satuan_id (
        nama,
        simbol
      )
    `)
    .order("nama")

  if (error) {
    console.error("Error fetching materials:", error)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen Material</h1>
        <Link href="/material/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Material
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={materials || []} />
    </div>
  )
}
