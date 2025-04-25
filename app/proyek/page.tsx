import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function ProyekPage() {
  const supabase = createClient()

  const { data: proyek, error } = await supabase.from("proyek").select("*").order("tanggal_mulai", { ascending: false })

  if (error) {
    console.error("Error fetching proyek:", error)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen Proyek</h1>
        <Link href="/proyek/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Proyek
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={proyek || []} />
    </div>
  )
}
