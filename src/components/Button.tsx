export default function Button({
    onClick,
    dark = false,
    children,
    disabled = false
}: {
    onClick: () => void,
    dark?: boolean,
    children: JSX.Element,
    disabled?: boolean
}) {
    return (
        <button onClick={onClick} disabled={disabled} className={`${dark ? "bg-black" : "bg-white"} text-black p-1 mt-2 rounded-lg font-bold`}>
            {children}
        </button>
    )
}