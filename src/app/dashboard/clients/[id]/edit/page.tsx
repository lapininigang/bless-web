import { ClientForm } from '@/components/clients/client-form'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditClientPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const supabase = await getSupabaseServerClient()
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      <ClientForm initialData={client} />
    </div>
  )
}
