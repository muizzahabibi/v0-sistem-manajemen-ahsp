import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { createRAB } from "../../actions"

interface ProyekRABPageProps {
  params: {
    id: string
  }
}

export default async function ProyekRABPage({ params }: ProyekRABPageProps) {
  const supabase = createClient()

  // Fetch project
  const { data: proyek, error: proyekError } = await supabase.from("proyek").select("*").eq("id", params.id).single()

  if (proyekError || !proyek) {
    notFound()
  }

  // Check if RAB already exists for this project
  const { data: existingRAB } = await supabase.from("rab").select("id").eq("proyek_id", params.id).maybeSingle()

  // If RAB exists, redirect to its detail page
  if (existingRAB) {
    redirect(`/rab/detail/${existingRAB.id}`)
  }

  // Create new RAB
  const createNewRAB = async () => {
    "use server"
    const result = await createRAB(Number.parseInt(params.id))
    if (result.success) {
      redirect(`/rab/detail/${result.id}`)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/proyek">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Buat RAB Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{proyek.nama}</CardTitle>
          <CardDescription>
            Lokasi: {proyek.lokasi} | Luas: {proyek.luas} m²
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Anda akan membuat Rencana Anggaran Biaya (RAB) baru untuk proyek ini. Setelah RAB dibuat, Anda dapat
            menambahkan item AHSP dan mengatur volume pekerjaan.
          </p>

          <form action={createNewRAB}>
            <Button type="submit">Buat RAB</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
