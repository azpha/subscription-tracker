import type { Subscription } from "@prisma/client"
import { api } from "@/trpc/react"

export default function SubscriptionItem({
    subscription,
    onEdit,
    onDelete
}: {
    subscription: Subscription,
    onEdit: (subscription: Subscription) => void,
    onDelete: () => void
}) {
    const deleteMutation = api.subs.delete.useMutation()

    const handleDeletion = () => {
        deleteMutation.mutate(subscription.id)
        onDelete()
    }

    return (
        <div className="relative w-full border border-solid  p-2 bg-zinc-800">
            <div className="inline-block">
                <h1 className="text-2xl font-bold inline">{subscription.name}</h1>

                <div className="text-sm opacity-75">
                    <p>${subscription.price}, {subscription.paymentMethod}</p>
                    <p>{subscription.nextBillingDate.toLocaleDateString()}</p>
                </div>
            </div>

            <button type={"button"} onClick={() => onEdit(subscription)} className={'bg-zinc-900 text-white rounded-lg p-2 absolute right-4 bottom-6'}>
                Edit
            </button>
            <button type={"button"} onClick={handleDeletion} className={'bg-red-950 text-white rounded-lg p-2 absolute right-16 bottom-6'}>
                Delete
            </button>
        </div>
    )
}