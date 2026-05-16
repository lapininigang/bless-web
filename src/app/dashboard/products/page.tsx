import { getSupabaseServerClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Plus, MoreHorizontal, Pencil, Trash2, AlertTriangle, Search } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteProductAction } from './actions'
import { Badge } from '@/components/ui/badge'

export default async function ProductsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('nombre')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona tus productos, precios y existencias.
          </p>
        </div>
        <Link href="/dashboard/products/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Producto
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Productos</span>
            <span className="text-2xl font-bold">{products?.length || 0}</span>
         </div>
         <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bajo Stock</span>
            <span className="text-2xl font-bold text-amber-500">
               {products?.filter(p => p.stock <= p.min_stock).length || 0}
            </span>
         </div>
         <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor Inventario (Venta)</span>
            <span className="text-2xl font-bold text-emerald-500">
               {formatCurrency(products?.reduce((acc, p) => acc + (p.precio_venta * p.stock), 0) || 0)}
            </span>
         </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.nombre}</span>
                      {product.stock <= product.min_stock && (
                        <span className="text-[10px] text-amber-600 flex items-center font-bold uppercase mt-0.5">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Stock Bajo
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.codigo || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {product.categoria || 'Sin categoría'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.precio_venta)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`${product.stock <= product.min_stock ? 'text-amber-600 font-bold' : ''}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem className="p-0 cursor-pointer">
                            <Link href={`/dashboard/products/${product.id}/edit`} className="w-full flex items-center px-2 py-1.5">
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <form action={async () => {
                            'use server'
                            await deleteProductAction(product.id)
                          }}>
                            <button type="submit" className="w-full text-left text-destructive flex items-center px-2 py-1.5 text-sm hover:bg-destructive/10 rounded-sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </button>
                          </form>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No hay productos en el inventario.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
