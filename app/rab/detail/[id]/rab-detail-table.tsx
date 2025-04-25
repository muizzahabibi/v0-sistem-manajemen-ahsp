"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash } from "lucide-react"
import { useState } from "react"
import { deleteRABDetail } from "../../actions"
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

interface RABDetailTableProps {
  details: any[]
  rabId: number
}

export function RABDetailTable({ details, rabId }: RABDetailTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: number) => {
    setIsDeleting(true)
    await deleteRABDetail(id, rabId)
    setDeleteId(null)
    setIsDeleting(false)
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
              <TableHead>Nama AHSP</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Harga Satuan</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.length > 0 ? (
              details.map((detail) => {
                const unitPrice = Number.parseFloat(detail.subtotal) / Number.parseFloat(detail.volume)

                return (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.ahsp.nama}</TableCell>
                    <TableCell>{detail.ahsp.kategori}</TableCell>
                    <TableCell>{detail.ahsp.satuan.simbol}</TableCell>
                    <TableCell>{detail.volume}</TableCell>
                    <TableCell>{formatCurrency(unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(detail.subtotal)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(detail.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Belum ada item RAB
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item dari RAB.
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
