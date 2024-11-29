import Button from "./components/Button";
import InputBox from "./components/InputBox";
import AuthUtils from "./utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type InputState = {
    name: string,
    email: string,
    password: string
}

export default function Register() {
    const navigate = useNavigate()
    const [ error, setError ] = useState<string>("")
    const [ inputState, setInputState ] = useState<InputState>({
        name: "",
        email: "",
        password: ""
    })

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white rounded-md p-2">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                
                <div className="mx-auto my-2 space-y-2">
                    <InputBox 
                        name="name"
                        placeholder="Name.."
                        onChange={(v) => {
                            setInputState((prevState) => {
                                return {
                                    ...prevState,
                                    name: v
                                }
                            })
                        }}
                    />
                    <InputBox 
                        name="email"
                        placeholder="Email.."
                        type="email"
                        onChange={(v) => {
                            setInputState((prevState) => {
                                return {
                                    ...prevState,
                                    email: v
                                }
                            })
                        }}
                    />
                    <InputBox 
                        name="password"
                        placeholder="Password.."
                        type="password"
                        onChange={(v) => {
                            setInputState((prevState) => {
                                return {
                                    ...prevState,
                                    password: v
                                }
                            })
                        }}
                    />

                    <div className="text-center">
                        <Button dark={true} onClick={async () => {
                            const user = await AuthUtils.register(inputState.name, inputState.email, inputState.password)
                            if (user.status === 200) {
                                navigate("/")
                            } else {
                                console.error("Failed to auth!")
                                setError(user.message)
                            }
                        }}>
                            <p className="text-white">Register</p>
                        </Button>

                        {
                            error && ( <p className="font-semibold text-red-500 my-2">{error}</p> )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}