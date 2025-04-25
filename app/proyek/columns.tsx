"use client"

import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, FileText, Trash } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { deleteProyek } from "./actions"
import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/lib/types"

type Proyek = Database["public"]["Tables"]["proyek"]["Row"]

export const columns: ColumnDef<Proyek>[] = [
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nama Proyek
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
  },
  {
    accessorKey: "luas",
    header: "Luas (m²)",
    cell: ({ row }) => {
      const luas = Number.parseFloat(row.getValue("luas"))
      return <div>{luas.toLocaleString("id-ID")} m²</div>
    },
  },
  {
    accessorKey: "tanggal_mulai",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tanggal Mulai
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("tanggal_mulai"))
      return <div>{date.toLocaleDateString("id-ID")}</div>
    },
  },
  {
    accessorKey: "tanggal_selesai",
    header: "Tanggal Selesai",
    cell: ({ row }) => {
      const date = new Date(row.getValue("tanggal_selesai"))
      return <div>{date.toLocaleDateString("id-ID")}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      let variant: "default" | "outline" | "secondary" | "destructive" = "outline"
      let label = "Unknown"

      switch (status) {
        case "draft":
          variant = "secondary"
          label = "Draft"
          break
        case "proses":
          variant = "default"
          label = "Proses"
          break
        case "selesai":
          variant = "outline"
          label = "Selesai"
          break
      }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const proyek = row.original
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/proyek/edit/${proyek.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/rab/proyek/${proyek.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  RAB
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data proyek secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteProyek(proyek.id)
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]
