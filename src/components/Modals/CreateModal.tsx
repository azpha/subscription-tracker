import Modal from "../Modal"
import InputBox from "../InputBox"
import ItemUtils from "../../utils/ItemUtils"
import { useState, useEffect } from "react"
import type { BudgetItem } from "../../types"

export default function CreateModal({
    selectedDate,
    setShowModal,
    refetchData
}: {
    setShowModal: (state: boolean) => void,
    refetchData: () => void,
    selectedDate?: Date
}) {
    const [ createData, setCreateData ] = useState<BudgetItem>({
        name: "",
        billingMethod: "",
        id: 0,
        nextBillingDate: new Date(),
        price: "",
        billingFrequencyInMonths: 1,
        image: ""
    })
    const [ error, setError ] = useState<string>("");

    useEffect(() => {
        if (error) {
            setTimeout(() => {
            setError("")
            }, 3000)
        }
    }, [error])
    useEffect(() => {
        if (selectedDate) {
            setCreateData((prevState) => {
                return {
                    ...prevState,
                    nextBillingDate: selectedDate
                }
            })
        }
    }, []);

    return (
        <Modal setShowModal={setShowModal}>
            <h1 className="text-2xl font-bold mb-2 text-center">Create</h1>

            <div className="space-y-2 text-center">
                <InputBox 
                    name="name"
                    placeholder="Name.."
                    onChange={(value) => {
                        setCreateData((prevState) => {
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
                    onChange={(value) => {
                        setCreateData((prevState) => {
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
                    onChange={(value) => {
                        setCreateData((prevState) => {
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
                    onChange={(value) => {
                        setCreateData((prevState) => {
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
                    onChange={(value) => {
                        setCreateData((prevState) => {
                            return {
                                ...prevState,
                                billingFrequency: parseInt(value)
                            }
                        })
                    }}
                />

                {
                    selectedDate ? (
                        <p>
                            <span className="font-bold">Next date: </span> {selectedDate.toDateString()}
                        </p>
                    ) : (
                        <InputBox 
                            name="nextBillingDate"
                            placeholder="Date (ex. 10-25-2026)"
                            onChange={(value) => {
                                setCreateData((prevState) => {
                                    return {
                                        ...prevState,
                                        nextBillingDate: new Date(value)
                                    }
                                })
                            }}
                        />
                    )
                }

                <div className="block text-center">
                    <button onClick={() => {
                        ItemUtils.submitDataToApi(createData)
                            .then((res) => {
                                if (res) {
                                    refetchData()
                                    setShowModal(false);
                                } else {
                                    setError("Failed to create!")
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