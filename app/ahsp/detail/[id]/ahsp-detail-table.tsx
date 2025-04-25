"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash } from "lucide-react"
import { useState } from "react"
import { deleteAHSPDetail } from "../../actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AHSPDetailTableProps {
  details: any[]
  type: "tukang" | "material"
  ahspId: number
}

export function AHSPDetailTable({ details, type, ahspId }: AHSPDetailTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: number) => {
    setIsDeleting(true)
    await deleteAHSPDetail(id, ahspId)
    setDeleteId(null)
    setIsDeleting(false)
  }

  const calculateCost = (detail: any) => {
    if (type === "tukang") {
      return detail.tukang.harga_per_hari * detail.koefisien
    } else {
      return detail.material.harga_satuan * detail.koefisien
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{type === "tukang" ? "Nama Tukang" : "Nama Material"}</TableHead>
              <TableHead>{type === "tukang" ? "Jabatan" : "Satuan"}</TableHead>
              <TableHead>Koefisien</TableHead>
              <TableHead>{type === "tukang" ? "Harga/Hari" : "Harga Satuan"}</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.length > 0 ? (
              details.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{type === "tukang" ? detail.tukang.nama : detail.material.nama}</TableCell>
                  <TableCell>
                    {type === "tukang"
                      ? detail.tukang.jabatan
                      : `${detail.material.satuan.nama} (${detail.material.satuan.simbol})`}
                  </TableCell>
                  <TableCell>{detail.koefisien}</TableCell>
                  <TableCell>
                    {type === "tukang"
                      ? formatCurrency(detail.tukang.harga_per_hari)
                      : formatCurrency(detail.material.harga_satuan)}
                  </TableCell>
                  <TableCell>{formatCurrency(calculateCost(detail))}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(detail.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada data {type === "tukang" ? "tukang" : "material"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item dari AHSP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
