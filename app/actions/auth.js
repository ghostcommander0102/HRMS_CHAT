import * as actionTypes from "./actionTypes";
import * as Utils from "../utils";
import { GetPrefrence, store } from "@store";
import { _TOKEN } from "./api";
import { useReducer } from "react";
const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data
  };
};

export const authentication = (login, userinfo, callback) => async dispatch => {
  const data = {
    success: login,
    data: {},
  };
  if (!login) {
    fetch(`${global.SERVER_HOST}/api/logout`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${_TOKEN()}`,
      }
    });
    dispatch(onLogin(data));
    callback({ success: true });
    return;
  }
  const formdata = new FormData();
  formdata.append("email", userinfo.email);
  formdata.append("password", userinfo.password);
  fetch(`${global.SERVER_HOST}/Api/Auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formdata
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.code == 500) {
        return callback({ state: 1, message: res.message });
      }
      data.data = res;
      dispatch(onLogin(data));
      return callback({ state: 0 });
    })
    .catch((err) => callback({ success: false }));
};

export const device_token = (device) => async dispatch => {
  let email_address = store.getState().auth.login.data.EMAIL_ADDRESS
  let device_token = await GetPrefrence('device_token');
  console.log("device_token",device_token)
  const formdata = new FormData();
  formdata.append("email", email_address);
  formdata.append("device", device);
  formdata.append("device_token", device_token);
  fetch(`${global.SERVER_HOST}/Api/Auth/insert_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formdata
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}
export const remove_token = (device, callback) => async dispatch => {
  const data = {
    success: false,
    data: {},
  };
  let email_address = store.getState().auth.login.data.EMAIL_ADDRESS
  const formdata = new FormData();
  formdata.append("email", email_address);
  formdata.append("device", device);
  fetch(`${global.SERVER_HOST}/Api/Auth/remove_token`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formdata
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      dispatch(onLogin(data));
      return callback({ success: true });
    })
    .catch((err) => callback({ success: false }));
}
