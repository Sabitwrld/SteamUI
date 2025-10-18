// sabitwrld/steamui/SteamUI-e7ce9c382fc46f096255c58814740b9040d379dc/SteamUI/src/store/reviews.js

import csrfFetch from "./csrf";

export const SET_REVIEWS = "reviews/SET_REVIEWS";
export const ADD_REVIEW = "reviews/ADD_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";

const setReviews = (payload) => { // and also games
  return {
    type: SET_REVIEWS,
    payload
  };
}

const addReview = (payload) => {
  return {
    type: ADD_REVIEW,
    payload
  };
}

const removeReview = (reviewId) => {
  return {
    type: REMOVE_REVIEW,
    payload: reviewId
  };
}

// ** DƏYİŞİKLİK 1: Endpoint `/api/games/{gameId}/reviews` -> `/api/Review?gameId={gameId}` **
export const fetchReviews = (gameId) => async (dispatch) => {
  const res = await csrfFetch(`/api/Review?gameId=${gameId}`);
  const data = await res.json();
  dispatch(setReviews(data));
}

// ** DƏYİŞİKLİK 2: Endpoint `/api/games/{review.gameId}/reviews` -> `/api/Review` **
export const createReview = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/Review`, {
    method: "POST",
    body: JSON.stringify(review)
  });
  const data = await res.json();
  dispatch(addReview(data));
}

// ** DƏYİŞİKLİK 3: Endpoint `/api/reviews/{review.id}` -> `/api/Review/{review.id}` **
export const updateReview = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/Review/${review.id}`, {
    method: "PUT",
    body: JSON.stringify(review)
  });
  const data = await res.json();
  // if (data.errors) return data.errors;
  dispatch(addReview(data));
}

// ** DƏYİŞİKLİK 4: Endpoint `/api/reviews/{reviewId}` -> `/api/Review/{reviewId}` **
export const deleteReview = (reviewId) => async (dispatch) => {
  await csrfFetch(`/api/Review/${reviewId}`, {
    method: 'DELETE'
  });
  dispatch(removeReview(reviewId));
}

export default function reviewsReducer(state = {}, action) {
  switch (action.type) {
    case SET_REVIEWS:
      return action.payload.reviews;
    case ADD_REVIEW:
      return {...state, ...action.payload.review};
    case REMOVE_REVIEW:
      const newState = {...state};
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
}