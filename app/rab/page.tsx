import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function RABPage() {
  const supabase = createClient()

  const { data: rab, error } = await supabase
    .from("rab")
    .select(`
      *,
      proyek:proyek_id (
        nama,
        status
      )
    `)
    .order("id", { ascending: false })

  if (error) {
    console.error("Error fetching RAB:", error)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen RAB</h1>
        <Link href="/proyek">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat RAB Baru
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={rab || []} />
    </div>
  )
}
