'use client'

import dynamic from 'next/dynamic'
const HomePage = dynamic(() => import('./Home'), { ssr: false })

export default function Client() {
  return <HomePage />
}
