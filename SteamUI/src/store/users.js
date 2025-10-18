// sabitwrld/steamui/SteamUI-e7ce9c382fc46f096255c58814740b9040d379dc/SteamUI/src/store/users.js

import csrfFetch from "./csrf";
import { ADD_REVIEW, SET_REVIEWS } from "./reviews";

const SET_USER = "users/SET_USER";

const setUser = (user) => { 
  return {
    type: SET_USER,
    payload: user
  };
}

// ** DƏYİŞİKLİK: `/api/users/nil?` -> `/api/users?` olaraq dəyişdirilir **
export const fetchUser = (userParam) => async (dispatch) => {
  let res;
  if (typeof userParam === 'number') {
    res = await csrfFetch('/api/users?user_id=' + userParam);
  } else {
    res = await csrfFetch('/api/users?username=' + userParam)
  }
  const userData = await res.json();
  dispatch(setUser(userData));
  return userData;
}

export default function usersReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      const user = action.payload;
      return {[user.id]: user};
    case SET_REVIEWS:
      return action.payload.users;
    case ADD_REVIEW:
      return {...state, ...action.payload.user}
    default:
      return state;
  }
}