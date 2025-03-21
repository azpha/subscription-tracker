"use client"

import type { Subscription } from "@prisma/client"
import { useState } from 'react'
import { api } from "@/trpc/react"
import SubscriptionForm from "./SubscrpitionForm"
import SubscriptionList from "./SubscriptionList"
import Modal from "./Modal"

export default function SubscriptionComponents() {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
    const { data: subscriptions, refetch } = api.subs.getAll.useQuery()

    const onUpdate = async () => {
        await refetch();
        setShowForm(false)
    }

    return (
        <div className="container">
            {
                showForm && (
                    <Modal onClose={() => setShowForm(false)}>
                        <SubscriptionForm 
                            onClose={() => {
                                setShowForm(false)
                                setEditingSubscription(null)
                            }} 
                            onUpdate={onUpdate}
                            subscription={editingSubscription} 
                        />
                    </Modal>
                )
            }

            <div className="border border-solid rounded-lg p-4 border-white bg-zinc-800 relative">
                <div className="flex flex-row">
                    <h1 className="p-2 pb-4 font-bold text-2xl">Subscription Tracker</h1>
                    <button type="button" className="absolute right-4 bg-white text-black rounded-lg p-2" onClick={() => setShowForm(!showForm)}>
                        Create
                    </button>
                </div>
                <SubscriptionList 
                    subscriptions={subscriptions} 
                    onDelete={refetch}
                    onEdit={(subscription: Subscription) => {
                        setEditingSubscription(subscription)
                        setShowForm(true)
                    }} 
                />
            </div>
        </div>
    )
}