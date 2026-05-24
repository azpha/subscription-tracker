import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import CompactItem from "./components/CompactItem";
import FullItem from "./components/FullItem";

function App() {
  return (
    <div className="bg-black min-h-screen flex justify-center text-white dark">
      <div className="w-full md:max-w-7xl m-10">
        <div className="flex md:flex-row flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tracker</h1>
            <p className="text-sm opacity-50">
              Track your upcoming subscriptions
            </p>
          </div>
          <div className="flex items-center my-2 md:my-0">
            <button
              onClick={() => console.log("test")}
              type="button"
              className={`bg-white text-black p-2 rounded-lg font-semibold w-full`}
            >
              Add subscription
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>Monthly Spending</CardTitle>
              </CardHeader>
              <CardContent>Test</CardContent>
            </Card>
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>Yearly Spending</CardTitle>
              </CardHeader>
              <CardContent>Test</CardContent>
            </Card>
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>Test</CardContent>
            </Card>
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>Next Payment</CardTitle>
              </CardHeader>
              <CardContent>Test</CardContent>
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
                <p>Test</p>
              </CardContent>
            </Card>
          </div>

          <div className="my-4 space-y-8">
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>All Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <FullItem />
              </CardContent>
            </Card>
            <Card className="border border-gray-500">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <CompactItem />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
