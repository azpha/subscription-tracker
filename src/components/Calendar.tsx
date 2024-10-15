import type { BudgetItem } from "../types";
import DateUtils from "../utils/DateUtils";
import ItemDisplay from "./ItemDisplay";
import { useState, useEffect } from "react";

type CalendarComponentProps = {
    items: BudgetItem[],
    month: number,
    refetchData: () => void
}

export default function Calendar({
    items,
    month,
    refetchData
}: CalendarComponentProps) {
    const [ daysInMonth, setDaysInMonth ] = useState<number[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const maxDays = DateUtils.getDaysInMonth(currentDate.getFullYear(), month);
        const elements = Array.from({ length: maxDays + 1 }, (_, i) => i);

        // removes 0 from list
        elements.shift();

        // updates state
        setDaysInMonth(elements);
    }, [month])

    return (
        <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((v, k) => (
                <ItemDisplay refetchData={refetchData} month={month} day={v} items={items} key={k} />
            ))}
        </div>
    );
}