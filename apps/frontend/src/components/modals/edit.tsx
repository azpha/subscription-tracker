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
import { Category, type Subscription } from "@/utils/types";
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

interface EditModalProps {
  subscription: Subscription;
  modalState: boolean;
  setModalState: (v: boolean) => void;
}
export default function Edit({
  subscription,
  modalState,
  setModalState,
}: EditModalProps) {
  const { register, control, handleSubmit, reset } = useForm<Subscription>({
    defaultValues: {
      ...subscription,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [creatingNewCategory, setCreatingNewCategory] =
    useState<boolean>(false);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);
  useEffect(() => {
    api.fetchCategories().then((res) => {
      setCategories(res);
    });
  }, []);
  useEffect(() => {
    reset({
      ...subscription,
      image: "",
    });
  }, [subscription]);

  const onSubmit: SubmitHandler<Subscription> = async (data) => {
    console.log(data);

    // upload image
    let body = {
      ...data,
      totalSpend: subscription.totalSpend,
    };

    if (data.image && data.image != "") {
      const formData = new FormData();
      formData.append("content", data.image[0]);
      const iconId = await api.uploadIcon(formData);
      body.image = iconId;
    } else {
      body.image = subscription.image;
    }
    if (body.categoryName) {
      const categoryId = await api.createCategory(body.categoryName);
      body.categoryId = categoryId;

      delete body.categoryName;
    }

    const result = await api.updateItem(subscription.id, body);
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
          <DialogTitle>Edit {subscription.name}</DialogTitle>
          <DialogDescription>Edit your existing subscription</DialogDescription>
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
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
