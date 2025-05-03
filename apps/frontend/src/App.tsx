import { useState, useEffect } from "react";
import SubscriptionList from "./components/SubscriptionList";
import api from "./utils/api";
import SubscriptionForm from "./components/SubscriptionForm";
import Modal from "./components/Modal";
import StyledInput from "./components/StyledInput";
import type { Subscription } from "./utils/types";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSubscriptions = async () => {
    const data = await api.fetchItems();
    setSubscriptions(data);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="border border-white border-solid p-2 container">
        <div className="p-2">
          <div className="flex-wrap flex justify-between pb-2 md:space-y-0 space-y-2">
            <h1 className="text-2xl font-bold">Subscription Tracker</h1>

            <div className="float-right flex flex-wrap space-x-2">
              <StyledInput
                onChange={(v) => setSearchQuery(v)}
                placeholder={"search.."}
                dark={false}
              />
              <button
                onClick={() => {
                  setShowForm(true);
                }}
                className="bg-white text-black rounded-lg p-2 font-bold hover:cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>

          {subscriptions && (
            <SubscriptionList
              refresh={fetchSubscriptions}
              filterKeyword={searchQuery}
              subscriptions={subscriptions}
              onEdit={(subscription: Subscription) => {
                setEditingSubscription(subscription);
                setShowForm(true);
              }}
            />
          )}
        </div>
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <SubscriptionForm
            onClose={() => {
              setShowForm(false);
              setEditingSubscription(null);
            }}
            onUpdate={() => {
              fetchSubscriptions();
              setShowForm(false);
            }}
            subscription={editingSubscription}
          />
        </Modal>
      )}
    </main>
  );
}

export default App;
