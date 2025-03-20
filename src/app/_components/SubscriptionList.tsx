"use client"

import SubscriptionItem from "./SubscriptionItem"
import type { Subscription } from "@prisma/client"

export default function SubscriptionList({
    subscriptions,
    onEdit,
    onDelete
}: {
    subscriptions: Subscription[] | undefined,
    onEdit: (subscription: Subscription) => void,
    onDelete: () => void
}) {
    return (
        <div className="border border-solid border-white bg-zinc-800">
            {
                subscriptions && subscriptions.length > 0 ? (
                    subscriptions.map((v,k) => {
                        return <SubscriptionItem onDelete={onDelete} key={k} subscription={v} onEdit={onEdit} />
                    })
                ) : (
                    <div className="p-2 text-center">
                        <h1 className="font-bold text-2xl">Uh oh!</h1>
                        <p>No subscriptions created :*(</p>
                    </div>
                )
            }
        </div>
    )
}