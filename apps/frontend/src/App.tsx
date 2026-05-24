import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import CompactItem from "./components/CompactItem";
import FullItem from "./components/FullItem";
import api from "./utils/api";
import Create from "./components/modals/create";
import Edit from "./components/modals/edit";
import { Metrics, type Category, type Subscription } from "./utils/types";
import CategoryChart from "./components/CategoryChart";
import EmptyState from "./components/EmptyState";

function App() {
  const [items, setItems] = useState<Subscription[] | null>(null);
  const [editingItem, setEditingItem] = useState<Subscription | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // modal states
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const fetchItems = async () => {
    api.fetchItems().then((res) => {
      setItems(res);
    });
  };
  const fetchCategories = async () => {
    api.fetchCategories().then((res) => {
      setCategories(res);
    });
  };
  const fetchMetrics = async () => {
    api.fetchMetrics().then((res) => {
      setMetrics(res);
    });
  };
  const deleteItem = async (id: number) => {
    api.deleteItem(id).then((res) => {
      if (res) fetchItems();
    });
  };
  useEffect(() => {
    if (!editModalOpen && !createModalOpen && items) {
      fetchItems();
      fetchCategories();
      fetchMetrics();
    }
  }, [editModalOpen, createModalOpen]);
  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchMetrics();
  }, []);

  const categorySpending = useMemo(() => {
    if (items) {
      return categories
        .map((cat) => ({
          name: cat.name,
          value: items
            .filter((s) => s.categoryId === cat.id)
            .reduce((sum, s) => sum + Number(s.price), 0),
        }))
        .filter((c) => c.value > 0);
    }
  }, [items, categories]);

  return (
    <div>
      <Create modalState={createModalOpen} setModalState={setCreateModalOpen} />
      {editingItem && (
        <Edit
          modalState={editModalOpen}
          setModalState={setEditModalOpen}
          subscription={editingItem}
        />
      )}
      <div className="bg-black min-h-screen flex justify-center text-white dark">
        <div className="w-full md:max-w-7xl m-10">
          <div className="flex md:flex-row flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tracker</h1>
              <p className="text-sm opacity-50">
                Track your upcoming subscriptions
              </p>
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
          </div>

          <div className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">${metrics?.totalSpendPerMonth}</p>
                  <p className="text-xs text-muted-foreground">
                    Across {items?.length} subscriptions
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Yearly Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">${metrics?.totalSpendPerYear}</p>
                  <p className="text-xs text-muted-foreground">
                    Across {items?.length} subscriptions
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">{items?.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Across {categories.length} categories
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Next Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics && metrics.expiringNext ? (
                    <>
                      <p className="text-xl">{metrics?.expiringNext?.name}</p>
                      <p className="xs text-muted-foreground">
                        ${metrics?.expiringNext?.price} -{" "}
                        {metrics?.expiringNext &&
                          new Date(
                            metrics?.expiringNext.billingDate,
                          ).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <EmptyState />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 my-8">
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Test</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Spending By Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {categorySpending && categorySpending.length > 0 ? (
                    <CategoryChart categorySpending={categorySpending} />
                  ) : (
                    <EmptyState />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="my-4 space-y-8">
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>All Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items && items.length > 0 ? (
                      items?.map((v, k) => {
                        return (
                          <FullItem
                            categories={categories}
                            deleteItem={deleteItem}
                            onEditClick={(v) => {
                              setEditingItem(v);
                              setEditModalOpen(true);
                            }}
                            subscription={v}
                            key={k}
                          />
                        );
                      })
                    ) : (
                      <EmptyState />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-500">
                <CardHeader>
                  <CardTitle>Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics && metrics.expiringSoon.length > 0 ? (
                      metrics?.expiringSoon?.map((v, k) => {
                        return <CompactItem subscription={v} key={k} />;
                      })
                    ) : (
                      <EmptyState />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
