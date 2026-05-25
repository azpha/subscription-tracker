import {
  Category,
  Metrics,
  MonthlyReport,
  Settings,
  Subscription,
} from "./types";

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

async function fetchSettings(): Promise<Settings[]> {
  return fetch(BASE_URL + "/settings").then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data as Settings[];
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

async function updateSettings(settings: Settings[]): Promise<boolean> {
  return fetch(BASE_URL + "/settings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(settings),
  })
    .then(async (res) => {
      return res.ok;
    })
    .catch(async (e) => {
      console.error("Failed to update setting", e);
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

async function fetchMonthlyReport(): Promise<MonthlyReport> {
  return fetch(BASE_URL + "/metrics/monthlyReport", {
    method: "GET",
  }).then(async (res) => {
    if (res.ok) {
      const body = await res.json();
      return body;
    } else throw new Error("Failed to fetch version");
  });
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

async function testDiscordWebhook(url: string): Promise<boolean> {
  return fetch(BASE_URL + "/settings/test/discord?webhook=" + url, {
    method: "post",
  })
    .then(async (res) => {
      if (res.ok) {
        return res.ok;
      } else throw new Error("Failed to test Discord webhook!");
    })
    .catch((e) => {
      console.error("Failed to test Discord webhook!", e);
      return false;
    });
}
async function testNtfyWebhook(url: string): Promise<boolean> {
  return fetch(BASE_URL + "/settings/test/ntfy?webhook=" + url, {
    method: "post",
  })
    .then(async (res) => {
      if (res.ok) {
        return res.ok;
      } else throw new Error("Failed to test Ntfy webhook!");
    })
    .catch((e) => {
      console.error("Failed to test Ntfy webhook!", e);
      return false;
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
  testNtfyWebhook,
  uploadIcon,
  fetchMetrics,
  fetchMonthlyReport,
  fetchSettings,
  updateSettings,
};
