'use client'
import { authenticateGuestToken } from '@/app/auth/actions'
import { useEffect, useState } from 'react'

type TokenAccessFormProps = {
    nextPath: string
    authError?: string
}

export default function TokenAccessForm({
    nextPath,
    authError,
}: TokenAccessFormProps) {
    const [hasError, setHasError] = useState(authError === 'invalid_token')

    useEffect(() => {
        setHasError(authError === 'invalid_token')
    }, [authError])

    return (
        <form action={authenticateGuestToken} className="flex flex-col  w-full">
            <p className="text-6xl mt-4 font-bold moontime mb-4 text-center">
                Enter Your Token
            </p>
            <p className="italic text-center mb-10">
                The veil lifts only for invited souls.
            </p>
            <input
                name="token"
                placeholder="Invitation token"
                className={`${hasError ? 'border-red-300' : 'border-(--foreground)'} border-2 py-2 px-4 rounded`}
                autoComplete="off"
                onChange={() => setHasError(false)}
                required
            />
            {hasError && (
                <p className="text-left text-red-300 text-base mt-0">
                    The spirits do not recognize that token. Please check your
                    invitation and try again.
                </p>
            )}
            <input type="hidden" name="nextPath" value={nextPath} />
            <button
                type="submit"
                className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-10 w-max self-center cursor-pointer"
            >
                Enter
            </button>
        </form>
    )
}
