import { ProyekForm } from "../../form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditProyekPageProps {
  params: {
    id: string
  }
}

export default async function EditProyekPage({ params }: EditProyekPageProps) {
  const supabase = createClient()

  const { data: proyek, error } = await supabase.from("proyek").select("*").eq("id", params.id).single()

  if (error || !proyek) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Proyek</h1>
      <ProyekForm proyek={proyek} />
    </div>
  )
}
