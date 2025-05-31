import React, { useState, useEffect } from "react";
import StyledInput from "../StyledInput";
import type { Subscription } from "../../utils/types";
import api from "../../utils/api";
import { useAppDispatch } from "../../store/hooks";
import { hydrateItems } from "../../store/thunks/itemThunks";
import { closeActiveModal } from "../../store/reducers/modalSlice";

export default function SubscriptionForm({
  subscription,
}: {
  subscription?: Subscription | null;
}) {
  const dispatch = useAppDispatch();
  const [configuredSubscription, setConfiguredSubscription] =
    useState<Subscription | null>(null);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let failed = false;

    // submit & reset
    if (!configuredSubscription) {
      setFormError("You need to define values before submitting the form!");
      failed = true;
    } else {
      if (subscription) {
        await api.updateItem({
          ...configuredSubscription,
          id: subscription.id,
        });
      } else {
        const { status, error } = await api.createItem(configuredSubscription);
        if (!status && error) {
          failed = true;
          console.error(error);
          setFormError(error);
        }
      }
    }

    if (!failed) {
      dispatch(hydrateItems());
      dispatch(closeActiveModal());
      setConfiguredSubscription(null);
    }
  };

  const handleValueUpdate = (data: object) => {
    if (!configuredSubscription) {
      setConfiguredSubscription({
        ...data,
      } as Subscription);
    } else {
      setConfiguredSubscription((prevState) => {
        return {
          ...prevState,
          ...(data as Subscription),
        };
      });
    }
  };

  useEffect(() => {
    if (formError) {
      setTimeout(() => {
        setFormError("");
      }, 5000);
    }
  }, [formError]);

  return (
    <div className="border border-solid border-white rounded-lg p-4 bg-zinc-800 relative">
      <h1 className="text-2xl font-bold p-2">Create</h1>

      <form onSubmit={handleSubmit} className="p-2">
        <div className="grid grid-cols-1 gap-2 w-fit">
          <div>
            <label>Name</label>
            <StyledInput
              defaultValue={subscription?.name}
              placeholder={"Name"}
              onChange={(v: string) => {
                handleValueUpdate({ name: v });
              }}
            />
          </div>
          <div>
            <label>Price</label>
            <StyledInput
              defaultValue={
                subscription
                  ? Number(subscription?.price).toFixed(2)
                  : undefined
              }
              placeholder={"Price"}
              onChange={(v: string) => {
                handleValueUpdate({ price: `${Number(v).toFixed(2)}` });
              }}
            />
          </div>
          <div>
            <label>Payment Method</label>
            <StyledInput
              defaultValue={subscription?.paymentMethod}
              placeholder={"Payment Method"}
              onChange={(v: string) => {
                handleValueUpdate({ paymentMethod: v });
              }}
            />
          </div>
          <div>
            <label>Last Billing Date</label>
            <StyledInput
              defaultValue={
                subscription
                  ? new Date(subscription?.lastBillingDate as string)
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              placeholder={"YYYY-MM-DD"}
              onChange={(v: string) => {
                handleValueUpdate({
                  lastBillingDate: new Date(
                    new Date(v).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })
                  ), // i hate this so fucking much.
                });
              }}
            />
          </div>
          <div>
            <label>Next Billing Date</label>
            <StyledInput
              defaultValue={
                subscription
                  ? new Date(subscription?.nextBillingDate as string)
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              placeholder={"YYYY-MM-DD"}
              onChange={(v: string) => {
                handleValueUpdate({
                  nextBillingDate: new Date(
                    new Date(v).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })
                  ), // i hate this so fucking much.
                });
              }}
            />
          </div>
          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-white rounded-lg p-2 text-black hover:cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
        <p className="max-w-[200px] pt-2 text-red-200 font-bold">{formError}</p>
      </form>
    </div>
  );
}
