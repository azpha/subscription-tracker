import type { BudgetItem } from "../types"
import DateUtils from "../utils/DateUtils";
import SVGLoader from "./SVGLoader";

type TooltipProps = {
    children: JSX.Element,
    budgetItem: BudgetItem
}

export default function ItemTooltip({
    children,
    budgetItem
}: TooltipProps) {
    const dateOfRenewal = new Date(budgetItem.nextBillingDate).getDate();
    const generateDateString = () => {
        if (budgetItem.billingFrequency === "yearly") {
            return <p className="text-xs mb-2 opacity-85">
                Every year on the <span className="font-semibold">{dateOfRenewal}{DateUtils.getSuffix(dateOfRenewal)}</span> of <span className="font-semibold">{DateUtils.months[new Date(budgetItem.nextBillingDate).getMonth()]}</span>
            </p>
        } else if (budgetItem.billingFrequency === "monthly") {
            return <p className="text-xs mb-2 opacity-85">
                Every month on the <span className="font-bold">
                     {dateOfRenewal}{DateUtils.getSuffix(dateOfRenewal)}
                </span>
                </p>
        }
    }

    return (
        <div className="relative group inline-block select-none">
            {children}
            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-0 -mt-1 bg-zinc-800 text-white p-2 rounded shadow-lg w-48">
                <div className="flex items-center space-x-2 mb-1">
                    {
                        budgetItem.image && <SVGLoader fill="white" height={"20"} width={"20"} url={budgetItem.image} />
                    }
                    
                    <h1 className="text-lg font-semibold">{budgetItem.name}</h1>
                    <p className="font-bold">${budgetItem.price}</p>
                </div>
                {generateDateString()}
            </div>
      </div>
    );
}