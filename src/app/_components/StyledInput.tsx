export default function StyledInput({
    placeholder,
    onChange,
    type = "text",
    value,
    defaultValue
}: {
    placeholder: string,
    onChange: (v: string) => void,
    type?: string,
    value?: string,
    defaultValue?: string
}) {
    return (
        <input type={type} defaultValue={defaultValue} value={value} placeholder={placeholder} onChange={(e) => {
            onChange(e.target.value)
        }} className="bg-black text-white rounded-lg p-2 block" />
    )
}