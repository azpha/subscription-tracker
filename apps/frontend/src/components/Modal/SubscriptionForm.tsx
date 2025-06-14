import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { hydrateItems } from "@/store/thunks/itemThunks";
import type { Subscription } from "@/utils/types";
import { Button } from "../ui/button";
import { DialogClose } from "@/components/ui/dialog";

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
    <div className="rounded-lg relative">
      <h1 className="text-2xl font-bold p-2">Create</h1>

      <form onSubmit={handleSubmit} className="p-2">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label>Name</label>
            <Input
              defaultValue={subscription?.name}
              placeholder={"Name"}
              onChange={(v) => {
                handleValueUpdate({ name: v.currentTarget.value });
              }}
            />
          </div>
          <div>
            <label>Price</label>
            <Input
              defaultValue={
                subscription
                  ? Number(subscription?.price).toFixed(2)
                  : undefined
              }
              placeholder={"Price"}
              onChange={(v) => {
                handleValueUpdate({
                  price: `${Number(v.currentTarget.value).toFixed(2)}`,
                });
              }}
            />
          </div>
          <div>
            <label>Payment Method</label>
            <Input
              defaultValue={subscription?.paymentMethod}
              placeholder={"Payment Method"}
              onChange={(v) => {
                handleValueUpdate({ paymentMethod: v.currentTarget.value });
              }}
            />
          </div>
          <div>
            <label>Last Billing Date</label>
            <Input
              defaultValue={
                subscription
                  ? new Date(subscription?.lastBillingDate as string)
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              placeholder={"YYYY-MM-DD"}
              onChange={(v) => {
                handleValueUpdate({
                  lastBillingDate: new Date(
                    new Date(v.currentTarget.value).toLocaleDateString(
                      "en-US",
                      {
                        timeZone: "UTC",
                      }
                    )
                  ), // i hate this so fucking much.
                });
              }}
            />
          </div>
          <div>
            <label>Next Billing Date</label>
            <Input
              defaultValue={
                subscription
                  ? new Date(subscription?.nextBillingDate as string)
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              placeholder={"YYYY-MM-DD"}
              onChange={(v) => {
                handleValueUpdate({
                  nextBillingDate: new Date(
                    new Date(v.currentTarget.value).toLocaleDateString(
                      "en-US",
                      {
                        timeZone: "UTC",
                      }
                    )
                  ), // i hate this so fucking much.
                });
              }}
            />
          </div>
          <div className="flex justify-start">
            <DialogClose className="w-full">
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </DialogClose>
          </div>
        </div>
        <p className="max-w-[200px] pt-2 text-red-200 font-bold">{formError}</p>
      </form>
    </div>
  );
}
