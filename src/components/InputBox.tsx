export default function InputBox({
    name,
    placeholder,
    defaultValue,
    isOption = false,
    options,
    type = "text",
    onChange
}: {
    name: string,
    placeholder: string,
    defaultValue?: string,
    text?: boolean,
    isOption?: boolean,
    options?: string[],
    type?: "text" | "password" | "email",
    onChange: (value: string) => void
}) {
    if (isOption) {
        return (
            <div className="block">
                <select onChange={({ target }) => onChange(target.value)}>
                    {
                        options?.map((v, k) => {
                            return <option key={k} id={v}>{v}</option>
                        })
                    }
                </select>
            </div>
        )
    } else {
        return (
            <div className="block">
                <input 
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    autoComplete="off"
                    placeholder={placeholder}
                    onChange={(({ target }) => onChange(target.value))}
                    className="bg-black text-white rounded-lg p-2"
                />
            </div>
        )
    }
}