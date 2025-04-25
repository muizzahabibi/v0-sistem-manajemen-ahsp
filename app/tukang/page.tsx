import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function TukangPage() {
  const supabase = createClient()

  const { data: tukang, error } = await supabase.from("tukang").select("*").order("nama")

  if (error) {
    console.error("Error fetching tukang:", error)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen Tukang</h1>
        <Link href="/tukang/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tukang
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={tukang || []} />
    </div>
  )
}
