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
const pushItemToNextMonthViaApi = async (id: number) => {
    return await fetch("/api/items/" + id + "/pushToNext", {
        method: "PATCH"
    })
    .then(async (res) => {
        if (res.ok) {
            return true
        } else {
            throw new Error("Failed to push subscription to next month: " + res.status)
        }
    })
}

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
const fetchInstalledAppVersion = async () => {
    return await fetch("/api/settings/version", {
        method: 'get'
    })
    .then(async (res) => {
        if (res.ok) {
            const data = await res.json()
            return data.version
        } else {
            throw new Error("Failed to fetch notifications settings: " + res.status);
        }
    })
}

// external
const fetchLatestAppVersion = async () => {
    return await fetch("https://api.github.com/repos/azpha/subscription-tracker/releases/latest", {
        method: 'get'
    })
    .then(async (res) => {
        if (res.ok) {
            const data = await res.json();
            return data.tag_name
        } else {
            throw new Error("Failed to fetch latest app vers from GitHub: " + res.status);
        }
    })
}

export default {
    // items
    submitDeleteToApi,
    fetchAllItems,
    submitDataToApi,
    pushItemToNextMonthViaApi,

    // settings
    fetchNotificationSettings,
    fetchInstalledAppVersion,

    // external
    fetchLatestAppVersion
}