'use client'

import { useState, useEffect, useCallback } from 'react'

const ADMIN_STORAGE_KEY = 'isAdmin'

export function useAdminStatusCache() {
    const [adminStatus, setAdminStatus] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY)
        if (stored !== null) {
            setAdminStatus(stored === 'true')
        }
    }, [])

    const update = useCallback((value: boolean) => {
        localStorage.setItem(ADMIN_STORAGE_KEY, String(value))
        setAdminStatus(value)
    }, [])

    return [adminStatus, update] as const
}