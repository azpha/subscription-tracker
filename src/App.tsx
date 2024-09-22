import Calendar from "./components/Calendar";
import { useState, useEffect } from 'react';
import type { BudgetItem } from "./types";
import ItemUtils from "./utils/ItemUtils";
import DateUtils from "./utils/DateUtils";
import CreateModal from "./components/Modals/CreateModal";

export default function App() {
  const date = new Date()

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ data, setData ] = useState<BudgetItem[] | null>(null);
  const [ shownMonth, setShownMonth ] = useState<number>(date.getMonth())
  const [ didGoToNext, setDidGoToNext ] = useState<boolean>(true);
  const [ showModal, setShowModal ] = useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      ItemUtils.fetchAllItems()
      .then((data) => {
        setData(data);
        setLoading(false);
      }).catch((e) => {
        console.error("Failed to fetch data!", e);
        setLoading(false)
      })
    }
  }, [showModal])
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="flex min-h-screen justify-center items-center">
      {
        ((data && data.length > 0) && !loading) ? (
          <div className="flex flex-col min-h-screen justify-center items-start">

            <div className="mb-4 select-none">
              <h1 className="text-white text-4xl"> 
                <span className="font-semibold">
                  {DateUtils.months[shownMonth]}
                </span>
                <span className="opacity-50"> {date.getFullYear()}</span>
              </h1>
              <div className="space-x-2">
                <h1 
                  onClick={() => setShowModal(true)} 
                  className="text-white mt-2 max-w-fit hover:underline hover:cursor-pointer inline"
                >
                  Create
                </h1>
                <h1 
                  onClick={() => {
                    setShownMonth((prevState) => {
                      if (!didGoToNext) {
                        setDidGoToNext(true);
                        return prevState - 1
                      } else {
                        setDidGoToNext(false);
                        return prevState + 1
                      }
                    })
                  }} 
                  className="text-white mt-2 max-w-fit hover:underline hover:cursor-pointer inline"
                >
                  { !didGoToNext ? "Previous" : "Next" }
                </h1>
              </div>
            </div>
            <Calendar month={shownMonth} items={data} />
          </div>
        ) : (
          <div className="text-center text-white">
            {
              loading ? (
                <>
                  <h1 className="font-bold text-2xl text-white">Loading..</h1>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-2xl text-red-500">Oops..</h1>
                  <p className="text-white">There's no data here :(</p>
                </>
              )
            }
          </div>
        )
      }

      <CreateModal setShowModal={setShowModal} showModal={showModal} />
    </div>
  )
}