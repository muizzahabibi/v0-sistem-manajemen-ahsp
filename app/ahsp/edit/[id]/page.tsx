import { AHSPForm } from "../../form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditAHSPPageProps {
  params: {
    id: string
  }
}

export default async function EditAHSPPage({ params }: EditAHSPPageProps) {
  const supabase = createClient()

  const { data: ahsp, error } = await supabase.from("ahsp").select("*").eq("id", params.id).single()

  if (error || !ahsp) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Edit AHSP</h1>
      <AHSPForm ahsp={ahsp} />
    </div>
  )
}
