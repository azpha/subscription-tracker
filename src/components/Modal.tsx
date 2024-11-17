export default function Modal({
    children,
    setShowModal
  }: {
    children: JSX.Element | JSX.Element[],
    setShowModal: (state: boolean) => void
  }) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowModal(false);
      }
    })

    return (
      <div onClick={() => setShowModal(false)} className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black select-none">
        <div onClick={(e) => e.stopPropagation()} className="bg-white p-4 max-w-md rounded-lg shadow-lg relative">
          <div className="absolute text-black font-bold p-2 top-0 right-0">
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          
          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    )
  }
  