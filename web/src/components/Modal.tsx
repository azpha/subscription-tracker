export default function Modal({
    children,
    showModal,
    setShowModal
  }: {
    children: JSX.Element | JSX.Element[],
    showModal: boolean,
    setShowModal: (state: boolean) => void
  }) {
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowModal(false)}
      >
        <div 
          className={`bg-white p-4 max-w-md rounded-lg shadow-lg transform transition-all duration-300 ${
            showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setShowModal(false)} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
          {children}
        </div>
      </div>
    );
  }
  