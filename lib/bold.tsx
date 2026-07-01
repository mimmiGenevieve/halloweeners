import React from 'react'

export function Bold({ children }: { children: React.ReactNode }) {
    return <b>{children}</b>
}

export function BoldText({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <Bold key={i}>{part.slice(2, -2)}</Bold>
                }
                return <React.Fragment key={i}>{part}</React.Fragment>
            })}
        </>
    )
}