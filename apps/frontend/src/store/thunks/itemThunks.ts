import { AppDispatch } from "..";
import { updateItems } from "../reducers/itemSlice";
import api from "../../utils/api";

export const hydrateItems =
  (parameters?: string) => async (dispatch: AppDispatch) => {
    try {
      api.fetchItems(parameters).then((items) => {
        dispatch(updateItems(items));
      });
    } catch (error) {
      console.error("Failed to hydrate!", error);
    }
  };
