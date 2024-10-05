import type { ToastBoxType } from "../types"

export default function ToastBox({
    header,
    headerColor,
    message,
    onClose
}: ToastBoxType) {
    const shouldShow = (header && message && onClose);

    if (shouldShow) {
        return (
            <div className="absolute bottom-4 right-4 w-1/4 select-none">
                <div className="bg-zinc-900 text-white p-2 rounded-lg">
                    <p className="p-2 absolute top-1 right-1 hover:cursor-pointer hover:underline" onClick={() => onClose()}>X</p>
    
                    <div className="mr-6">
                        <h1 className={`font-semibold text-2xl ${headerColor ? 'text-' + headerColor + '-800' : 'black'}`}>{header}</h1>
                        <p className="opacity-85">{message}</p>
                    </div>
                </div>
            </div>
        )
    }
}