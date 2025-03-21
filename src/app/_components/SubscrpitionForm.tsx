import React, { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import StyledInput from './StyledInput';
import type { Subscription } from '@prisma/client';

export default function SubscriptionForm({
    onClose,
    onUpdate,
    subscription
}: {
    onClose: () => void,
    onUpdate: () => void,
    subscription?: Subscription | null
}) {
    const [ configuredSubscription, setConfiguredSubscription ] = useState<Subscription | null>(null)
    const [ formError, setFormError ] = useState<string>("")
    const { error: creationError, mutate: createMutation } = api.subs.create.useMutation()
    const { error: updateError, mutate: updateMutation } = api.subs.update.useMutation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // submit & reset
        if (!configuredSubscription) {
            setFormError("You need to define values before submitting the form!")
        } else {
            if (subscription) {
                updateMutation({
                    ...configuredSubscription,
                    id: subscription.id,
                    price: configuredSubscription.price.replace("$", "")
                })
            } else {
                createMutation({
                    ...configuredSubscription,
                    price: configuredSubscription.price.replace("$", "")
                })
            }

            onUpdate()
            setConfiguredSubscription(null)
        }
    }

    const handleValueUpdate = (data: object) => {
        if (!configuredSubscription) {
            setConfiguredSubscription({
                ...data
            } as Subscription)
        } else {
            setConfiguredSubscription((prevState) => {
                return {
                    ...prevState,
                    ...data as Subscription
                }
            })
        }
    }

    useEffect(() => {
        if (formError) {
            setTimeout(() => {
                setFormError("")
            }, 5000)
        }
    }, [formError])
    useEffect(() => {
        console.log(configuredSubscription)
    }, [ configuredSubscription ])

    return (
        <div className="border border-solid border-white rounded-lg p-4 bg-zinc-800 relative">
            <h1 className="text-2xl font-bold p-2">Create</h1>

            <form onSubmit={handleSubmit} className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-fit">
                    <div>
                        <label>Name</label>
                        <StyledInput defaultValue={subscription?.name} placeholder={'Name'} onChange={(v: string) => {
                            handleValueUpdate({ name: v })
                        }} />
                    </div>
                    <div>
                        <label>Price</label>
                        <StyledInput defaultValue={subscription?.price} placeholder={'Price'} onChange={(v: string) => {
                            handleValueUpdate({ price: v })
                        }} />
                    </div>
                    <div>
                        <label>Payment Method</label>
                        <StyledInput defaultValue={subscription?.paymentMethod} placeholder={'Payment Method'} onChange={(v: string) => {
                            handleValueUpdate({ paymentMethod: v })
                        }} />
                    </div>
                    <div>
                        <label>Next Billing Date</label>
                        <StyledInput defaultValue={subscription?.nextBillingDate.toLocaleDateString()} placeholder={'Billing Date (ex. 10-25-25)'} onChange={(v: string) => {
                            handleValueUpdate({ nextBillingDate: new Date(v) })
                        }} />
                    </div>
                    <div className="flex justify-start">
                        <button type="submit" className="bg-white rounded-lg p-2 text-black">
                            Submit
                        </button>
                    </div>
                </div>
                <p className="max-w-[400px] pt-2 text-red-200 font-bold">{creationError?.message ?? updateError?.message ?? formError}</p>
            </form>

            <p className="absolute top-2 right-2 select-none hover:cursor-pointer text-2xl" onClick={onClose}>X</p>
        </div>
    )
}