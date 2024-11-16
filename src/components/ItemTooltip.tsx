import type { BudgetItem } from "../types"
import { useState } from "react";
import DateUtils from "../utils/DateUtils";
import Trash from "./Icons/Trash";
import ItemUtils from "../utils/ItemUtils";

type TooltipProps = {
    children: JSX.Element,
    budgetItems: BudgetItem[],
    refetchData: () => void
}

export default function ItemTooltip({
    children,
    budgetItems,
    refetchData
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
                        <img className='inline' src={budgetItems[selectedItem].image} width={"20"} height={"20"} />
                    }
                    
                    <h1 className="text-lg font-semibold whitespace-nowrap truncate max-w-[120px]">{budgetItems[selectedItem].name}</h1>

                    <div className="absolute top-0 right-0 p-2">
                        <Trash onClick={() => {
                            ItemUtils.submitDeleteToApi(budgetItems[selectedItem].id)
                                .then((res) => {
                                    if (res) {
                                        refetchData()
                                    }
                                })
                        }} />
                    </div>
                </div>
                {
                    budgetItems.length > 1 && (
                        <div className="absolute bottom-0 right-0 mb-[20px] mr-[35px]">
                            <p onClick={() => incrementSelectedState()} className="text-xs absolute hover:underline hover:cursor-pointer">Next</p>
                        </div>
                    )
                }
                {generateDateString()}

                <p className="font-bold inline">${budgetItems[selectedItem].price}</p>
                <p className="opacity-50 inline">/</p>
                <p
                    className="font-bold inline hover:cursor-pointer"
                    onClick={() => {
                        ItemUtils.pushItemToNextMonthViaApi(budgetItems[selectedItem].id)
                            .then((res) => {
                                if (res) {
                                    refetchData()
                                }
                            })
                    }} 
                >
                    ${budgetItems[selectedItem].totalSpent}
                </p>
            </div>
      </div>
    );
}