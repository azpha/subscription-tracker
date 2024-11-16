import type { BudgetItem } from "../types";
import ItemTooltip from "./ItemTooltip";
import SVGLoader from "./SVGLoader";

type ItemDisplayProps = {
    day: number,
    date: Date,
    items: BudgetItem[],
    onItemSelect: (date: Date) => void,
    refetchData: () => void
}
export default function ItemDisplay({
    day,
    date,
    items,
    onItemSelect,
    refetchData
}: ItemDisplayProps) {
    const isCurrentDate = () => {
        return (day === new Date().getDate()) && new Date().getMonth() === date.getMonth()
    }
    const possibleData = items.filter((v) => {
        if (v?.nextBillingDate) {
            const nextBillingDate = new Date(v.nextBillingDate);

            return (nextBillingDate.getMonth() === date.getMonth())
            && (nextBillingDate.getDate() === day);
        }
    })
    const whenSelectedItem = (selectedDayValue: number) => {
        const newSelectedDate = new Date(date);
        newSelectedDate.setDate(selectedDayValue);
        return newSelectedDate;
    }

    // if there's more than 1 subscription for a given day,
    // only show up to 3 images
    const getImagesForData = () => {
        const images = [];
        for (let i = 0; i <= 3; i++) {
            if (possibleData[i] && images.length < 3) {
                if (possibleData[i].image?.includes(".svg")) {
                    images.push(
                        <SVGLoader key={i} url={possibleData[i].image as string} width="16" height="16" fill="white" />
                    )
                } else {
                    images.push(
                        <img className="inline" key={i} src={possibleData[i].image} width="16" height="16" />
                    )
                }
            }
        }
        return images;
    }

    const element = (
        <div 
            onClick={() => onItemSelect(whenSelectedItem(day))} 
            className={`w-14 h-14 rounded-lg flex items-end justify-center border border-black ${isCurrentDate() ? "bg-zinc-500 text-black" : "bg-zinc-900"}`}
        >
            {
                possibleData.length > 0 && (
                    <div className="mb-6">
                        {getImagesForData()}
                    </div>
                )
            }
            <p className="text-white opacity-50 absolute select-none">{day}</p>
        </div>
    )

    if (possibleData.length > 0) {
        return (
            <ItemTooltip refetchData={refetchData} budgetItems={possibleData}>
                {element}
            </ItemTooltip>
        )
    } else return element;
}