export default function Button({
    onClick,
    children,
    disabled = false
}: {
    onClick: () => void,
    children: JSX.Element,
    disabled: boolean
}) {
    return (
        <button onClick={onClick} disabled={disabled} className="bg-white text-black p-1 mt-2 rounded-lg font-bold">
            {children}
        </button>
    )
}