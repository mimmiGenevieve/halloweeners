import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoldText } from '@/lib/bold'

describe('BoldText', () => {
    it('renders **wrapped** text as bold', () => {
        render(<BoldText text="Call **Halloweeners** on the intercom" />)
        const bold = screen.getByText('Halloweeners')
        expect(bold.tagName).toBe('B')
    })

    it('does not crash on an unterminated **', () => {
        expect(() =>
            render(<BoldText text="Call **Halloweeners on the intercom" />)
        ).not.toThrow()
    })
})
