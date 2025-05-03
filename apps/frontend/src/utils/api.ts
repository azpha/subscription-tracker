import { Subscription, Response } from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function fetchItems(): Promise<Subscription[]> {
  return fetch(BASE_URL + "/items").then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.data as Subscription[];
    } else throw new Error("Invalid response from API");
  });
}

async function createItem(subscription: Subscription): Promise<Response> {
  return fetch(BASE_URL + "/items", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(subscription),
  })
    .then(async (res) => {
      const body = await res.json();
      return {
        status: res.ok,
        error: !res.ok && (body.issues[0].message || body.message),
      };
    })
    .catch((err) => {
      return {
        status: false,
        error: err,
      };
    });
}

async function updateItem(subscription: Subscription): Promise<Response> {
  const { id, ...deconstructedSubscription } = subscription;
  return fetch(BASE_URL + "/items/" + id, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(deconstructedSubscription),
  })
    .then(async (res) => {
      const body = await res.json();

      return {
        status: res.ok,
        error: !res.ok && (body.issues[0].message || body.message),
      };
    })
    .catch((e) => {
      console.error("Failed to update item", e);
      return {
        status: false,
        error: e,
      };
    });
}

async function deleteItem(id: number): Promise<boolean> {
  return fetch(BASE_URL + "/items/" + id, {
    method: "DELETE",
  })
    .then((res) => {
      return res.ok;
    })
    .catch((e) => {
      console.error("Failed to delete item", e);
      return false;
    });
}

export default {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
};
