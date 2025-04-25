import { TukangForm } from "../form"

export default function TambahTukangPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Tambah Tukang</h1>
      <TukangForm />
    </div>
  )
}
