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
                <div className="bg-white p-2 rounded-lg">
                    <p className="p-2 absolute top-1 right-1" onClick={() => onClose()}>X</p>
    
                    <div className="mr-6">
                        <h1 className={`font-bold text-2xl ${headerColor ? 'text-' + headerColor + '-500' : 'black'}`}>{header}</h1>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        )
    }
}