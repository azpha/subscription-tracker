export default function Modal({
    children,
    showModal,
    setShowModal
  }: {
    children: JSX.Element | JSX.Element[],
    showModal: boolean,
    setShowModal: (state: boolean) => void
  }) {
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      if (e.key === "Escape") {
        setShowModal(false);
      }
    })

    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 select-none ${
          showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`bg-white p-4 max-w-md rounded-lg shadow-lg transform transition-all duration-300 ${
            showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute bg-black rounded-lg">
            <button 
              onClick={() => setShowModal(false)} 
              className="text-white hover:text-gray-500"
            >
              <span className="text-lg p-1">&times;</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }
  