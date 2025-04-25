import { MaterialForm } from "../../form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditMaterialPageProps {
  params: {
    id: string
  }
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const supabase = createClient()

  const { data: material, error } = await supabase.from("material").select("*").eq("id", params.id).single()

  if (error || !material) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Material</h1>
      <MaterialForm material={material} />
    </div>
  )
}
