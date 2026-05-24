import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import CompactItem from "./components/CompactItem";
import FullItem from "./components/FullItem";
import Create from "./components/modals/create";
import Edit from "./components/modals/edit";
import EmptyState from "./components/EmptyState";
import TopRow from "./components/rows/TopRow";
import ChartRow from "./components/rows/ChartRow";
import Header from "./components/Header";
import api from "./utils/api";
import { type Metrics, type Category, type Subscription } from "./utils/types";

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
            <Header setCreateModalOpen={setCreateModalOpen} />
          </div>

          <div className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TopRow items={items} categories={categories} metrics={metrics} />
            </div>

            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 my-8">
              <ChartRow categorySpending={categorySpending} />
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
