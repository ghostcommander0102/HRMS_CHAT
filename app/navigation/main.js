import React from "react";
import SignIn from "@Pages/SignIn";
import Home from "@Pages/Home";
import Attendance from "@Pages/Attendance";
// Claim
import Claim from "@Pages/Claim";
import ClaimApprovalListing from "@Pages/Claim/ClaimApprovalListing";
import ClaimApproval from "@Pages/Claim/ClaimApproval";
import ClaimChat from "@Pages/Claim/ClaimChat";
import ClaimListing from "@Pages/Claim/ClaimListing";
import ClaimModule from "@Pages/Claim/ClaimModule";
import ClaimSummary from "@Pages/Claim/ClaimSummary";
// Leave
import Leave from "@Pages/Leave";
import LeaveSummary from "@Pages/Leave/LeaveSummary";
import LeaveSummaryDetails from "@Pages/Leave/LeaveSummary/Details";
import LeaveChat from "@Pages/Leave/LeaveChat";
import LeaveApproval from "@Pages/Leave/LeaveApproval";

import AttendanceChat from "@Pages/Attendance/AttendanceChat";
import AttendanceLateChat from "@Pages/Attendance/AttendanceLateChat";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
// Time Off
import TimeOff from "@Pages/TimeOff";
import TimeOffSummary from "@Pages/TimeOff/TimeOffSummary";
import TimeOffChat from "@Pages/TimeOff/TimeOffChat";
import TimeOffApproval from "@Pages/TimeOff/TimeOffApproval";
import TimeOffApprovalListing from "@Pages/TimeOff/TimeOffApprovalListing";
import TimeOffQR from "@Pages/TimeOff/TimeOffQR";

// Main Stack View App
const StackNavigator = createStackNavigator(
    {
        SignIn: {
            screen: SignIn
        },
        Home: {
            screen: Home
        },
        Attendance: {
            screen: Attendance
        },
        AttendanceChat: {
            screen: AttendanceChat
        },
        AttendanceLateChat: {
           screen: AttendanceLateChat 
        },
        Claim: {
            screen: Claim
        },
        ClaimApprovalListing: {
            screen: ClaimApprovalListing
        },
        ClaimApproval: {
            screen: ClaimApproval
        },
        Leave: {
            screen: Leave
        },
        ClaimChat: {
            screen: ClaimChat
        },
        ClaimListing: {
            screen: ClaimListing
        },
        ClaimModule: {
            screen: ClaimModule
        },
        ClaimSummary: {
            screen: ClaimSummary
        },
        LeaveSummary: {
            screen: LeaveSummary
        },
        LeaveChat: {
            screen: LeaveChat
        },
        LeaveApproval: {
            screen: LeaveApproval
        },
        LeaveSummaryDetails: {
            screen: LeaveSummaryDetails
        },
        TimeOff: {
            screen: TimeOff
        },
        TimeOffApproval: {
            screen: TimeOffApproval
        },
        TimeOffApprovalListing: {
            screen: TimeOffApprovalListing
        },
        TimeOffSummary: {
            screen: TimeOffSummary
        },
        TimeOffChat: {
            screen: TimeOffChat
        },
        TimeOffQR: {
            screen: TimeOffQR
        }
    },
    {
        headerMode: "none",
        initialRouteName: "SignIn"
    }
);

// Define Root Stack support Modal Screen
const RootStack = createStackNavigator(
    {
        StackNavigator: {
            screen: StackNavigator
        }
    },
    {
        mode: "modal",
        headerMode: "none",
        initialRouteName: "StackNavigator",
    }
);

export default RootStack;