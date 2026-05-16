import { getSupabaseServerClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { BusinessGreeting } from '@/components/dashboard/business-greeting'
import { PackageOpen, DollarSign, Users, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  
  // 1. Fetch KPI basic counts (Products & Clients)
  const [
    { count: productsCount },
    { count: clientsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
  ])

  // 2. Fetch Low Stock Products
  // Since we can't easily compare columns in a simple count without an RPC, 
  // we'll fetch ID/stock/min_stock to calculate low stock count in memory.
  // In a real huge dataset, you'd use a SQL View or RPC function for this.
  const { data: allProductsRaw } = await supabase.from('products').select('id, stock, min_stock')
  const allProducts = allProductsRaw as any[] | null
  const lowStockCount = allProducts?.filter(p => p.stock <= p.min_stock).length || 0

  // 3. Fetch Recent Sales
  const { data: recentSalesRaw } = await supabase
    .from('sales')
    .select('id, total, created_at, clients(nombre)')
    .order('created_at', { ascending: false })
    .limit(30)
  
  const recentSales = recentSalesRaw as any[] | null

  // 4. Fetch Clients with Debt
  const { data: clientsWithDebtRaw } = await supabase
    .from('clients')
    .select('id, nombre, balance_pendiente, telefono')
    .gt('balance_pendiente', 0)
    .order('balance_pendiente', { ascending: false })
    .limit(10)

  const clientsWithDebt = clientsWithDebtRaw as any[] | null

  // Calculate Total Revenue
  const totalRevenue = recentSales?.reduce((acc, sale) => acc + Number(sale.total), 0) || 0

  // Group sales by date for the chart (last 7 days example)
  const chartDataMap = new Map<string, number>()
  recentSales?.forEach(sale => {
    const dateStr = new Date(sale.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })
    const current = chartDataMap.get(dateStr) || 0
    chartDataMap.set(dateStr, current + Number(sale.total))
  })

  const chartData = Array.from(chartDataMap.entries())
    .map(([date, total]) => ({ date, total }))
    .reverse() // Reverse to show chronological order left-to-right

  return (
    <div className="space-y-6">
      <BusinessGreeting />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Ingresos Totales</h3>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">De las últimas 30 ventas</p>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-4 -mb-4">
             <DollarSign className="h-24 w-24" />
          </div>
        </div>

        {/* Clients Count */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Clientes Activos</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{clientsCount || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Registrados en el sistema</p>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-4 -mb-4">
             <Users className="h-24 w-24" />
          </div>
        </div>

        {/* Products Count */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Productos en Catálogo</h3>
            <PackageOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold">{productsCount || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de items</p>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-4 -mb-4">
             <PackageOpen className="h-24 w-24" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Alertas de Inventario</h3>
            <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-2xl font-bold">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Productos por agotarse</p>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-4 -mb-4">
             <AlertTriangle className="h-24 w-24" />
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-7">
        
        {/* Sales Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-4 p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Resumen de Ventas</h3>
            <p className="text-sm text-muted-foreground">Evolución de ingresos por día</p>
          </div>
          <SalesChart data={chartData} />
        </div>

        {/* Recent Sales List */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-3 p-4 sm:p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Últimas Ventas</h3>
            <p className="text-sm text-muted-foreground">Actividad reciente</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentSales && recentSales.length > 0 ? (
              recentSales.slice(0, 7).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">
                      {sale.clients?.name || 'Cliente de paso'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.created_at).toLocaleDateString('es-DO', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-sm">
                    +{formatCurrency(Number(sale.total))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No hay ventas registradas aún.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>

      <div className="grid gap-4 lg:grid-cols-7 mt-4 sm:mt-6">
        {/* Unpaid Clients (Deudores) */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-4 p-4 sm:p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Cuentas por Cobrar
            </h3>
            <p className="text-sm text-muted-foreground">Clientes con balances pendientes</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {clientsWithDebt && clientsWithDebt.length > 0 ? (
              clientsWithDebt.map((client) => (
                <div key={client.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">
                      {client.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.telefono || 'Sin teléfono'}
                    </p>
                  </div>
                  <div className="font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded-md text-sm">
                    -{formatCurrency(Number(client.balance_pendiente))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No hay clientes con deuda pendiente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
