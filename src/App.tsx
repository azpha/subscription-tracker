import ItemDisplay from "./components/ItemDisplay";
import ItemModal from "./components/Modals/ItemModal";
import ToastBox from "./components/ToastBox";
import CreateModal from "./components/Modals/CreateModal";
import { useState, useEffect } from 'react';
import { type ToastBoxType, type BudgetItem } from "./types";
import ItemUtils from "./utils/ItemUtils";
import DateUtils from "./utils/DateUtils";
import Version from "./components/Version";
import NextPreviousButtons from "./components/NextPreviousButtons";

interface PageState {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string | null,
  shouldRefetchData: boolean,
  selectedDate?: Date,
  selectedItem?: BudgetItem,
  shouldShowCreateModal: boolean,
  toastData?: ToastBoxType
}

export default function App() {
  const [ data, setData ] = useState<BudgetItem[] | null>(null);
  const [ shownDate, setShownDate ] = useState<Date>(new Date());
  const [ pageState, setPageState ] = useState<PageState>({
    isLoading: true,
    isError: false,
    errorMessage: null,
    shouldRefetchData: true,
    selectedDate: undefined,
    selectedItem: undefined,
    shouldShowCreateModal: false,
    toastData: undefined
  })

  // utilities
  const fetchData = () => {
    ItemUtils.fetchAllItems()
      .then((data) => {
        setData(data);
        if (pageState.isLoading) {
          setPageState((prevState) => {
            return {
              ...prevState,
              isLoading: false,
              shouldRefetchData: false
            }
          })
        }
      })
      .catch((e) => {
        setPageState((prevState) => {
          return {
            ...prevState,
            isError: true,
            errorMessage: e.message
          }
        })
      })
  }
  const incrementDate = () => {
    const currentSetDate = new Date(shownDate);
    currentSetDate.setMonth(currentSetDate.getMonth() + 1);
    setShownDate(currentSetDate)
  }
  const decrementDate = () => {
    const currentSetDate = new Date(shownDate);
    currentSetDate.setMonth(currentSetDate.getMonth() - 1);
    setShownDate(currentSetDate)
  }
  const onSelectSlot = (d: Date) => {
    setPageState((prevState) => {
      return {
        ...prevState,
        selectedDate: d,
        shouldShowCreateModal: true
      }
    })
  }
  const onSelectItem = (item: BudgetItem) => {
    setPageState((prevState) => {
      return {
        ...prevState,
        selectedItem: item
      }
    })
  }
  const onCreateItemWithoutSuppliedDate = () => {
    setPageState((prevState) => {
      return {
        ...prevState,
        shouldShowCreateModal: true
      }
    })
  }
  const closeCreateModal = () => {
    setPageState((prevState) => {
      return {
        ...prevState,
        shouldShowCreateModal: false
      }
    })
  }
  const closeItemModal = () => {
    setPageState((prevState) => {
      return {
        ...prevState,
        selectedItem: undefined
      }
    })
  }
  const closeToastBox = () => {
    setPageState((prevState) => {
      return {
        ...prevState,
        toastData: undefined
      }
    })
  }
  const getNumberOfDaysInMonth = () => {
    const currentDate = new Date();
    const maxDays = DateUtils.getDaysInMonth(currentDate.getFullYear(), shownDate.getMonth() + 1);
    const elements = Array.from({ length: maxDays + 1 }, (_, i) => i);

    // removes 0 from list
    elements.shift();

    // updates state
    return elements
  }

  // hooks
  useEffect(() => {
    fetchData();
  }, [pageState.shouldRefetchData])
  useEffect(() => {
    ItemUtils.fetchNotificationSettings()
    .then((data) => {
      if (!data.discord) {
        console.log("Discord notifications need to be setup!")
        setPageState((prevState) => {
          return {
            ...prevState,
            toastData: {
              header: "Notifications Disabled",
              headerColor: "red",
              message: "Check if DISCORD_NOTIFICATION_WEBHOOK is set correctly! Read the README.",
              onClose: closeToastBox
            }
          }
        })
      }
    })
    .catch((e) => {
      console.error(e);
    })
  }, [])

  // components
  const LoadingMessage = () => {
    return (
      <div className="bg-black bg-opacity-60 absolute w-full h-full flex justify-center items-center text-white select-none">
        <div className="bg-zinc-500 bg-opacity-70 p-2 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-500">Oops..</h1>
          
          {/* different messages per reason */}
          {
            !data ? (
              <p>No data received. Is the database working?</p>
            ) : (data && data.length <= 0) ? (
              <>
                <p>There are no subscriptions saved :(</p>
                <a className="underline" href="#" onClick={onCreateItemWithoutSuppliedDate}>Create one!</a>
              </>
            ) : (
              <h1 className="font-bold text-2xl text-white">Loading..</h1>
            )
          }
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center max-w-fit mx-auto">
      <div className="select-none mb-4 self-start text-white flex items-center gap-4 relative w-full">
        <h1 className="text-4xl space-x-2">
          <span className="font-semibold">
            {DateUtils.months[shownDate.getMonth()]}
          </span>
          <span className="opacity-50">
            {shownDate.getFullYear()}
          </span>
        </h1>

        <div className="absolute right-0">
          <NextPreviousButtons 
            shownDate={shownDate} 
            incrementDate={incrementDate} 
            decrementDate={decrementDate} 
          />
        </div>
      </div>

      {
        !pageState.isLoading && (
          <div className="grid grid-cols-7 gap-1">
            {getNumberOfDaysInMonth().map((v, k) => {
                return <div key={k}>
                    {
                        (v <= 7) && (
                            <div className="mb-2 select-none">
                                <p className="text-white text-center bg-zinc-800 rounded-lg">
                                    {
                                        DateUtils.getDateFromMonth(
                                            new Date().getFullYear(),
                                            shownDate.getMonth(),
                                            v
                                        )
                                    }
                                </p>
                            </div>
                        )
                    }
                    <ItemDisplay onItemSelect={onSelectItem} onSlotSelect={onSelectSlot} refetchData={fetchData} date={shownDate} day={v} items={data!} key={k} />
                </div>
            })}
          </div>
        )
      }

      {
        (!pageState.isLoading && (data && data.length <= 0)) && (
          <LoadingMessage />
        ) 
      }

      <div className="absolute bottom-0 right-0 left-0 text-white text-center mb-4">
        <Version />
      </div>

      {
        pageState.shouldShowCreateModal && (
          <CreateModal refetchData={fetchData} selectedDate={pageState.selectedDate} setShowModal={closeCreateModal} />
        )
      }
      {
        pageState.selectedItem && (
          <ItemModal refetchData={fetchData} item={pageState.selectedItem} setShowModal={closeItemModal} />
        )
      }
      {
        pageState.toastData && (
          <ToastBox {...pageState.toastData} />
        )
      }
    </div>
  )
}