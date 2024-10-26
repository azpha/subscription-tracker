import type { BudgetItem } from "../types";
import DateUtils from "../utils/DateUtils";
import ItemDisplay from "./ItemDisplay";
import { useState, useEffect } from "react";

type CalendarComponentProps = {
    items: BudgetItem[],
    date: Date,
    onClickCreate: (date: Date) => void,
    refetchData: () => void
}

export default function Calendar({
    items,
    date,
    onClickCreate,
    refetchData
}: CalendarComponentProps) {
    const currentDate = new Date();
    const [ numberOfDaysInMonth, setNumberOfDaysInMonth ] = useState<number[]>([]);

    // hooks
    useEffect(() => {
        const currentDate = new Date();
        const maxDays = DateUtils.getDaysInMonth(currentDate.getFullYear(), date.getMonth() + 1);
        const elements = Array.from({ length: maxDays + 1 }, (_, i) => i);

        // removes 0 from list
        elements.shift();

        // updates state
        setNumberOfDaysInMonth(elements);
    }, [date])

    return (
        <div className="grid grid-cols-7 gap-1">
            {numberOfDaysInMonth.map((v, k) => {
                return <div key={k}>
                    {
                        (v <= 7) && (
                            <div className="mb-2 select-none">
                                <p className="text-white text-center bg-zinc-800 rounded-lg">
                                    {
                                        DateUtils.getDateFromMonth(
                                            currentDate.getFullYear(),
                                            date.getMonth(),
                                            v
                                        )
                                    }
                                </p>
                            </div>
                        )
                    }
                    <ItemDisplay onItemSelect={onClickCreate} refetchData={refetchData} date={date} day={v} items={items} key={k} />
                </div>
            })}
        </div>
    );
}