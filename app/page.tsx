import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Calculator, Hammer, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DashboardChart } from "@/components/dashboard-chart"
import { ProjectStatusChart } from "@/components/project-status-chart"

export default async function Dashboard() {
  const supabase = createClient()

  // Fetch all projects
  const { data: projects } = await supabase.from("proyek").select("status").throwOnError()

  // Calculate total projects and counts by status
  const totalProjects = projects?.length || 0
  const draftProjects = projects?.filter((item) => item.status === "draft").length || 0
  const ongoingProjects = projects?.filter((item) => item.status === "proses").length || 0
  const completedProjects = projects?.filter((item) => item.status === "selesai").length || 0

  // Fetch total RAB cost
  const { data: rabTotal } = await supabase.from("rab").select("total_biaya").throwOnError()

  const totalCost = rabTotal?.reduce((sum, item) => sum + Number.parseFloat(item.total_biaya), 0) || 0

  // Fetch worker count
  const { count: workerCount } = await supabase
    .from("tukang")
    .select("*", { count: "exact", head: true })
    .throwOnError()

  // Fetch material count
  const { count: materialCount } = await supabase
    .from("material")
    .select("*", { count: "exact", head: true })
    .throwOnError()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyek</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Draft: {draftProjects}, Proses: {ongoingProjects}, Selesai: {completedProjects}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biaya Estimasi</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">Dari semua RAB yang telah dibuat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tukang</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerCount || 0}</div>
            <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Material</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialCount || 0}</div>
            <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="projects">Status Proyek</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Penggunaan Material & Waktu Kerja</CardTitle>
              <CardDescription>
                Grafik penggunaan material dan waktu kerja tukang dalam 6 bulan terakhir
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <DashboardChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Proyek</CardTitle>
              <CardDescription>Distribusi proyek berdasarkan status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ProjectStatusChart draft={draftProjects} ongoing={ongoingProjects} completed={completedProjects} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
