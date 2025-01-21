'use client'

import dynamic from 'next/dynamic'
const Profile = dynamic(() => import('./profile'), { ssr: false })

export default function ProfileClient() {
  return <Profile />
}
