import { useState, useEffect } from "react";
import SubscriptionList from "./components/SubscriptionList";
import api from "./utils/api";
import SubscriptionForm from "./components/SubscriptionForm";
import Modal from "./components/Modal";
import Version from "./components/Version";
import type { Subscription, CurrentFilter } from "./utils/types";
import SubscriptionFilters from "./components/SubscriptionFilters";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<CurrentFilter>("all-subscriptions");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSubscriptions = async () => {
    const data = await api.fetchItems();
    setSubscriptions(data);
  };
  const fetchExpiringSubscriptions = async (inRange?: string) => {
    const data = await api.fetchExpiringSoonItems(inRange);
    setSubscriptions(data);
  };
  const requestWithFilter = async (filter: CurrentFilter) => {
    if (filter === "all-subscriptions") {
      await fetchSubscriptions();
    } else {
      fetchExpiringSubscriptions(filter);
    }
  };

  useEffect(() => {
    if (activeFilter === "all-subscriptions") {
      fetchSubscriptions();
    } else {
      requestWithFilter(activeFilter);
    }
  }, [activeFilter]);

  return (
    <main className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="flex flex-wrap space-y-4">
        <SubscriptionFilters
          currentFilter={activeFilter}
          setSearchQuery={setSearchQuery}
          setCurrentFilter={(v) => setActiveFilter(v)}
        />

        <div className="border border-white border-solid p-2 container">
          <div className="p-2">
            <div className="flex-wrap flex justify-between pb-2 md:space-y-0 space-y-2">
              <div className="flex flex-wrap space-x-2">
                <h1 className="text-2xl font-bold">Subscription Tracker</h1>
              </div>

              <button
                onClick={() => {
                  setShowForm(true);
                }}
                className="bg-white text-black rounded-lg p-2 font-bold hover:cursor-pointer"
              >
                Create
              </button>
            </div>

            {subscriptions && (
              <SubscriptionList
                refresh={
                  activeFilter !== "all-subscriptions"
                    ? fetchExpiringSubscriptions
                    : fetchSubscriptions
                }
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
      </div>

      <Version />
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
              setEditingSubscription(null);
            }}
            subscription={editingSubscription}
          />
        </Modal>
      )}
    </main>
  );
}

export default App;
