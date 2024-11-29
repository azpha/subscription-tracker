import AuthUtils from "../utils/AuthUtils"
import Header from "./Header";
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types";

export default function Layout({
    children,
    protectedPage = false,
    requiresSetup = false
}: {
    children: JSX.Element | JSX.Element[],
    protectedPage?: boolean,
    requiresSetup?: boolean
}) {
    const location = useLocation();
    const navigate = useNavigate()
    const [ isAuthenticated, setIsAuthenticated ] = useState<User | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(true)

    useEffect(() => {
        async function checkAuth() {
            const user = await AuthUtils.fetchAuthenticatedUser()
            const adminStatus = await AuthUtils.doesAdminExist()

            if (!adminStatus.success && requiresSetup) {
                navigate("/register")
            } else if (protectedPage && !user.success) {
                navigate("/login")
            } else if (location.pathname === "/register" && adminStatus.success) {
                navigate("/login")
            } else {
                setIsAuthenticated(user.success && user.user);
                if (!user.success) {
                    navigate('/login')
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