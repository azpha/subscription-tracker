interface HeaderProps {
  setCreateModalOpen: (v: boolean) => void;
}
export default function Header({ setCreateModalOpen }: HeaderProps) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Tracker</h1>
        <p className="text-sm opacity-50">Track your upcoming subscriptions</p>
      </div>
      <div className="flex items-center my-2 md:my-0 space-x-2">
        <button
          onClick={() => setCreateModalOpen(true)}
          type="button"
          className={`bg-white text-black p-2 rounded-lg font-semibold w-full text-sm`}
        >
          Add subscription
        </button>
      </div>
    </>
  );
}
