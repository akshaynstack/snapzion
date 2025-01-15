'use server'

import { redirect } from 'next/navigation'
import { logout } from '@/app/logout/action'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className='text-white'>
      <p>Hello {data.user.email}</p>
      <form action={logout}>
        <button type='submit'>Logout</button>
      </form>
    </div>
  )
}