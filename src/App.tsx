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
  const [ isAtNext, setIsAtNext ] = useState<boolean>(false);
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

  const incrementMonth = () => {
    setShownMonth((prevState) => {
      if (!isAtNext) {
        setIsAtNext(true);
        return prevState + 1;
      } else {
        setIsAtNext(false);
        return prevState - 1;
      }
    })
  }

  const LoadingMessage = () => {
    if (!loading) {
      if (!data) {
        return (
          <>
            <h1 className="font-bold text-2xl text-red-500">Oops..</h1>
            <p className="text-white">No data received. Is the database working?</p>
          </>
        )
      } else if (data && data.length <= 0) {
        return (
          <>
            <h1 className="font-bold text-2xl text-red-500">Oops..</h1>
            <p className="text-white">There are no subscriptions saved :(</p>
          </>
        )
      }
    } else {
      return <h1 className="font-bold text-2xl text-white">Loading..</h1>
    }
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center max-w-fit mx-auto">
      <div className="select-none mb-4 self-start text-white">
        <h1 className="text-4xl space-x-2">
          <span className="font-semibold">
            {DateUtils.months[shownMonth]}
          </span>
          <span className="opacity-50">
             {date.getFullYear()}
          </span>
        </h1>

        <div className="space-x-2">
          <p className="inline hover:underline hover:cursor-pointer" onClick={() => setShowModal(true)}>Create</p>
          <p className="inline hover:underline hover:cursor-pointer" onClick={incrementMonth}>
            { !isAtNext ? "Next" : "Previous" }
          </p>
        </div>
      </div>

      {
        ((data && data.length > 0) && !loading) ? (
          <Calendar month={shownMonth} items={data} />
        ) : (
          <LoadingMessage />
        )
      }

      <CreateModal setShowModal={setShowModal} showModal={showModal} />
    </div>
  )
}