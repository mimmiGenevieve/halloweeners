'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAdminStatusCache } from '@/lib/auth-cache'

type AdminUser = {
    id: string
    name: string
    is_admin?: boolean
}

export type AdminRouteResponse<T extends object> =
    | ({ user: AdminUser | null } & T)
    | null

type UseAdminRouteDataOptions = {
    endpoint: string
    nextPath: string
}

export function useAdminRouteData<T extends object>({
    endpoint,
    nextPath,
}: UseAdminRouteDataOptions) {
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')
    const [data, setData] = useState<AdminRouteResponse<T>>(null)
    const [loading, setLoading] = useState(true)
    const [cachedIsAdmin, updateAdminStatus] = useAdminStatusCache()
    const hasFetched = useRef(false)

    const fetchData = useCallback(async () => {
        setLoading(true)

        try {
            const response = await fetch(endpoint)
            const result = (await response.json()) as AdminRouteResponse<T>

            setData(result)

            if (result?.user?.is_admin !== undefined) {
                updateAdminStatus(result.user.is_admin)
            }

            if (!result?.user || !result.user.is_admin) {
                window.location.replace('/')
            }

            return result
        } finally {
            setLoading(false)
        }
    }, [endpoint, updateAdminStatus])

    useEffect(() => {
        if (hasFetched.current) {
            return
        }

        if (token) {
            window.location.replace(
                `/api/token?token=${encodeURIComponent(token)}&next=${encodeURIComponent(nextPath)}`
            )
            return
        }

        hasFetched.current = true

        void fetch(endpoint)
            .then(
                (response) => response.json() as Promise<AdminRouteResponse<T>>
            )
            .then((result) => {
                setData(result)

                if (result?.user?.is_admin !== undefined) {
                    updateAdminStatus(result.user.is_admin)
                }

                if (!result?.user || !result.user.is_admin) {
                    window.location.replace('/')
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [endpoint, nextPath, token, updateAdminStatus])

    return {
        data,
        loading,
        token,
        isAdmin: data?.user?.is_admin ?? cachedIsAdmin,
        refetch: fetchData,
    }
}
