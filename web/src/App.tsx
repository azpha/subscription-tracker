import Calendar from "./components/Calendar";
import { useState, useEffect } from 'react';
import type { BudgetItem } from "./types";
import ItemUtils from "./utils/ItemUtils";
import DateUtils from "./utils/DateUtils";
import CreateModal from "./components/Modals/CreateModal";

export default function App() {
  const [ data, setData ] = useState<BudgetItem[] | null>(null);
  const [ shownMonth, setShownMonth ] = useState<number>(new Date().getMonth());
  const [ showModal, setShowModal ] = useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      ItemUtils.fetchAllItems()
      .then((data) => {
        setData(data);
      }).catch((e) => {
        console.error("Failed to fetch data!", e);
      })
    }
  }, [showModal])
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="flex min-h-screen justify-center items-center">
      {
        data && data.length > 0 ? (
          <div className="flex flex-col min-h-screen justify-center items-start">

            <div className="mb-4 select-none">
              <h1 className="text-white text-4xl"> 
                <span className="font-semibold">{DateUtils.months[shownMonth]} </span>
                <span className="opacity-50">{new Date().getFullYear()}</span>
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
                      if (prevState < 11) return prevState + 1;
                      else return 0;
                    })
                  }} 
                  className="text-white mt-2 max-w-fit hover:underline hover:cursor-pointer inline"
                >
                  Next
                </h1>
              </div>
            </div>
            <Calendar month={shownMonth} items={data} />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-bold text-2xl text-red-500">Oops..</h1>
            <p>There's no data here :(</p>
          </div>
        )
      }

      <CreateModal setShowModal={setShowModal} showModal={showModal} />
    </div>
  )
}