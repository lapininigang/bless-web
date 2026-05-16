import { ProductForm } from '@/components/products/product-form'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      <ProductForm initialData={product} />
    </div>
  )
}
