import { getAuthenticatedGuestToken } from '@/app/auth/actions'

type AdminApiUser = {
    id: string
    name: string
    is_admin: boolean
}

export async function getAdminApiUser(): Promise<AdminApiUser | null> {
    const user = await getAuthenticatedGuestToken()

    if (!user || !user.is_admin) {
        return null
    }

    return {
        id: user.id,
        name: user.name,
        is_admin: user.is_admin,
    }
}

export function adminJsonResponse(payload: unknown) {
    return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
