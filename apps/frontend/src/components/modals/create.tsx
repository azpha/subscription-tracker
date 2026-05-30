import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import type { Category, Subscription } from "@/utils/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import api from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

interface createModalProps {
  modalState: boolean;
  setModalState: (v: boolean) => void;
}
export default function Create({
  modalState,
  setModalState,
}: createModalProps) {
  const { register, control, handleSubmit, reset } = useForm<Subscription>({
    defaultValues: {
      shouldNotifyExpiry: false,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [creatingNewCategory, setCreatingNewCategory] =
    useState<boolean>(false);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    api.fetchCategories().then((res) => {
      setCategories(res);
    });
  }, []);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const onSubmit: SubmitHandler<Subscription> = async (data) => {
    console.log(data);

    // upload image
    const formData = new FormData();
    formData.append("content", data.image[0]);
    const iconId = await api.uploadIcon(formData);

    const body = {
      ...data,
      image: iconId,
    };

    if (body.categoryName) {
      const categoryId = await api.createCategory(body.categoryName);
      body.categoryId = categoryId;

      delete body.categoryName;
    }

    const result = await api.createItem(body);
    if (result) {
      reset();
      setCreatingNewCategory(false);
      setModalState(false);
    }
  };

  const modalStateChange = () => {
    reset();
    setCreatingNewCategory(false);
    setModalState(false);
  };

  return (
    <Dialog open={modalState} onOpenChange={modalStateChange}>
      <DialogContent className="dark">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Add a new subscription to track</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Field>
              <FieldLabel>Service Name</FieldLabel>
              <Input required {...register("name")} />
            </Field>
            <div className="flex flex-row gap-2">
              <Field>
                <FieldLabel>Price</FieldLabel>
                <Input required {...register("price")} />
              </Field>
              <Field>
                <FieldLabel>Billing Date</FieldLabel>
                <Input
                  required
                  {...register("billingDate")}
                  placeholder="MM-DD-YYYY"
                />
              </Field>
            </div>
            <div className="flex flex-row gap-2">
              <Field>
                <FieldLabel>Method</FieldLabel>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => {
                    return (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Icon</FieldLabel>
                <Input
                  {...register("image")}
                  required
                  accept="image/png, image/jpeg"
                  type="file"
                />
              </Field>
            </div>
            <div className="flex flex-row gap-2">
              {creatingNewCategory ? (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Input {...register("categoryName")} />
                </Field>
              ) : (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={`${field.value}`}
                          onValueChange={(v) => {
                            console.log(v);
                            if (v === "create") {
                              setCreatingNewCategory(true);
                            } else {
                              field.onChange(v);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="create">Create New</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              {categories?.map((v, k) => {
                                return (
                                  <SelectItem key={k} value={`${v.id}`}>
                                    {v.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </Field>
              )}
              <Field>
                <FieldLabel>Notify</FieldLabel>
                <Controller
                  control={control}
                  name="shouldNotifyExpiry"
                  render={({ field }) => {
                    return (
                      <Checkbox
                        onCheckedChange={field.onChange}
                        defaultChecked={true}
                      />
                    );
                  }}
                />
              </Field>
            </div>
          </div>

          <div className="mt-4">
            <Button>Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
