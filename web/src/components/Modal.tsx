export default function Modal({
    children,
    showModal,
    setShowModal
}: {
    children: JSX.Element | JSX.Element[],
    showModal: boolean,
    setShowModal: (state: boolean) => void
}) {
    if (showModal) {
        return (
            <div onClick={() => setShowModal(false)} className="select-none absolute flex bg-white bg-opacity-10 min-h-screen w-screen justify-center items-center">
                <div onClick={(e) => e.stopPropagation()} className="bg-white p-4 max-w-96 relative">
                    <p onClick={() => setShowModal(false)} className="absolute text-2xl right-0 pr-6 hover:cursor-pointer hover:underline hover:text-gray-500">X</p>
                    {children}
                </div>
            </div>
        )
    }
}