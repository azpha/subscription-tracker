import type { BudgetItem } from "../types";
import ItemTooltip from "./ItemTooltip";
import SVGLoader from "./SVGLoader";

type ItemDisplayProps = {
    day: number,
    month: number,
    items: BudgetItem[]
}
export default function ItemDisplay({
    day,
    month,
    items
}: ItemDisplayProps) {
    const isCurrentDate = () => {
        return (day === new Date().getDate()) && new Date().getMonth() === month
    }
    const possibleData = items.filter((v) => {
        if (v?.nextBillingDate) {
            const date = new Date(v.nextBillingDate);
            console.log(v.name, date)

            return (date.getFullYear() === new Date().getFullYear())
                && (date.getMonth() === month)
                && (date.getDate() === day);
        }
    })

    if (possibleData.length > 0) {
        return (
            <ItemTooltip budgetItem={possibleData[0]}>
                <div className={`w-14 h-14 rounded-lg flex items-end justify-center border border-black ${isCurrentDate() ? "bg-zinc-500 text-black" : "bg-zinc-900"}`}>
                    <div className="mb-7">
                        <SVGLoader url={possibleData[0].image as string} width="16" height="16" fill="white" />
                    </div>
                    <p className="text-white opacity-50 absolute select-none">{day}</p>
                </div>
            </ItemTooltip>
        )
    } else {
        return (
            <div className={`w-14 h-14 rounded-lg flex items-end justify-center border border-black ${isCurrentDate() ? "bg-zinc-500 text-black" : "bg-zinc-900"}`}>
                <div className="mb-7">
                </div>
                <p className="text-white opacity-50 absolute select-none">{day}</p>
            </div>
        )
    }
}