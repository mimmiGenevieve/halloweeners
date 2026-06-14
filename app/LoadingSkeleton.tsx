'use client'

export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-(--foreground)/10 rounded animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-(--foreground)/10 rounded animate-pulse w-1/2 mx-auto" />
            <div className="h-10 bg-(--foreground)/10 rounded animate-pulse" />
            <div className="h-10 bg-(--foreground)/10 rounded animate-pulse" />
            <div className="h-10 bg-(--foreground)/10 rounded animate-pulse" />
            <div className="h-10 bg-(--foreground)/10 rounded animate-pulse w-1/3 mx-auto mt-4" />
        </div>
    )
}