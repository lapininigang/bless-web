import { getSupabaseServerClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function SalesPage() {
  const supabase = await getSupabaseServerClient()
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Historial de Ventas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Listado completo de todas las transacciones realizadas.
        </p>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Cant.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Deuda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales && sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {new Date(sale.created_at).toLocaleDateString('es-DO', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{sale.producto_nombre}</TableCell>
                  <TableCell>{sale.cliente_nombre}</TableCell>
                  <TableCell className="text-right">{sale.cantidad}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={sale.estado_pago === 'pagado' ? 'success' : sale.estado_pago === 'fiado' ? 'destructive' : 'warning'}
                      className="capitalize"
                    >
                      {sale.estado_pago}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-destructive font-medium">
                    {sale.deuda_restante > 0 ? formatCurrency(sale.deuda_restante) : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se han registrado ventas aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
