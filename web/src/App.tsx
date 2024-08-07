import ListItem from "./components/ListItem";
import Modal from './components/Modal';
import InputBox from "./components/InputBox";
import Calendar from 'react-calendar';
import moment from 'moment';
import { useState, useEffect } from 'react';
import type { BudgetItem } from "./types";

export default function App() {
  const [ data, setData ] = useState<BudgetItem[] | null>(null);
  const [ createData, setCreateData ] = useState<BudgetItem>({
    name: "",
    description: "",
    billingMethod: "",
    id: 0,
    lastBillingDate: new Date(),
    nextBillingDate: new Date(),
    price: "",
    billingFrequency: "monthly"
  })
  const [ error, setError ] = useState<string>("");
  const [ showModal, setShowModal ] = useState<boolean>(false);

  const getTimePeriodDueIn = (nextBillingDate: Date) => {
    // create moment date objects
    const currentMoment = moment(new Date());
    const nextMoment = moment(nextBillingDate);

    // get diffs for days & weeks
    const differenceInDays = nextMoment.diff(currentMoment, 'days');
    const differenceInWeeks = nextMoment.diff(currentMoment, 'weeks');

    // return days value if it's <~1mo
    if (differenceInDays <= 30) {
      return differenceInDays === 1 ? `${differenceInDays} day` : `${differenceInDays} days`
    } else {
      return differenceInWeeks === 1 ? `${differenceInWeeks} week` : `${differenceInWeeks} weeks`
    }
  };

  const submitDeleteToApi = (id: number) => {
    fetch(import.meta.env.VITE_API_URL + "items/" + id, {
      method: "delete"
    })
    .then((res) => {
      if (res.ok) {
        fetchAllItems()
      } else {
        setError("Failed to fetch! Status: " + res.status)
      }
    })
    .catch((e) => {
      setError(e.message);
    })
  }
  const submitDataToApi = () => {
    const data = {
      name: createData.name,
      description: createData.description,
      price: createData.price,
      lastBillingDate: createData.lastBillingDate,
      nextBillingDate: createData.nextBillingDate,
      billingMethod: createData.billingMethod,
      billingFrequency: createData.billingFrequency
    }

    fetch(import.meta.env.VITE_API_URL + "items", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then((res) => {
      if (res.ok) {
        setShowModal(false);
        fetchAllItems()
      } else {
        setError("Failed to create! Status code: " + res.status);
      }
    })
    .catch((e) => {
      setError(e.message)
    })
  };
  const fetchAllItems = () => {
    fetch(import.meta.env.VITE_API_URL + "items", {
      method: 'get'
    })
    .then(async (res) => {
      if (res.ok) {
        const apiData = await res.json();
        setData(apiData.subscription);
      } else {
        setError("Failed to fetch! Status code: " + res.status)
      }
    })
    .catch((e) => {
      setError(e.message);
    })
  }

  useEffect(() => {
    fetchAllItems();
  }, [])
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }, [error])
  useEffect(() => {
    console.log(createData)
  }, [createData])

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <div className="text-center">
          <h1 className="font-bold text-2xl">Subscriptions</h1>
          <p onClick={() => setShowModal(true)} className="select-none hover:underline hover:cursor-pointer hover:opacity-40">Create</p>
          <hr className="my-2 border-black" />
        </div>

        <div className="overflow-y-scroll no-scrollbar max-h-96">
          {
            (data && data.length > 0) ? (
              <>
                {
                  data.map((v,k) => {
                    return <ListItem 
                      key={k}
                      id={v.id}
                      name={v.name}
                      price={v.price}
                      timePeriodDueIn={getTimePeriodDueIn(v.nextBillingDate)}
                      onDeleteItem={submitDeleteToApi}
                    />
                  })
                }
              </>
            ) : (
              <div className="text-center">
                <h1 className="font-bold text-2xl text-red-500">Oops..</h1>
                <p>There's no data here :(</p>
              </div>
            )
          }
        </div>
      </div>

      <Modal showModal={showModal} setShowModal={setShowModal}>
          <h1 className="text-2xl font-bold mb-2 text-center">Create</h1>

          <div className="space-y-2 text-center">
            <InputBox 
              name="name"
              placeholder="Name.."
              onChange={(value) => {
                setCreateData((prevState) => {
                  return {
                    ...prevState,
                    name: value
                  }
                })
              }}
            />
            <InputBox 
              name="description"
              placeholder="Description.."
              onChange={(value) => {
                setCreateData((prevState) => {
                  return {
                    ...prevState,
                    description: value
                  }
                })
              }}
            />
            <InputBox 
              name="price"
              placeholder="Price.."
              onChange={(value) => {
                setCreateData((prevState) => {
                  return {
                    ...prevState,
                    price: value
                  }
                })
              }}
            />
            <InputBox 
              name="billingMethod"
              placeholder="Billing method.."
              onChange={(value) => {
                setCreateData((prevState) => {
                  return {
                    ...prevState,
                    billingMethod: value
                  }
                })
              }}
            />
            <InputBox 
              name="billingFrequency"
              placeholder="Billing frequency.."
              isOption={true}
              options={[
                "Monthly",
                "Yearly"
              ]}
              onChange={(value) => {
                setCreateData((prevState) => {
                  return {
                    ...prevState,
                    billingFrequency: value.toLowerCase() as "yearly" | "monthly"
                  }
                })
              }}
            />

            <Calendar onChange={(v) => {
              setCreateData((prevState) => {
                return {
                  ...prevState,
                  nextBillingDate: new Date(v?.toString() as string)
                }
              })
            }} />

            <div className="block text-center">
              <button onClick={submitDataToApi} type="button" className="bg-black text-white font-bold p-2 rounded-lg">Submit</button>
            </div>
            <p className="italic text-red-500">{error}</p>
          </div>
      </Modal>
    </div>
  )
}