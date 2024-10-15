import Calendar from "./components/Calendar";
import ToastBox from "./components/ToastBox";
import CreateModal from "./components/Modals/CreateModal";
import { useState, useEffect } from 'react';
import { ToastBoxType, type BudgetItem } from "./types";
import ItemUtils from "./utils/ItemUtils";
import DateUtils from "./utils/DateUtils";
import Version from "./components/Version";

export default function App() {
  const date = new Date()

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ data, setData ] = useState<BudgetItem[] | null>(null);
  const [ shownMonth, setShownMonth ] = useState<number>(date.getMonth())
  const [ isAtNext, setIsAtNext ] = useState<boolean>(false);
  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ toastBoxContent, setToastBoxContent ] = useState<ToastBoxType>({
    header: undefined,
    headerColor: undefined,
    message: undefined,
    onClose: undefined
  })

  // functions
  const refetchData = () => {
    ItemUtils.fetchAllItems()
    .then((data) => {
      setData(data);
      setLoading(false);
    }).catch((e) => {
      console.error("Failed to fetch data!", e);
      setLoading(false)
    })
  }

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

  // hooks
  useEffect(() => {
    if (!showModal) {
      refetchData()
    }
  }, [showModal])
  useEffect(() => {
    ItemUtils.fetchNotificationSettings()
    .then((data) => {
      if (!data.discord) {
        setToastBoxContent({
          header: "Notifications Disabled",
          headerColor: "red",
          message: "Check if DISCORD_NOTIFICATION_WEBHOOK is set correctly in your Docker configuration.",
          onClose: () => setToastBoxContent({})
        })
      }
    })
    .catch((e) => {
      console.error(e);
    })
  }, [])

  // components
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
          <Calendar refetchData={refetchData} month={shownMonth} items={data} />
        ) : (
          <LoadingMessage />
        )
      }

      <div className="absolute bottom-0 right-0 left-0 text-white text-center mb-4">
        <Version />
      </div>

      <CreateModal setShowModal={setShowModal} showModal={showModal} />
      <ToastBox {...toastBoxContent} />
    </div>
  )
}