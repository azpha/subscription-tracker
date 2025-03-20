export default function StyledButton({
    label,
    onClick = (() => null),
    type,
    className
}: {
    label: string,
    onClick?: () => void,
    type: "button" | "submit"
    className?: string
}) {
    return (
        <button type={type} onClick={onClick} className={`rounded-lg p-2 ${className}`}>
            {label}
        </button>
    )
}