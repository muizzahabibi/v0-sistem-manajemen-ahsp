import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface RABReportPageProps {
  params: {
    id: string
  }
}

export default async function RABReportPage({ params }: RABReportPageProps) {
  const supabase = createClient()

  // Fetch RAB with project
  const { data: rab, error: rabError } = await supabase
    .from("rab")
    .select(`
      *,
      proyek:proyek_id (*)
    `)
    .eq("id", params.id)
    .single()

  if (rabError || !rab) {
    notFound()
  }

  // Fetch RAB details with AHSP
  const { data: rabDetails, error: detailsError } = await supabase
    .from("rab_detail")
    .select(`
      *,
      ahsp:ahsp_id (
        *,
        satuan:satuan_id (
          nama,
          simbol
        )
      )
    `)
    .eq("rab_id", params.id)
    .order("id")

  if (detailsError) {
    console.error("Error fetching RAB details:", detailsError)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: id })
  }

  return (
    <div className="container mx-auto py-8 print:py-2">
      <div className="flex flex-col gap-4 print:gap-2">
        <div className="text-center mb-4 print:mb-2">
          <h1 className="text-3xl font-bold">Rencana Anggaran Biaya (RAB)</h1>
          <p className="text-xl">{rab.proyek.nama}</p>
          <p className="text-muted-foreground">
            Lokasi: {rab.proyek.lokasi} | Luas: {rab.proyek.luas} m²
          </p>
          <p className="text-muted-foreground">
            Periode: {formatDate(rab.proyek.tanggal_mulai)} - {formatDate(rab.proyek.tanggal_selesai)}
          </p>
        </div>

        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">No</th>
              <th className="border border-border p-2 text-left">Uraian Pekerjaan</th>
              <th className="border border-border p-2 text-left">Kategori</th>
              <th className="border border-border p-2 text-left">Satuan</th>
              <th className="border border-border p-2 text-right">Volume</th>
              <th className="border border-border p-2 text-right">Harga Satuan</th>
              <th className="border border-border p-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {rabDetails && rabDetails.length > 0 ? (
              rabDetails.map((detail, index) => {
                const unitPrice = Number.parseFloat(detail.subtotal) / Number.parseFloat(detail.volume)

                return (
                  <tr key={detail.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="border border-border p-2">{index + 1}</td>
                    <td className="border border-border p-2">{detail.ahsp.nama}</td>
                    <td className="border border-border p-2">{detail.ahsp.kategori}</td>
                    <td className="border border-border p-2">{detail.ahsp.satuan.simbol}</td>
                    <td className="border border-border p-2 text-right">{detail.volume}</td>
                    <td className="border border-border p-2 text-right">{formatCurrency(unitPrice)}</td>
                    <td className="border border-border p-2 text-right">{formatCurrency(detail.subtotal)}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="border border-border p-2 text-center">
                  Tidak ada data
                </td>
              </tr>
            )}
            <tr className="font-bold bg-primary/10">
              <td colSpan={6} className="border border-border p-2 text-right">
                Total
              </td>
              <td className="border border-border p-2 text-right">{formatCurrency(rab.total_biaya)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 text-right print:mt-4">
          <p>Disetujui oleh,</p>
          <div className="h-16"></div>
          <p className="font-bold">_______________________</p>
          <p>Manajer Proyek</p>
        </div>
      </div>
    </div>
  )
}
