import { BudgetItem } from "../types";
import DateUtils from "../utils/DateUtils";
import ItemDisplay from "./ItemDisplay";
type CalendarComponentProps = {
    items: BudgetItem[],
    month: number
}

export default function Calendar({
    items,
    month
}: CalendarComponentProps) {
    const currentDate = new Date();
    const daysInMonth = () => {
        const maxDays = DateUtils.getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
        const elements = [];
        for (let i = 0; i < maxDays; i++) {
            elements.push(i+1)
        }

        return elements;
    }

    return (
        <div className="grid grid-cols-7 gap-1">
            {daysInMonth().map((v, k) => (
                <ItemDisplay month={month} day={v} items={items} key={k} />
            ))}
        </div>
    );
}