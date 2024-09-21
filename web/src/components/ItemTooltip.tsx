import type { BudgetItem } from "../types"
import { useState } from "react";
import DateUtils from "../utils/DateUtils";
import SVGLoader from "./SVGLoader";

type TooltipProps = {
    children: JSX.Element,
    budgetItems: BudgetItem[]
}

export default function ItemTooltip({
    children,
    budgetItems
}: TooltipProps) {
    const [ selectedItem, setSelectedItem ] = useState<number>(0);

    const generateDateString = () => {
        const dateOfRenewal = new Date(budgetItems[selectedItem].nextBillingDate).getDate();
        if (budgetItems[selectedItem].billingFrequency === "yearly") {
            return <p className="text-xs mb-2 opacity-85">
                Every year on the <span className="font-semibold">{dateOfRenewal}{DateUtils.getSuffix(dateOfRenewal)}</span> of <span className="font-semibold">{DateUtils.months[new Date(budgetItems[selectedItem].nextBillingDate).getMonth()]}</span>
            </p>
        } else if (budgetItems[selectedItem].billingFrequency === "monthly") {
            return <p className="text-xs mb-2 opacity-85">
                Every month on the <span className="font-bold">
                     {dateOfRenewal}{DateUtils.getSuffix(dateOfRenewal)}
                </span>
            </p>
        }
    }
    const incrementSelectedState = () => {
        setSelectedItem((prevState) => {
            if (prevState === budgetItems.length || !budgetItems[prevState + 1]) return 0;
            else return prevState + 1;
        })
    }

    return (
        <div className="relative group inline-block select-none">
            {children}
            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-0 -mt-1 bg-zinc-800 text-white p-2 rounded shadow-lg w-48">
                <div className="flex items-center space-x-2 mb-1">
                    {
                        budgetItems[selectedItem].image && <SVGLoader fill="white" height={"20"} width={"20"} url={budgetItems[selectedItem].image} />
                    }
                    
                    <h1 className="text-lg font-semibold">{budgetItems[selectedItem].name}</h1>
                    <p className="font-bold">${budgetItems[selectedItem].price}</p>
                </div>
                {
                    budgetItems.length > 1 && (
                        <div className="absolute ml-[150px] mt-[10px]">
                            <p onClick={() => incrementSelectedState()} className="text-xs absolute hover:underline hover:cursor-pointer">Next</p>
                        </div>
                    )
                }
                {generateDateString()}
            </div>
      </div>
    );
}