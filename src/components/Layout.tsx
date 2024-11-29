import AuthUtils from "../utils/AuthUtils"
import Header from "./Header";
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types";

export default function Layout({
    children,
    protectedPage = false
}: {
    children: JSX.Element | JSX.Element[],
    protectedPage?: boolean
}) {
    const location = useLocation();
    const navigate = useNavigate()
    const [ isAuthenticated, setIsAuthenticated ] = useState<User | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(true)

    useEffect(() => {
        async function checkAuth() {
            const user = await AuthUtils.fetchAuthenticatedUser()
            const adminStatus = await AuthUtils.doesAdminExist()

            if (adminStatus.status !== 200 && user.status !== 200) {
                navigate("/register")
            } else if (protectedPage) {
                try {
                    setIsAuthenticated(user.status === 200 && user.user)
                    if (user.status !== 200) {
                        navigate("/login")
                    }
                } catch (e) {
                    setIsAuthenticated(null)
                    navigate("/login")
                }
            }

            if (location.pathname === "/login" && user.status === 200) {
                navigate("/")
            } else if (location.pathname === "/register" && adminStatus.status === 200) {
                if (user.status === 200) {
                    navigate("/")
                } else {
                    navigate("/login")
                }
            }


            setIsLoading(false)
        }
        checkAuth()
    }, [protectedPage])

    if (isLoading) {
        return <div className="bg-black min-h-screen">Loading...</div>;
    }

    if (protectedPage && !isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-black min-h-screen">
            { isAuthenticated && <Header user={isAuthenticated} /> }
            {children}
        </div>
    );
}