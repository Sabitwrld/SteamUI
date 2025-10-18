// sabitwrld/steamui/SteamUI-e7ce9c382fc46f096255c58814740b9040d379dc/SteamUI/src/store/session.js

import csrfFetch from "./csrf"

const SET_SESSION_USER = "session/SET_SESSION_USER"
export const REMOVE_SESSION_USER = "session/REMOVE_SESSION_USER"

const setSessionUser = (user) => {
  return {
    type: SET_SESSION_USER,
    payload: user
  };
};

const removeSessionUser = () => {
  return {
    type: REMOVE_SESSION_USER
  };
};

const storeCSRFToken = (res) => {
  const token = res.headers.get('X-CSRF-Token');
  if (token) sessionStorage.setItem('X-CSRF-Token', token);
}

const storeCurrentUser = (user) => {
  if (user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('currentUser');
  }
};

// ** DƏYİŞİKLİK 1: Endpoint `/api/session` -> `/api/auth/login` olaraq dəyişdirilir **
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ credential, password })
  });
  const userData = await res.json();
  storeCurrentUser(userData);
  dispatch(setSessionUser(userData));
};

// ** DƏYİŞİKLİK 2: Endpoint `/api/users` -> `/api/auth/register` olaraq dəyişdirilir **
export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const res = await csrfFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  const userData = await res.json();
  storeCurrentUser(userData);
  dispatch(setSessionUser(userData));
}

// ** DƏYİŞİKLİK 3: `logout` funksiyası eyni saxlanılır, çünki backend `/api/session` (DELETE) route-nu dəstəkləyir **
export const logout = () => async (dispatch) => {
  await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  storeCurrentUser(null);
  dispatch(removeSessionUser());
}

// ** DƏYİŞİKLİK 4: Endpoint `/api/session` -> `/api/auth/me` olaraq dəyişdirilir **
export const restoreSession = () => async (dispatch) => {
  const res = await csrfFetch('/api/auth/me');

  storeCSRFToken(res);
  const userData = await res.json();
  storeCurrentUser(userData);
  dispatch(setSessionUser(userData));
};

const initialState = { user: JSON.parse(sessionStorage.getItem('currentUser')) };

export default function sessionReducer(state = initialState, action) {
  const newState = {...state};
  switch (action.type) {
    case SET_SESSION_USER:
      newState.user = action.payload;
      return newState;
    case REMOVE_SESSION_USER:
      return {
        user: null
      };
    default:
      return state;
  }
}