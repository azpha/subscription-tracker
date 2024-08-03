import Trash from "./Icons/Trash"

export default function ListItem({
    id,
    name,
    price,
    timePeriodDueIn,
    onDeleteItem
}: {
    id: number,
    name: string,
    price: string,
    timePeriodDueIn: string,
    onDeleteItem: (id: number) => void
}) {
    return (
        <div className="text-left p-2 select-none hover:cursor-pointer hover:bg-zinc-400">
            <h1 className="font-bold">{name} <Trash onClick={() => onDeleteItem(id)} /></h1>
            <p>${price} | Due in {timePeriodDueIn}</p>
        </div>
    )
}