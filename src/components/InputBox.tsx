export default function InputBox({
    name,
    placeholder,
    defaultValue,
    isOption = false,
    options,
    onChange
}: {
    name: string,
    placeholder: string,
    defaultValue?: string,
    text?: boolean,
    isOption?: boolean,
    options?: string[],
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
                    type={"text"}
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