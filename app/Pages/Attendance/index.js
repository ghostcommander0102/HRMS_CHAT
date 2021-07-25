/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
// import PushNotification from "react-native-push-notification";
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import { ScrollView } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';

class AttendanceClass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            textStatus: "",
            textClockIn: "",
            textEarlyIn: "",
            textLateIn: "",
            textClockOut: "",
            textEarlyOut: "",
            textLateOut: "",
            textEarlyInMonthlyCount: "",
            textEarlyInMonthlyDuration: "",
            textLateInMonthlyCount: "",
            textLateInMonthlyDuration: "",
            textEarlyOutMonthlyCount: "",
            textEarlyOutMonthlyDuration: "",
            textLateOutMonthlyCount: "",
            textLateOutMonthlyDuration: "",
            textEarlyInYearlyCount: "",
            textEarlyInYearlyDuration: "",
            textLateInYearlyCount: "",
            textLateInYearlyDuration: "",
            textEarlyOutYearlyCount: "",
            textEarlyOutYearlyDuration: "",
            textLateOutYearlyCount: "",
            textLateOutYearlyDuration: "",
            textTotalExtraHours: "",
            textMerit: "",
            textMeritYearMonth: "",
            textTotalMeritPoint: "",
            textMeritEarlyIn: "",
            textMeritLateIn: "",
            textMeritEarlyOut: "",
            textMeritLateOut: "",
            textMeritLetter: "",
            textMeritMemo: "",
            textMeritLeave: "",
            textMeritAbsent: "",
            textMeritTotalBalance: "",
            textUserName: store.getState().auth.login.data.EMPLOYEE_NAME,
            textUserID: "",
            textDesignation: store.getState().auth.login.data.Designation,
            textDailySalary: "",
            textMonthlySalary: "",
            textNextDaySalary: "",
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            textExtraHours: "0",
            isShowMonth_Year: false
        }
        this.backHandler = null;
    }

    componentDidMount() {
        SetPrefrence('page_name', 1);
        this.setState({ Loading: true });
        this.setState({ textUserID: this.state.textUserName + " [ID " + this.state.employeeID + "]" })
        this.getHRMSAttendance();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    getHRMSAttendance() {
        const { employeeID } = this.state;
        this.props.apiActions.getHRMSAttendance(employeeID, (response) => {
            this.setState({ Loading: false });
            if (response.data) {
                //     "id": "10886",
                // "Scan_Date": "2020-11-12",
                // "EMPLOYEE_ID": "03",
                // "EMPLOYEE_NAME": "ABDUL HALIM BIN MAT ISA",
                this.setState({ textClockIn: response.data.Clock_In });
                this.setState({ textClockOut: response.data.Clock_Out });
                this.setState({ textLateIn: response.data.Late_In });
                this.setState({ textEarlyIn: response.data.Early_In });
                // "Early_Out": "8.20",
                // "Late_Out": "0.00",
                this.setState({ textLateOut: response.data.Late_Out });
                this.setState({ textEarlyOut: response.data.Early_Out });
                // "Designation": "DRIVER",
                // "Extra_Hours": "",
                this.setState({ textExtraHours: response.data.Extra_Hours });
                // "Monthly_Lateness_Count": "0",
                this.setState({ textLateInMonthlyCount: response.data.Monthly_Lateness_Count });
                // "Monthly_Lateness_Hours": "0.00",
                this.setState({ textLateInMonthlyDuration: response.data.Monthly_Lateness_Hours });
                // "Yearly_Lateness_Count": "0",
                this.setState({ textLateInYearlyCount: response.data.Yearly_Lateness_Count });
                // "Yearly_Lateness_Hours": "0.00",
                this.setState({ textLateInYearlyDuration: response.data.Yearly_Lateness_Hours });
                // "Monthly_EarlyIn_Count": "0",
                // "Monthly_EarlyIn_Hours": "0.00",
                this.setState({ textEarlyInMonthlyCount: response.data.Monthly_EarlyIn_Count });
                this.setState({ textEarlyInMonthlyDuration: response.data.Monthly_EarlyIn_Hours });
                // "Yearly_EarlyIn_Count": "0",
                // "Yearly_EarlyIn_Hours": "0.00",
                this.setState({ textEarlyInYearlyCount: response.data.Yearly_EarlyIn_Count });
                this.setState({ textEarlyInYearlyDuration: response.data.Yearly_EarlyIn_Hours });
                // "Monthly_EarlyOut_Count": "0",
                // "Monthly_EarlyOut_Hours": "0.00",
                this.setState({ textEarlyOutMonthlyCount: response.data.Monthly_EarlyOut_Count });
                this.setState({ textEarlyOutMonthlyDuration: response.data.Monthly_EarlyOut_Hours });
                // "Yearly_EarlyOut_Count": "0",
                // "Yearly_EarlyOut_Hours": "0.00",
                this.setState({ textEarlyOutYearlyCount: response.data.Yearly_EarlyOut_Count });
                this.setState({ textEarlyOutYearlyDuration: response.data.Yearly_EarlyOut_Hours });
                // "Monthly_LateOut_Count": "0",
                // "Monthly_LateOut_Hours": "0.00",
                this.setState({ textLateOutMonthlyCount: response.data.Monthly_LateOut_Count });
                this.setState({ textLateOutMonthlyDuration: response.data.Monthly_LateOut_Hours });
                // "Yearly_LateOut_Count": "0",
                // "Yearly_LateOut_Hours": "0.00",
                this.setState({ textLateOutYearlyCount: response.data.Yearly_LateOut_Count });
                this.setState({ textLateOutYearlyDuration: response.data.Yearly_LateOut_Hours });
                // "Total_Extra_Hours": "",
                this.setState({ textTotalExtraHours: response.data.Total_Extra_Hours });

                // "UpToDateMeritPoint": "0",
                // "Photo": "",
                // "CompanyLogo": "",
                // "Point_Early_In": "0",
                this.setState({ textMeritEarlyIn: response.data.Point_Early_In })
                // "Point_Early_Out": "0",
                this.setState({ textMeritEarlyOut: response.data.Point_Early_Out })
                this.setState({ textStatus: response.data.TYPE })
                // "TYPE": "MORNING SHIFT",
                // "Point_Late_In": "0",
                this.setState({ textMeritLateIn: response.data.Point_Late_In })
                // "Point_Late_Out": "0",
                this.setState({ textMeritLateOut: response.data.Point_Late_Out })
                // "Point_Absent": "0",
                this.setState({ textMeritAbsent: response.data.Point_Absent })
                // "Point_Letter": "0",
                this.setState({ textMeritLetter: response.data.Point_Letter })
                // "Point_Memo": "0",
                this.setState({ textMeritMemo: response.data.Point_Memo })
                // "Point_Leave": "0",
                this.setState({ textMeritLeave: response.data.Point_Leave })
                let total = 0;
                total += parseInt(response.data.Point_Early_In);
                total += parseInt(response.data.Point_Late_Out);
                total -= parseInt(response.data.Point_Early_Out);
                total -= parseInt(response.data.Point_Late_In);
                total -= parseInt(response.data.Point_Absent);
                total -= parseInt(response.data.Point_Letter);
                total -= parseInt(response.data.Point_Memo);
                total -= parseInt(response.data.Point_Leave);
                this.setState({ textMerit: total });
                this.setState({ textMeritTotalBalance: total });
                // "Total_Merit_Point": "50",

                this.setState({ textTotalMeritPoint: response.data.Total_Merit_Point });
                // "SEND_STATUS": "0",
                // "SHIFT": "DAY",
                // "Daily_Salary": null,
                this.setState({ textDailySalary: response.data.Daily_Salary });
                // "Monthly_Salary": null,
                this.setState({ textMonthlySalary: response.data.Monthly_Salary });
                // "Next_Day_Salary": null
                this.setState({ textNextDaySalary: response.data.Next_Day_Salary });
            } else if (response.success) {
                Toast.show("Maybe network connection has failed.");
            }
        });
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }

    backAction() {
        if (this.props.navigation.isFocused()) {
            return false
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    render() {
        const { navigation } = this.props;
        const { Loading, isShowMonth_Year } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: BaseColor.colorBlueLighter }}>
                {Loading == true
                    ?
                    <View style={{ height: "100%", width: "100%", opacity: 0.3, backgroundColor: "white", flex: 1 }}></View>
                    :
                    <>
                        <View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => navigation.goBack()}>
                                <Icons name={'arrow-back'} size={30} color='#fff' />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Attendance</Text>
                        </View>
                        <ScrollView style={{ padding: 10, flexDirection: 'column', flex: 1, paddingTop: 20 }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                    </Image>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Employee Records</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                                    </Image>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>User ID:  </Text>
                                    <Text style={[styles.text_title]}>Designation:  </Text>
                                    <Text style={[styles.text_title]}>Status:  </Text>
                                    <Text style={[styles.text_title]}>Clock In:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textUserID}</Text>
                                    <Text>{this.state.textDesignation}</Text>
                                    <Text>{this.state.textStatus}</Text>
                                    <Text>{this.state.textClockIn}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginRight: 50, marginLeft: 100, backgroundColor: BaseColor.colorBlueLight, marginBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Early In:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textEarlyIn}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginRight: 50, marginLeft: 100, backgroundColor: BaseColor.colorBlueLight }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Late In:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textLateIn}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Clock Out:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textClockOut}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginRight: 50, marginLeft: 100, backgroundColor: BaseColor.colorBlueLight, marginBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Early Out:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textEarlyOut}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginRight: 50, marginLeft: 100, backgroundColor: BaseColor.colorBlueLight }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Late Out:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textLateOut}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Extra Hours:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Text>{this.state.textExtraHours ? this.state.textExtraHours : 0} hours</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                <Text style={[styles.text_title]}>Monthly</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}></Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Early In</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Late In</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Early Out</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Late Out</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Count(times)</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyInMonthlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateInMonthlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyOutMonthlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateOutMonthlyCount}</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Duration (hr.min)</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyInMonthlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateInMonthlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyOutMonthlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateOutMonthlyDuration}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                <Text style={[styles.text_title]}>Yearly</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly]}></Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Early In</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Late In</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Early Out</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Late Out</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Count(times)</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyInYearlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateInYearlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyOutYearlyCount}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateOutYearlyCount}</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Duration (hr.min)</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyInYearlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateInYearlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textEarlyOutYearlyDuration}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.textLateOutYearlyDuration}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                <Text style={[styles.text_title]}>Salary</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Daily Salary</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Monthly Acc. Salary</Text>
                                    <Text style={[styles.text_monthly, styles.text_title]}>Next Day Salary</Text>
                                </View>
                                <View style={{ flex: 3, flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                    <Text style={[styles.text_monthly]}>{this.state.Daily_Salary ? this.state.Daily_Salary : "0.00"}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.Monthly_Salary ? this.state.Monthly_Salary : "0.00"}</Text>
                                    <Text style={[styles.text_monthly]}>{this.state.Next_Day_Salary ? this.state.Next_Day_Salary : "0.00"}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                <Text style={[styles.text_title]}>Monthly</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={[styles.text_title]}>Total Extra Hours:  </Text>
                                    <Text style={[styles.text_title]}>Up-To-Date Merit Points:  </Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text>{this.state.Total_Extra_Hours ? this.state.Total_Extra_Hours : "0"} hours</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text>{this.state.textMerit}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                justifyContent: 'flex-end',
                                                marginLeft: 100
                                            }}
                                            onPress={() => {
                                                if (isShowMonth_Year) {
                                                    this.setState({ isShowMonth_Year: false })
                                                } else {
                                                    this.setState({ isShowMonth_Year: true })
                                                }
                                            }}
                                        >
                                            <Image source={require('@assets/images/ic_question.png')} style={{ width: 20, height: 20 }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {isShowMonth_Year
                                ?
                                <>
                                    <View style={{ flexDirection: 'row', flex: 1, marginTop: 10, marginTop: 10, marginBottom: 5 }}>
                                        <Text style={[styles.text_title]}>Month-Year :</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, backgroundColor: BaseColor.accentColor, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text style={[styles.text_title, { color: "white" }]}>Type</Text>
                                            </View>
                                            <View style={{ flex: 1, backgroundColor: BaseColor.accentColor, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={[styles.text_title, { textAlign: 'center', color: "white" }]}>Point Calulation</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (+) Early In</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritEarlyIn}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (+) Late Out</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritLateOut}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Late In</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritLateIn}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Early Out</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritEarlyOut}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Absent</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritAbsent}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Letter</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritLetter}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Memo</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritMemo}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 }}>
                                                <Text> (-) Leave</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1, borderBottomWidth: 0 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritLeave}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, backgroundColor: BaseColor.colorOrangeLight }}>
                                            <View style={{ flex: 1, borderWidth: 1, borderRightWidth: 0 }}>
                                                <Text>Total Balance</Text>
                                            </View>
                                            <View style={{ flex: 1, borderWidth: 1 }}>
                                                <Text style={{ textAlign: 'center' }}>{this.state.textMeritTotalBalance}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                                :
                                null
                            }

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("AttendanceChat")}
                                style={{
                                    marginTop: 20,
                                    marginBottom: 40,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: BaseColor.colorOrangeLight,
                                    height: 40,
                                }}>
                                <Text style={{ fontWeight: 'bold' }}>Chat With HR</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </>
                }
                {this.state.Loading ?
                    <ActivityIndicator
                        size="large"
                        style={styles.loadingBar}
                        color={BaseColor.primaryColor}
                    /> : null
                }
            </SafeAreaView>
        );
    }
};

function Attendance(props) {
    const t = useTranslation();
    return <AttendanceClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(Attendance);