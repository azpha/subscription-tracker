import Button from "./components/Button";
import InputBox from "./components/InputBox";
import AuthUtils from "./utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type InputState = {
    email: string,
    password: string
}

export default function Login() {
    const navigate = useNavigate()
    const [ error, setError ] = useState<string>("")
    const [ inputState, setInputState ] = useState<InputState>({
        email: "",
        password: ""
    })

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white rounded-md p-2">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                
                <div className="mx-auto my-2 space-y-2">
                    <InputBox 
                        name="email"
                        placeholder="Email.."
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
                            setError("")
                            
                            const user = await AuthUtils.login(inputState.email, inputState.password)
                            if (user.success) {
                                navigate("/")
                            } else {
                                console.error("Failed to auth!")
                                setError(user.message)
                            }
                        }}>
                            <p className="text-white">Login</p>
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