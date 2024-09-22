export default function Layout({
    children
}: {
    children: JSX.Element | JSX.Element[]
}) {
    return (
        <div className="bg-black min-h-screen">
            {children}
        </div>
    )
}