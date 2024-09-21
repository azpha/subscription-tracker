import type { BudgetItem } from "../types";
import ItemTooltip from "./ItemTooltip";
import SVGLoader from "./SVGLoader";

export default function ItemDisplay({ day, items }: { day: number, items: BudgetItem[] }) {
    const possibleData = items.filter((v) => {
        if (v?.nextBillingDate) {
            const date = new Date(v.nextBillingDate);

            return (date.getFullYear() === new Date().getFullYear())
                && (date.getMonth() === new Date().getMonth())
                && (date.getDate() + 1 === day);
        }
    })

    if (possibleData.length > 0) {
        return (
            <ItemTooltip budgetItem={possibleData[0]}>
                <div className="w-14 h-14 rounded-lg flex items-end justify-center border border-black bg-zinc-900">
                    <div className="mb-7">
                        <SVGLoader url={possibleData[0].image as string} width="16" height="16" fill="white" />
                    </div>
                    <p className="text-white opacity-50 absolute select-none">{day}</p>
                </div>
            </ItemTooltip>
        )
    } else {
        return (
            <div className="w-14 h-14 rounded-lg flex items-end justify-center border border-black bg-zinc-900">
                <div className="mb-7">
                </div>
                <p className="text-white opacity-50 absolute select-none">{day}</p>
            </div>
        )
    }
}