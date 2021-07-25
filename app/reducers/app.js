import * as actionTypes from "@actions/actionTypes";
const initialState = {
  data: [],
  SERVER_HOST: '192.168.109.67',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION:
      return { ...state, data: action.data };
    case actionTypes.SERVER_HOST:
      return { ...state, SERVER_HOST: action.data };
    default:
      return state;
  }
};
