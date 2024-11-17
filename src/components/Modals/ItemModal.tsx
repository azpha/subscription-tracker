import { type BudgetItem } from "../../types";
import Modal from "../Modal";
import ItemUtils from "../../utils/ItemUtils";
import InputBox from "../InputBox";
import { useState } from "react";

export default function ItemModal({
    item,
    setShowModal,
    refetchData
}: {
    item: BudgetItem,
    setShowModal: (state: boolean) => void,
    refetchData: () => void
}) {
    const [ editData, setEditData ] = useState<BudgetItem>(item)
    const [ error, setError ] = useState<string>("");

    return (
        <Modal setShowModal={setShowModal}>
            <h1 className="text-2xl font-bold mb-2 text-center">{item.name}</h1>
            
            <div className="space-y-2 text-center">
                <InputBox 
                    name="name"
                    placeholder="Name.."
                    defaultValue={item.name}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                name: value
                            }
                        })
                    }}
                />
                <InputBox 
                    name="price"
                    placeholder="Price (without $).."
                    defaultValue={item.price}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                price: value
                            }
                        })
                    }}
                />
                <InputBox 
                    name="image"
                    placeholder="Image.."
                    defaultValue={item.image}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                image: value
                            }
                        })
                    }}
                />
                <InputBox 
                    name="billingMethod"
                    placeholder="Billing method.."
                    defaultValue={item.billingMethod}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                billingMethod: value
                            }
                        })
                    }}
                />

                <InputBox 
                    name="billingFrequencyInMonths"
                    placeholder="Billing frequency (months).."
                    defaultValue={`${item.billingFrequencyInMonths}`}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                billingFrequencyInMonths: parseInt(value)
                            }
                        })
                    }}
                />

                <InputBox 
                    name="nextBillingDate"
                    placeholder="Date (ex. 10-25-2026)"
                    defaultValue={new Date(item.nextBillingDate).toLocaleDateString()}
                    onChange={(value) => {
                        setEditData((prevState) => {
                            return {
                                ...prevState,
                                nextBillingDate: new Date(value)
                            }
                        })
                    }}
                />

                <div className="block text-center">
                    <button onClick={() => {
                        ItemUtils.updateItemViaApi(item.id, editData)
                            .then((res) => {
                                if (res) {
                                    refetchData()
                                    setShowModal(false);
                                } else {
                                    setError("Failed to update!")
                                }
                            })
                            .catch((e) => {
                                setError(e.message);
                            })
                    }} type="button" className="bg-black text-white font-bold p-2 rounded-lg">Submit</button>
                </div>
                <p className="italic text-red-500">{error}</p>
            </div>
        </Modal>
    )
}