'use client'
import { authenticateGuestToken } from '@/app/auth/actions'
import { useEffect, useState, useTransition } from 'react'

type TokenAccessFormProps = {
    nextPath: string
    authError?: string
}

export default function TokenAccessForm({
    nextPath,
    authError,
}: TokenAccessFormProps) {
    const [hasError, setHasError] = useState(authError === 'invalid_token')
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        token: '',
        nextPath: nextPath,
    })

    useEffect(() => {
        setHasError(authError === 'invalid_token')
    }, [authError])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formDataObj = new FormData()
        formDataObj.append('token', formData.token.trim())
        formDataObj.append('nextPath', formData.nextPath)

        startTransition(async () => {
            await authenticateGuestToken(formDataObj)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col  w-full">
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
                maxLength={200}
                value={formData.token}
                onChange={(e) => {
                    setFormData({ ...formData, token: e.target.value })
                    setHasError(false)
                }}
                required
            />
            {hasError && (
                <p className="text-left text-red-300 text-base mt-0">
                    The spirits do not recognize that token. Please check your
                    invitation and try again.
                </p>
            )}
            <button
                type="submit"
                className="bg-(--foreground) text-(--background) py-2 px-4 rounded mt-10 w-max self-center "
                disabled={isPending}
            >
                {isPending ? 'Entering...' : 'Enter'}
            </button>
        </form>
    )
}
