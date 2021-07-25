import * as Utils from '@utils';
import * as actionTypes from "./actionTypes";
import { store } from '@store';
import { SegmentedControlIOSComponent } from 'react-native';
export const _TOKEN = () => {
  try {
    return store.getState().auth.login.data.token;
  } catch (error) {
    return null;
  }
};

//---------------- MAIN PAGE START ---------------------//

export const getLTCLPendingList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("managerID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLCTLCommon/getLTCLPendingList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};
//---------------- MAIN PAGE END ---------------------//

export const getHRMSAttendance = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HumanResource/getAttendance`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSAttendanceMessages = (employeeID, userID, callback) => dispatch => {
  const data = new FormData();
  data.append("employee", employeeID);
  data.append("userID", userID);
  fetch(`${global.SERVER_HOST}/Api/HRMSAttendance/getMessageList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSAttendanceLateMessages = (employeeID, userID, attendance_id, callback) => dispatch => {
  const data = new FormData();
  data.append("employee", employeeID);
  data.append("userID", userID);
  data.append("attendance_id", attendance_id);
  fetch(`${global.SERVER_HOST}/Api/HRMSAttendance/getLateMessageList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const sendHRMSAttendanceMessage = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", state.employeeID);
  data.append("receiver", state.userID);
  data.append("message", state.textMessage);
  data.append("photo", state.photo);
  data.append("type", state.type);
  fetch(`${global.SERVER_HOST}/Api/HRMSAttendance/newMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res----------------");
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const sendHRMSAttendanceLateMessage = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", state.employeeID);
  data.append("receiver", state.userID);
  data.append("message", state.textMessage);
  data.append("photo", state.photo);
  data.append("type", state.type);
  fetch(`${global.SERVER_HOST}/Api/HRMSAttendance/newLateMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res----------------");
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

// http://192.168.109.67/Api/Customer/get
export const getCustomerTitle = (callback) => dispatch => {
  fetch(`${global.SERVER_HOST}/Api/Customer/get`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res.message });
    })
    .catch((err) => callback({ success: false }));
};


//---------------- Claim PAGE START ---------------------//
//---------------- Claim PAGE START ---------------------//
//---------------- Claim PAGE START ---------------------//
//---------------- Claim PAGE START ---------------------//
//---------------- Claim PAGE START ---------------------//
export const setClaimReceived = (claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("claimID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/setClaimReceived`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};
export const getHRMSClaimTypeList = (callback) => dispatch => {
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getClaimTypeList`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getProjectTypeList = (callback) => dispatch => {
  fetch(`${global.SERVER_HOST}/Api/HRMSClaimProject/getClaimProjectList`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const submitHRMSClaim = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", state.employeeID);
  data.append("title", state.title);
  data.append("type", state.ClaimType);
  data.append("country", state.selectedCountry);
  data.append("Date_Start", state.realStartDate);
  data.append("Date_End", state.realEndDate);
  data.append("description", state.description);
  data.append("project_name", state.projectName);
  data.append("project_type", state.projectType);
  data.append("contact", state.projectContact);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/submitClaim`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSClaimApprovalList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getClaimApprovalList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSClaimList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getClaimList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const deleteHRMSClaim = (employeeID, claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Claim_ID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/deleteClaim`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const deleteHRMSClaimModule = (employeeID, claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Claim_Module_ID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/deleteClaimModule`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSClaimModuleList = (employeeID, claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Claim_ID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getClaimModuleList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSClaimDetailTypeList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getClaimDetailTypeList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getGstList = (callback) => dispatch => {
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getGstList`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};



export const getHRMSClaimMessageList = (employee, userID, claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("employee", employee);
  data.append("userID", userID);
  data.append("Claim_ID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/getMessageList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const sendHRMSClaimMessage = (employeeID, receiver, claimID, textMessage, photo, type, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", employeeID);
  data.append("receiver", receiver);
  data.append("Claim_ID", claimID);
  data.append("message", textMessage);
  data.append("photo", photo);
  data.append("type", type);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/newMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const refreshClaimChat = (sender, receiver, claimID, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", sender);
  data.append("receiver", receiver);
  data.append("claimID", claimID);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/refreshClaimChat`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const updateHRMSClaimStatus = (employeeID, claimID, status, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Claim_ID", claimID);
  data.append("Status", status);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/updateClaimStatus`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const submitHRMSClaimModule = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", state.employeeID);
  data.append("Claim_ID", state.claimID);
  data.append("Claim_Detail_ID", state.claimDetailID);
  data.append("type", state.claimType);
  data.append("date", state.realClaimDate);
  data.append("tax_code", state.taxCode);
  data.append("tax_rate", state.taxRate);
  data.append("description", state.description);
  data.append("amount", state.amount);
  data.append("tax_amount", state.tax_amount);
  data.append("service_charge", state.service_charge);
  data.append("remark", state.remark);
  data.append("status", state.status);
  data.append("photo", state.photo);
  data.append("photoType", state.type);
  fetch(`${global.SERVER_HOST}/Api/HRMSClaim/submitClaimModule`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

// ------------------ Claim Page End -------------------------- //
// ------------------ Claim Page End -------------------------- //
// ------------------ Claim Page End -------------------------- //
// ------------------ Claim Page End -------------------------- //
// ------------------ Claim Page End -------------------------- //


// ------------------ Leave Page Start -------------------------- //
// ------------------ Leave Page Start -------------------------- //
// ------------------ Leave Page Start -------------------------- //
// ------------------ Leave Page Start -------------------------- //
// ------------------ Leave Page Start -------------------------- //

export const setLeaveReceived = (leaveID, callback) => dispatch => {
  const data = new FormData();
  data.append("leaveID", leaveID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/setLeaveReceived`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};
export const getHRMSLeaveApplication = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/getLeaveApplicationList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const submitHRMSLeave = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", state.employeeID);
  data.append("Date_Start", state.realStartDate);
  data.append("Date_End", state.realEndDate);
  data.append("Half_Day", state.isHalfDay);
  data.append("Session", state.halfDay);
  data.append("Leave_Type", state.leaveType);
  data.append("Reason", state.Reason);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/submitLeaveApplication`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSLeaveSummaryList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/getLeaveSummaryList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSLeaveSummaryDetailList = (employeeID, leaveType, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Leave_Type", leaveType);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/getLeaveSummaryDetailList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const deleteHRMSLeaveSummaryDetail = (employeeID, leaveID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Leave_ID", leaveID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/deleteLeave`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSLeaveApprovalList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/getLeaveApprovalList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const updateHRMSLeaveStatus = (employeeID, leaveID, status, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("Leave_ID", leaveID);
  data.append("Leave_Status", status);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/updateLeaveStatus`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};
export const getHRMSLeaveMessageList = (employee, userID, leaveID, callback) => dispatch => {
  const data = new FormData();
  data.append("employee", employee);
  data.append("userID", userID);
  data.append("leaveID", leaveID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/getMessageList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const sendHRMSLeaveMessage = (employeeID, receiver, leaveID, textMessage, photo, type, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", employeeID);
  data.append("receiver", receiver);
  data.append("leaveID", leaveID);
  data.append("message", textMessage);
  data.append("photo", photo);
  data.append("type", type);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/newMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const refreshLeaveChat = (sender, receiver, leaveID, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", sender);
  data.append("receiver", receiver);
  data.append("leaveID", leaveID);
  fetch(`${global.SERVER_HOST}/Api/HRMSLeave/refreshLeaveChat`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

// ------------------ Leave Page END -------------------------- //
// ------------------ Leave Page END -------------------------- //
// ------------------ Leave Page END -------------------------- //
// ------------------ Leave Page END -------------------------- //
// ------------------ Leave Page END -------------------------- //
// ------------------ Leave Page END -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //
// ------------------ TimeOff Page Start -------------------------- //

export const setTimeOffReceived = (timeOffID, callback) => dispatch => {
  const data = new FormData();
  data.append("timeOffID", timeOffID);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/setTimeOffReceived`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSTimeOffTypeList = (callback) => dispatch => {
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/getTimeOffTypeList`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSTimeOffModuleList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/getTimeOffModuleList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const submitHRMSTimeOffModule = (state, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", state.employeeID);
  data.append("Timeoff_ID", state.timeOffID);
  data.append("title", state.title);
  data.append("country", state.selectedCountry);
  data.append("type", state.TimeOffType);
  data.append("date", state.realOffDate);
  data.append("startTime", state.startDate);
  data.append("endTime", state.endDate);
  data.append("description", state.description);
  data.append("status", state.status);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/submitTimeOffModule`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const updateLocation = (timeoff_id, location, lat, lng, callback) => dispatch => {
  const data = new FormData();
  data.append("timeoff_id", timeoff_id);
  data.append("location", location);
  data.append("lat", lat);
  data.append("lng", lng);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/updateLocation`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const updateLocation2 = (timeoff_id, location, lat, lng, callback) => dispatch => {
  const data = new FormData();
  data.append("timeoff_id", timeoff_id);
  data.append("location", location);
  data.append("lat", lat);
  data.append("lng", lng);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/updateLocation2`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSTimeOffApprovalList = (employeeID, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/getTimeOffApprovalList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const loadDashboardData = (employeeID,id, callback) => dispatch => {
  const data = new FormData();
  data.append("employeeID", employeeID);
  data.append("id", id);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/getHRMSTimeOffStatistics`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const updateHRMSTimeOffStatus = (Timeoff_ID, Status, callback) => dispatch => {
  const data = new FormData();
  data.append("Timeoff_ID", Timeoff_ID);
  data.append("Status", Status);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/updateTimeOffStatus`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const getHRMSTimeOffMessageList = (employee, userID, Timeoff_ID, callback) => dispatch => {
  const data = new FormData();
  data.append("Timeoff_ID", Timeoff_ID);
  data.append("employee", employee);
  data.append("userID", userID);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/getMessageList`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};

export const sendHRMSTimeOffMessage = (employeeID, receiver, Timeoff_ID, textMessage, photo, type, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", employeeID);
  data.append("receiver", receiver);
  data.append("Timeoff_ID", Timeoff_ID);
  data.append("message", textMessage);
  data.append("photo", photo);
  data.append("type", type);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/newMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};
export const refreshTimeoffChat = (sender, receiver, timeoffID, callback) => dispatch => {
  const data = new FormData();
  data.append("sender", sender);
  data.append("receiver", receiver);
  data.append("timeoffID", timeoffID);
  fetch(`${global.SERVER_HOST}/Api/HRMSTimeOff/refreshTimeoffChat`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data
  })
    .then((res) => res.json())
    .then((res) => {
      return callback({ data: res });
    })
    .catch((err) => callback({ success: false }));
};