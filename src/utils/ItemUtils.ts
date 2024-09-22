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
            return false
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
            return false;
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
            return false
        }
    })
};

export default {
    // items
    submitDeleteToApi,
    fetchAllItems,
    submitDataToApi,
}