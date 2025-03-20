import SubscriptionComponents from "./_components/SubscriptionComponents";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <SubscriptionComponents />
    </main>
  );
}
