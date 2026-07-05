import { describe, it, expect } from 'vitest'
import { formatPartyDate, normalizeToken, sanitizeInviteToken } from './misc'

describe('normalizeToken', () => {
    it('lowercases and trims', () => {
        expect(normalizeToken('  ABC-def  ')).toBe('abc-def')
    })

    it('handles null/undefined without throwing', () => {
        expect(normalizeToken(null)).toBe('')
        expect(normalizeToken(undefined)).toBe('')
    })
})

describe('sanitizeInviteToken', () => {
    it('accepts letters and hyphens', () => {
        expect(sanitizeInviteToken('abc-def')).toBe('abc-def')
    })

    it('rejects tokens with numbers', () => {
        expect(sanitizeInviteToken('abc123')).toBe(null)
    })

    it('rejects tokens over 200 characters', () => {
        expect(sanitizeInviteToken('a'.repeat(201))).toBe(null)
    })
})

describe('formatPartyDate', () => {
    it('formats a Date object', () => {
        expect(formatPartyDate(new Date('2026-10-31'))).toBe(
            'October 31st, 2026.'
        )
    })

    it('formats an ISO string the same way (post-JSON round trip)', () => {
        expect(formatPartyDate('2026-10-31')).toBe('October 31st, 2026.')
    })

    it('gets ordinal suffixes right at the awkward boundaries', () => {
        expect(formatPartyDate('2026-01-01')).toContain('1st')
        expect(formatPartyDate('2026-01-11')).toContain('11th') // not "11st"
        expect(formatPartyDate('2026-01-21')).toContain('21st')
        expect(formatPartyDate('2026-01-22')).toContain('22nd')
    })
})
