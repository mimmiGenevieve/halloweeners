'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function AdminPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')

    useEffect(() => {
        if (token) {
            window.location.replace(
                `/api/token?token=${encodeURIComponent(token)}&next=${encodeURIComponent('/admin/invited')}`
            )
            return
        }

        window.location.replace('/admin/invited')
    }, [token])

    return null
}

export default function AdminPage() {
    return (
        <Suspense fallback={null}>
            <AdminPageContent />
        </Suspense>
    )
}
