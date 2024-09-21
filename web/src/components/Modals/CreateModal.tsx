import Modal from "../Modal"
import InputBox from "../InputBox"
import ItemUtils from "../../utils/ItemUtils"
import { useState, useEffect } from "react"
import type { BudgetItem } from "../../types"

export default function CreateModal({
    setShowModal,
    showModal
}: {
    setShowModal: (state: boolean) => void,
    showModal: boolean
}) {
    const [ createData, setCreateData ] = useState<BudgetItem>({
        name: "",
        billingMethod: "",
        id: 0,
        lastBillingDate: new Date(),
        nextBillingDate: new Date(),
        price: "",
        billingFrequency: "monthly",
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

    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
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
                    name="date"
                    placeholder="Date (ex. 09-20-2024)..."
                    onChange={(value) => {
                        setCreateData((prevState) => {
                            return {
                            ...prevState,
                            nextBillingDate: new Date(value)
                            }
                        })
                    }}
                />
                <InputBox 
                    name="billingFrequency"
                    placeholder="Billing frequency.."
                    isOption={true}
                    options={[
                    "Monthly",
                    "Yearly"
                    ]}
                    onChange={(value) => {
                        setCreateData((prevState) => {
                            return {
                            ...prevState,
                            billingFrequency: value.toLowerCase() as "yearly" | "monthly"
                            }
                        })
                    }}
                />

                <div className="block text-center">
                    <button onClick={() => {
                        ItemUtils.submitDataToApi(createData)
                            .then((res) => {
                                if (res) {
                                    setShowModal(false);
                                }
                            })
                    }} type="button" className="bg-black text-white font-bold p-2 rounded-lg">Submit</button>
                </div>
                <p className="italic text-red-500">{error}</p>
            </div>
        </Modal>
    )
}