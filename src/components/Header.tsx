import type { User } from "../types"

export default function Header({
    user
}: {
    user: User | null
}) {
    return (
        <div className="bg-zinc-900 text-white p-2 absolute w-full">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Subscription Tracker</h1>
                    <a href="/api/auth/logout" className="hover:underline">Logout</a>
                </div>
                <div className="flex items-center">
                    <h1>Hi, <span className="font-bold">{user?.name}</span>!</h1>
                </div>
            </div>
        </div>
    )
}