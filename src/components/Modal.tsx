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
      <div 
        className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 select-none'
        onClick={() => setShowModal(false)}
      >
        <div 
          className='bg-white p-4 max-w-md rounded-lg shadow-lg transform transition-all duration-300'
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
  