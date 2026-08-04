export type GuestFilterOption = {
    is_admin?: boolean | null
}

export function filterInvitedGuests<T extends GuestFilterOption>(
    guests: T[]
): T[] {
    return guests.filter((guest) => guest.is_admin !== true)
}
