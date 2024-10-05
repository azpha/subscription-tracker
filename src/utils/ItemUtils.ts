import type { BudgetItem } from "../types";

const fetchAllItems = async () => {
    return fetch("/api/items", {
        method: 'get'
    })
    .then(async (res) => {
        if (res.ok) {
            const apiData = await res.json();
            return apiData.subscription;
        } else {
            throw new Error("Failed to fetch item data: " + res.status);
        }
    })
}
const submitDeleteToApi = async (id: number) => {
    return await fetch("/api/items/" + id, {
        method: "delete"
    })
    .then((res) => {
        if (res.ok) {
            return true;
        } else {
            throw new Error("Failed to submit deletion: " + res.status);
        }
    })
}
const submitDataToApi = async (data: BudgetItem) => {
    return await fetch("/api/items", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.ok) {
            return true
        } else {
            throw new Error("Failed to submit item data: " + res.status);
        }
    })
};

// settings
const fetchNotificationSettings = async () => {
    return await fetch("/api/settings/notifications", {
        method: 'get'
    })
    .then(async (res) => {
        if (res.ok) {
            const data = await res.json()
            return data.notifications
        } else {
            throw new Error("Failed to fetch notifications settings: " + res.status);
        }
    })
}

export default {
    // items
    submitDeleteToApi,
    fetchAllItems,
    submitDataToApi,

    // settings
    fetchNotificationSettings
}