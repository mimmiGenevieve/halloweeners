export type PartyDetailsRow = {
    date: Date | string
    start: string
    end: string
    address: string
    address_extra: string | null
}

type EmailDetailsRow = {
    from: string
    subject: string
}

export type CalendarDetailsRow = {
    from: string
    to: string
    details: string | null
}

export type PartyInfo = {
    party_details: PartyDetailsRow
    email_details: EmailDetailsRow
    calendar_details: CalendarDetailsRow
}
