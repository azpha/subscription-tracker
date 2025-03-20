"use client"

import type { Subscription } from "@prisma/client"
import { useState, useEffect } from 'react'
import { api } from "@/trpc/react"
import SubscriptionForm from "./SubscrpitionForm"
import SubscriptionList from "./SubscriptionList"

export default function SubscriptionComponents() {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [formVisible, setFormVisible] = useState<boolean>(false)
    const [formOpacity, setFormOpacity] = useState<boolean>(false)
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
    const { data: subscriptions, refetch } = api.subs.getAll.useQuery()

    // Handle form visibility with animation
    useEffect(() => {
        if (showForm) {
            // First make it visible but transparent
            setFormVisible(true);
            // Then trigger the opacity change after a tiny delay
            const timer = setTimeout(() => {
                setFormOpacity(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            // First make it transparent
            setFormOpacity(false);
            // Then remove from DOM after animation completes
            const timer = setTimeout(() => {
                setFormVisible(false);
            }, 100); // Match this to your duration-300
            return () => clearTimeout(timer);
        }
    }, [showForm]);

    const onUpdate = async () => {
        await refetch();
        setShowForm(false)
    }

    return (
        <div className="space-y-2 w-full">
            <div 
                className={`container mx-auto transition-opacity ease-linear duration-100 ${
                    formOpacity ? 'opacity-100' : 'opacity-0'
                } ${
                    !formVisible ? 'hidden' : ''
                }`}
            >
                <SubscriptionForm 
                    onClose={() => {
                        setShowForm(false)
                        setEditingSubscription(null)
                    }} 
                    onUpdate={onUpdate}
                    subscription={editingSubscription} 
                />
            </div>
            <div className="container mx-auto">
                <div className="border border-solid rounded-lg p-4 border-white bg-zinc-800 relative">
                    <div className="flex flex-row">
                        <h1 className="p-2 pb-4 font-bold text-2xl">Subscription Tracker</h1>
                        <button type="button" className="absolute right-4 bg-white text-black rounded-lg p-2" onClick={() => setShowForm(!showForm)}>
                            {
                                showForm ? "Cancel" : "Create"
                            }
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
        </div>
    )
}