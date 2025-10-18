// sabitwrld/steamui/SteamUI-e7ce9c382fc46f096255c58814740b9040d379dc/SteamUI/src/store/reviewVotes.js

import csrfFetch from "./csrf";
import { ADD_REVIEW, SET_REVIEWS } from "./reviews";

const ADD_REVIEW_VOTE = "reviewVotes/ADD_REVIEW_VOTE";
const REMOVE_REVIEW_VOTE = "reviewVotes/REMOVE_REVIEW_VOTE";

const addReviewVote = (reviewVote) => {
  return {
    type: ADD_REVIEW_VOTE,
    payload: reviewVote
  }
}

const removeReviewVote = (reviewVoteId) => {
  return {
    type: REMOVE_REVIEW_VOTE,
    payload: reviewVoteId
  }
}

// ** DƏYİŞİKLİK 1: Endpoint `/api/reviews/{reviewId}/review_votes` -> `/api/ReviewVote` **
export const createReviewVote = (reviewVote) => async (dispatch) => {
  const res = await csrfFetch(`/api/ReviewVote`, {
    method: "POST",
    body: JSON.stringify(reviewVote)
  })
  const data = await res.json();
  dispatch(addReviewVote(data));
}

// ** DƏYİŞİKLİK 2: Endpoint `/api/review_votes/{reviewVote.id}` -> `/api/ReviewVote/{reviewVote.id}` **
export const updateReviewVote = (reviewVote) => async (dispatch) => {
  const updatedVote = {value: reviewVote.value}
  const res = await csrfFetch(`/api/ReviewVote/${reviewVote.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedVote)
  });
  const data = await res.json();
  dispatch(addReviewVote(data));
}

// ** DƏYİŞİKLİK 3: Endpoint `/api/review_votes/{reviewVoteId}` -> `/api/ReviewVote/{reviewVoteId}` **
export const deleteReviewVote = (reviewVoteId) => async (dispatch) => {
  await csrfFetch(`/api/ReviewVote/${reviewVoteId}`, {
    method: "DELETE"
  });
  dispatch(removeReviewVote(reviewVoteId));
}

export default function reviewVotesReducer(state = {}, action) {
  switch (action.type) {
    case SET_REVIEWS:
      return action.payload.reviewVotes;
    case ADD_REVIEW:
      return {...state, ...action.payload.reviewVotes};
    case ADD_REVIEW_VOTE:
      return {...state, ...action.payload};
    case REMOVE_REVIEW_VOTE:
      const newState = {...state};
      delete newState[action.payload];
      return newState
    default:
      return state;
  }
}