'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSaleAction(data: {
  product_id: string
  cliente_id?: string
  cantidad: number
  precio_unitario: number
  total: number
  estado_pago: 'pagado' | 'fiado' | 'parcial'
  monto_pagado: number
  deuda_restante: number
  pago_con?: number
  devuelta?: number
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  // 1. Get product and client info for denormalization
  const [
    { data: product },
    { data: client }
  ] = await Promise.all([
    supabase.from('products').select('nombre, stock').eq('id', data.product_id).single(),
    data.cliente_id 
      ? supabase.from('clients').select('nombre, balance_pendiente').eq('id', data.cliente_id).single()
      : Promise.resolve({ data: null })
  ])

  if (!product) return { error: 'Producto no encontrado' }
  if (product.stock < data.cantidad) return { error: 'Stock insuficiente' }

  // 2. Start Transaction logic (simulated with separate calls since Supabase JS doesn't have native multi-table transactions easily without RPC)
  // We should ideally use a stored procedure (RPC) for this to ensure atomicity.
  // For now, we'll use an RPC 'process_sale' if it exists, or individual calls.
  
  const { error: saleError } = await (supabase as any).from('sales').insert([{
    user_id: user.id,
    product_id: data.product_id,
    cliente_id: data.cliente_id || null,
    producto_nombre: product.nombre,
    cliente_nombre: client?.nombre || 'Venta al contado',
    cantidad: data.cantidad,
    precio_unitario: data.precio_unitario,
    total: data.total,
    estado_pago: data.estado_pago,
    monto_pagado: data.monto_pagado,
    deuda_restante: data.deuda_restante
  }])

  if (saleError) return { error: saleError.message }

  // 3. Update stock
  await supabase.rpc('decrement_stock', { 
    product_id_input: data.product_id, 
    quantity: data.cantidad 
  })

  // 4. Update client balance if needed
  if (data.cliente_id && data.deuda_restante > 0) {
    await supabase.rpc('increment_client_balance', {
      client_id_input: data.cliente_id,
      amount: data.deuda_restante
    })
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/sales')
  
  return { success: true }
}
