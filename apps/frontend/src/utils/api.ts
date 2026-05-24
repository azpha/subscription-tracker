import { Category, Metrics, Subscription } from "./types";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || `${location.protocol}//${location.host}/api`;

async function fetchItems(params?: string): Promise<Subscription[]> {
  const path = params ? `/items?${params}` : "/items";

  return fetch(BASE_URL + path).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.data as Subscription[];
    } else throw new Error("Invalid response from API");
  });
}

async function fetchCategories(): Promise<Category[]> {
  return fetch(BASE_URL + "/categories").then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data as Category[];
    } else throw new Error("Invalid response from API");
  });
}

async function createItem(subscription: Subscription): Promise<boolean> {
  return fetch(BASE_URL + "/items", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(subscription),
  })
    .then(async (res) => {
      return res.ok;
    })
    .catch((err) => {
      console.error("Failed to upload image!", err);
      return false;
    });
}

async function createCategory(name: string): Promise<number> {
  return fetch(BASE_URL + "/categories", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      return data.id;
    })
    .catch((e) => {
      console.error("Failed to create category!", e);
      return false;
    });
}

async function updateItem(
  id: number,
  subscription: Subscription,
): Promise<boolean> {
  return fetch(BASE_URL + "/items/" + id, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(subscription),
  })
    .then(async (res) => {
      return res.ok;
    })
    .catch(async (e) => {
      console.error("Failed to update item", e);
      return false;
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

async function fetchVersion(): Promise<string> {
  return fetch(BASE_URL + "/settings/version", {
    method: "GET",
  }).then(async (res) => {
    if (res.ok) {
      const body = await res.json();
      return body.version;
    } else throw new Error("Failed to fetch version");
  });
}

async function fetchMetrics(): Promise<Metrics> {
  return fetch(BASE_URL + "/metrics", {
    method: "GET",
  }).then(async (res) => {
    if (res.ok) {
      const body = await res.json();
      return body;
    } else throw new Error("Failed to fetch version");
  });
}

async function testDiscordWebhook(): Promise<boolean> {
  return fetch(BASE_URL + "/settings/notifications/test/discord", {
    method: "post",
  }).then((res) => res.ok);
}

async function testNtfyPush(): Promise<boolean> {
  return fetch(BASE_URL + "/settings/notifications/test/ntfy", {
    method: "post",
  }).then((res) => res.ok);
}

async function uploadIcon(formData: FormData): Promise<string> {
  return fetch(BASE_URL + "/items/icon", {
    method: "post",
    body: formData,
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        return data.name;
      } else throw new Error("Failed to upload image!");
    })
    .catch((e) => {
      console.error("Failed to upload image!", e);
      return "";
    });
}

export default {
  fetchItems,
  fetchCategories,
  createItem,
  createCategory,
  updateItem,
  deleteItem,
  fetchVersion,
  testDiscordWebhook,
  testNtfyPush,
  uploadIcon,
  fetchMetrics,
};
