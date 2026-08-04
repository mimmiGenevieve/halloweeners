import { describe, expect, it } from 'vitest'
import { filterInvitedGuests } from '@/lib/queries/guest-filters'

describe('filterInvitedGuests', () => {
    it('removes admin guests from the invited list while keeping regular guests', () => {
        const guests = [
            { id: '1', name: 'Regular Guest', token: 'abc', is_admin: false },
            { id: '2', name: 'Admin Guest', token: 'def', is_admin: true },
            { id: '3', name: 'Guest without flag', token: 'ghi' },
        ]

        expect(filterInvitedGuests(guests)).toEqual([
            { id: '1', name: 'Regular Guest', token: 'abc', is_admin: false },
            { id: '3', name: 'Guest without flag', token: 'ghi' },
        ])
    })
})
