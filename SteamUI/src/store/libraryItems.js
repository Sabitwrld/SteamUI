// sabitwrld/steamui/SteamUI-e7ce9c382fc46f096255c58814740b9040d379dc/SteamUI/src/store/libraryItems.js

import csrfFetch from "./csrf";
import { REMOVE_SESSION_USER } from "./session";

export const SET_LIBRARY_ITEMS = "libraryItems/SET_LIBRARY_ITEMS";
export const SET_OTHER_LIBRARY = "libraryItems/SET_OTHER_LIBRARY";
const ADD_LIBRARY_ITEM = "libraryItems/ADD_LIBRARY_ITEM";

const setLibraryItems = (payload, visiting) => {
  const type = visiting ? SET_OTHER_LIBRARY : SET_LIBRARY_ITEMS;
  return {
    type,
    payload
  };
};

const addLibraryItem = (libraryItem) => {
  return {
    type: ADD_LIBRARY_ITEM,
    payload: libraryItem
  };
};

// ** DƏYİŞİKLİK 1: Endpoint `/api/library_items/?user_id={userId}` -> `/api/UserLibrary/{userId}` **
export const fetchLibraryItems = (userId, visiting = false) => async (dispatch) => {
  const res = await csrfFetch(`/api/UserLibrary/${userId}`);
  const data = await res.json();
  dispatch(setLibraryItems(data, visiting));
};

// ** DƏYİŞİKLİK 2: Endpoint `/api/library_items` -> `/api/UserLibrary` **
export const createLibraryItem = (libraryItem) => async (dispatch) => {
  const res = await csrfFetch('/api/UserLibrary', {
    method: "POST",
    body: JSON.stringify(libraryItem)
  });
  const data = await res.json();
  dispatch(addLibraryItem(data));
};

const initialState = { currentUser: {}, otherUser: {} };
export default function libraryItemsReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case SET_LIBRARY_ITEMS:
      newState.currentUser = action.payload.libraryItems;
      return newState;
    case SET_OTHER_LIBRARY:
      newState.otherUser = action.payload.libraryItems;
      return newState;
    case ADD_LIBRARY_ITEM:
      const libraryItem = action.payload;
      newState.currentUser = { ...newState.currentUser, ...libraryItem };
      return newState;
    case REMOVE_SESSION_USER: // when user logs out
      newState.currentUser = {};
      return newState;
    default:
      return state;
  }
}