import { MaterialForm } from "../form"

export default function TambahMaterialPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Tambah Material</h1>
      <MaterialForm />
    </div>
  )
}
