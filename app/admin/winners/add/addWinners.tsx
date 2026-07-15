import { GuestOption, PrizeOption, WinnerRow } from '@/lib/queries/winners'
import WinnersAdminForm from './WinnersAdminForm'

type WinnersRegistryProps = {
    guests: GuestOption[]
    prizes: PrizeOption[]
    previousYearWinners: WinnerRow[]
}

export default function WinnersRegistry({
    guests,
    prizes,
}: WinnersRegistryProps) {
    const currentYear = new Date().getFullYear()

    return (
        <div className="flex flex-col">
            <div className="bg-(--background)/60 lg:p-[50px] p-[25px] lg:pb-0 pb-0">
                <h2 className="lg:text-7xl text-5xl font-bold moontime mb-5 text-center">
                    Add this years winners
                </h2>
                <p className="text-center mb-8">
                    Register the chosen souls for {currentYear}.
                </p>
            </div>

            <div className="bg-(--background)/60 lg:p-[50px] p-[25px] pt-0 lg:pt-0">
                <WinnersAdminForm
                    guests={guests}
                    prizes={prizes}
                    currentYear={currentYear}
                />
            </div>
        </div>
    )
}
