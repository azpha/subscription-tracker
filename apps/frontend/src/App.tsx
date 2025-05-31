import { useState, useEffect } from "react";
import SubscriptionList from "./components/SubscriptionList";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionFilters from "./components/SubscriptionFilters";
import InfoModal from "./components/InfoModal";
import Modal from "./components/Modal";
import api from "./utils/api";
import { Plus, Info } from "lucide-react";
import type { Subscription, CurrentFilter } from "./utils/types";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<CurrentFilter>("all-subscriptions");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
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
  useEffect(() => {
    const query = location.search.replace("?", "").split("&");
    for (const param of query) {
      const value = param.split("=");
      if (
        value[0] === "filter" &&
        (value[1] === "7-days" || value[1] === "30-days")
      ) {
        setActiveFilter(value[1]);
      }
    }
  }, []);

  return (
    <main className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="flex flex-wrap">
        <SubscriptionFilters
          currentFilter={activeFilter}
          setSearchQuery={setSearchQuery}
          setCurrentFilter={(v) => setActiveFilter(v)}
        />

        <div className="border border-white border-solid w-full">
          <div className="mb-2 p-2">
            <div className="space-x-2 mb-2 flex justify-end">
              <button
                onClick={() => {
                  setShowInfo(true);
                }}
                className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
              >
                <Info />
              </button>
              <button
                onClick={() => {
                  setShowForm(true);
                }}
                className="bg-white text-black rounded-lg p-1 font-bold hover:cursor-pointer"
              >
                <Plus />
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
      {showInfo && (
        <Modal onClose={() => setShowInfo(false)}>
          <InfoModal />
        </Modal>
      )}
    </main>
  );
}

export default App;
