import { getSupabaseServerClient } from '@/lib/supabase/server'
import { SettingsClient } from '@/components/settings/settings-client'

// Sanitize data: remove internal IDs, user_id, and other sensitive fields
function sanitizeProducts(raw: any[]) {
  return raw.map(p => ({
    Nombre: p.nombre || '',
    Descripción: p.descripcion || '-',
    Código: p.codigo || '-',
    Categoría: p.categoria || '-',
    'Costo (RD$)': Number(p.costo || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
    'Precio Venta (RD$)': Number(p.precio_venta || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
    Stock: p.stock ?? 0,
  }))
}

function sanitizeClients(raw: any[]) {
  return raw.map(c => ({
    Nombre: c.nombre || '',
    Teléfono: c.telefono || '-',
    Dirección: c.direccion || '-',
    'Balance Pendiente (RD$)': Number(c.balance_pendiente || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
  }))
}

function sanitizeSales(raw: any[]) {
  return raw.map(s => ({
    Fecha: new Date(s.created_at).toLocaleDateString('es-DO', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    Producto: s.producto_nombre || '-',
    Cliente: s.cliente_nombre || 'Venta al contado',
    Cantidad: s.cantidad ?? 0,
    'Precio Unit. (RD$)': Number(s.precio_unitario || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
    'Total (RD$)': Number(s.total || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
    Estado: s.estado_pago === 'pagado' ? 'Pagado' : s.estado_pago === 'fiado' ? 'Fiado' : 'Parcial',
    'Pagado (RD$)': Number(s.monto_pagado || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
    'Deuda (RD$)': Number(s.deuda_restante || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }),
  }))
}

export default async function SettingsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch only needed fields — NO sensitive data like id, user_id
  const [
    { data: productsRaw },
    { data: clientsRaw },
    { data: salesRaw },
  ] = await Promise.all([
    supabase.from('products').select('nombre, descripcion, codigo, categoria, costo, precio_venta, stock'),
    supabase.from('clients').select('nombre, telefono, direccion, balance_pendiente'),
    supabase.from('sales').select('producto_nombre, cliente_nombre, cantidad, precio_unitario, total, estado_pago, monto_pagado, deuda_restante, created_at').order('created_at', { ascending: false }),
  ])

  return (
    <SettingsClient
      userEmail={user?.email || ''}
      userId={user?.id || ''}
      products={sanitizeProducts(productsRaw || [])}
      clients={sanitizeClients(clientsRaw || [])}
      sales={sanitizeSales(salesRaw || [])}
    />
  )
}
