import type { BudgetItem } from "../types";
import DateUtils from "../utils/DateUtils";
import ItemDisplay from "./ItemDisplay";
import { useState, useEffect } from "react";

type CalendarComponentProps = {
    items: BudgetItem[],
    month: number
}

export default function Calendar({
    items,
    month
}: CalendarComponentProps) {
    const [ daysInMonth, setDaysInMonth ] = useState<number[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const maxDays = DateUtils.getDaysInMonth(currentDate.getFullYear(), month);
        const elements = [];
        for (let i = 0; i <= maxDays; i++) {
            elements.push(i);
        }

        setDaysInMonth(elements);
    }, [month])

    return (
        <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((v, k) => (
                <ItemDisplay month={month} day={v} items={items} key={k} />
            ))}
        </div>
    );
}