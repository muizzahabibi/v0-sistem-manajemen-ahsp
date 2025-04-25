import { TukangForm } from "../../form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditTukangPageProps {
  params: {
    id: string
  }
}

export default async function EditTukangPage({ params }: EditTukangPageProps) {
  const supabase = createClient()

  const { data: tukang, error } = await supabase.from("tukang").select("*").eq("id", params.id).single()

  if (error || !tukang) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit Tukang</h1>
      <TukangForm tukang={tukang} />
    </div>
  )
}
