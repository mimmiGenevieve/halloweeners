import { sql } from '@/lib/neon'

const MODIFIERS = [
    'pink',
    'frilly',
    'hungry-hungry',
    'soggy',
    'polite',
    'anxious',
    'tiny-little',
    'confused',
    'sleepy',
    'grumpy-old',
    'lost',
    'wobbly',
    'fancy',
    'glittery',
    'sad-little',
    'moonlit',
    'velvet',
    'bubbling-green',
    'crooked',
    'howling-at',
    'three-eyed',
    'cobweb-covered',
    'foggy',
    'vintage',
    'flickering',
    'dripping',
    'hollow',
    'crunchy',
    'overly-friendly',
    'surprisingly-soft',
    'dramatic',
    'bathtub-full-of',
    'haunted',
    'squeaky',
    'suspiciously-quiet',
    'absolutely-fine',
    'dancing',
    'seven-cursed',
    'forgotten',
    'crimson-harvest',
    'wilted',
    'ancient',
    'shivering',
    'melancholy',
    'over-caffeinated',
    'stubbornly-cheerful',
    'perpetually-lost',
    'slightly-damp',
    'unnervingly-calm',
    'freshly-risen',
    'chronically-late',
    'suspiciously-charming',
    'deeply-tired',
]

const NOUNS = [
    'ghost',
    'zombie',
    'cat',
    'werewolf',
    'vampire',
    'banshee',
    'demon',
    'skeleton',
    'poltergeist',
    'witch',
    'soul-again',
    'cauldron',
    'death-shroud',
    'tombstone',
    'spectre',
    'broomstick',
    'coffin-lid',
    'potion',
    'black-hat',
    'nothing',
    'raven',
    'cake',
    'graveyard-stroll',
    'ouija-board',
    'candle-stub',
    'black-candle',
    'pumpkin-smile',
    'autumn-bones',
    'ghoul',
    'monster',
    'vampire-cape',
    'frogs',
    'sock-drawer',
    'coffin-hinge',
    'crypt',
    'headless-bride',
    'crows',
    'spell-book',
    'harvest-moon',
    'gargoyle',
    'mummy',
    'imp',
    'wraith',
    'jack-o-lantern',
    'scarecrow',
    'crow',
    'attic-door',
    'chandelier',
    'family-portrait',
    'grandfather-clock',
]

function randomFrom(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)]
}

function generateCandidate(): string {
    const modifierCount = Math.random() < 0.55 ? 1 : 2
    const parts: string[] = []
    for (let i = 0; i < modifierCount; i++) parts.push(randomFrom(MODIFIERS))
    parts.push(randomFrom(NOUNS))
    return parts
        .join('-')
        .toLowerCase()
        .replace(/[^a-z-]/g, '')
}

async function tokenExists(token: string): Promise<boolean> {
    const result =
        await sql`SELECT 1 FROM guests WHERE token = ${token} LIMIT 1`
    return result.length > 0
}

export async function generateUniqueGuestToken(
    maxAttempts = 20
): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = generateCandidate()
        if (!(await tokenExists(candidate))) {
            return candidate
        }
    }
    throw new Error(
        'Could not generate a unique token after multiple attempts.'
    )
}
