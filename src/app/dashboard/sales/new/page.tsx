import { SaleForm } from '@/components/sales/sale-form'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function NewSalePage() {
  const supabase = await getSupabaseServerClient()
  
  // Fetch products that have stock > 0
  const { data: products } = await supabase
    .from('products')
    .select('id, nombre, precio_venta, stock')
    .gt('stock', 0)
    .order('nombre')

  // Fetch clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, nombre')
    .order('nombre')

  return (
    <div className="mx-auto max-w-4xl py-6">
      <SaleForm products={products || []} clients={clients || []} />
    </div>
  )
}
