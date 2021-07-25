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
    Dimensions,
    Text,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from "@utils";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class LeaveSummaryClass extends Component {
    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };
    constructor(props) {
        super(props);
        const screenWidth = Math.round(Dimensions.get('window').width);
        this.state = {
            width: screenWidth - 170,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            employeeName: store.getState().auth.login.data.EMPLOYEE_NAME,
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            actionBar: false,
            leaveSummayData: [],
            annual_balance: 0,
            sick_balance: 0,
            emergency_balance: 0,
            maternity_balance: 0,
        }
        this.backHandler = null;
    }

    componentDidMount() {
        SetPrefrence('page_name', 1);
        this.getHRMSLeaveApplication();
        this.getHRMSLeaveSummaryList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }
    getHRMSLeaveSummaryList() {
        const { employeeID } = this.state;
        this.props.apiActions.getHRMSLeaveSummaryList(employeeID, (response) => {
            if (response.data) {
                console.log(response.data)
                this.setState({ leaveSummayData: response.data })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    getHRMSLeaveApplication() {
        const { employeeID } = this.state
        this.setState({ Loading: true })
        this.props.apiActions.getHRMSLeaveApplication(employeeID, (response) => {
            if (response.data?.length) {
                let annual = 0, sick = 0, maternity = 0, emergency = 0;
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i]['Leave_Type'] == 'Annual Leave') {
                        annual += this.getDiffDay(response.data[i]['Date_Start'], response.data[i]['Date_End'], response.data[i]['Half_Day']);
                    } else if (response.data[i]['Leave_Type'] == 'Sick Leave') {
                        sick += this.getDiffDay(response.data[i]['Date_Start'], response.data[i]['Date_End'], response.data[i]['Half_Day']);
                    } else if (response.data[i]['Leave_Type'] == 'Emergency Leave') {
                        emergency += this.getDiffDay(response.data[i]['Date_Start'], response.data[i]['Date_End'], response.data[i]['Half_Day']);
                    } else if (response.data[i]['Leave_Type'] == 'Maternity Leave') {
                        maternity += this.getDiffDay(response.data[i]['Date_Start'], response.data[i]['Date_End'], response.data[i]['Half_Day']);
                    }
                }
                this.setState({ annual_balance: annual });
                this.setState({ sick_balance: sick });
                this.setState({ emergency_balance: emergency });
                this.setState({ maternity_balance: maternity });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
            // {"Date_Approval": "2020-10-24", "Date_Created": "2020-10-24 06:42:27", "Date_End": "2020-11-27", "Date_Start": "2020-11-27", 
            // "EMPLOYEE_ID": "S1001", "EMPLOYEE_NAME": "WALLACE EWE", "Half_Day": "false", "Leave_Pending_Status": "1", "Leave_Status": "Rejected", 
            // "Leave_Type": "Annual Leave", "Manager_ID": "S1001", "Manager_ID_2": "N/A", "Manager_ID_3": "N/A", "Manager_NAME": "WALLACE EWE", 
            // "Manager_Name": "WALLACE EWE", "Reason": "test", "SEND_STATUS": "0", "Session": "", "Total_Working_Days": "0.0", "id": "2318", 
            // "leave_approve_manager_level": "2", "leave_approve_manager_status_1": "2", "leave_approve_manager_status_2": "1", 
            // "leave_approve_manager_status_3": "0", "leave_approve_manager_status_4": "0", "leave_approve_manager_status_5": "0"}
        })
    }
    getDiffDay(startDate, endDate, halfDay) {
        let date1 = new Date(endDate);
        let date2 = new Date(startDate);
        let diff_time = date1.getTime() - date2.getTime();
        let diff_days = diff_time / (1000 * 3600 * 24) + 1;
        if (halfDay == "true") {
            diff_days -= 0.5;
        }
        return diff_days;
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

    handleStartDate = (date) => {
        this.setState({ startDate: Utils.date2str(date) })
        this.setState({ isStartDatePickerVisible: false })
    };

    handleEndDate = (date) => {
        this.setState({ endDate: Utils.date2str(date) })
        this.setState({ isEndDatePickerVisible: false })
    }

    RealBalance({ item, _this }) {
        const { annual_balance, emergency_balance, maternity_balance, sick_balance } = _this.state;
        if (item['Leave_Type'] == 'Annual Leave') {
            return (
                <Text style={{ paddingBottom: 5 }}>{parseFloat(item['Current_Leave_Balance']) + parseFloat(item['Carry_Forward_Leave']) - annual_balance}</Text>
            )
        } else if (item['Leave_Type'] == 'Sick Leave') {
            return (
                <Text style={{ paddingBottom: 5 }}>{parseFloat(item['Current_Leave_Balance']) + parseFloat(item['Carry_Forward_Leave']) - sick_balance}</Text>
            )
        } else if (item['Leave_Type'] == 'Emergency Leave') {
            return (
                <Text style={{ paddingBottom: 5 }}>{parseFloat(item['Current_Leave_Balance']) + parseFloat(item['Carry_Forward_Leave']) - emergency_balance}</Text>
            )
        } else if (item['Leave_Type'] == 'Maternity Leave') {
            return (
                <Text style={{ paddingBottom: 5 }}>{parseFloat(item['Current_Leave_Balance']) + parseFloat(item['Carry_Forward_Leave']) - maternity_balance}</Text>
            )
        } else {
            return (
                <Text style={{ paddingBottom: 5 }}>{parseFloat(item['Current_Leave_Balance']) + parseFloat(item['Carry_Forward_Leave'])}</Text>
            )
        }
    }

    render() {
        const { navigation } = this.props;
        const { Loading, leaveSummayData, employeeID, employeeName, annual_balance, emergency_balance, maternity_balance, sick_balance } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: BaseColor.colorBlueLighter }}>
                {Loading == true
                    ?
                    <View style={{ height: "100%", width: "100%", opacity: 0.3, position: 'absolute', zIndex: 1000 }}></View>
                    :
                    null
                }
                <>
                    <View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => navigation.navigate('Home')}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Leave Summary</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Menu
                                style={{ backgroundColor: BaseColor.backgroundColor }}
                                ref={this.setMenuRef}
                                button={<Text onPress={this.showMenu}><EntypoIcons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
                            >
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('Leave') }}>Entry</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('LeaveSummary') }}>Summary</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('LeaveApproval') }}>Approval</MenuItem>
                            </Menu>
                        </View>
                    </View>
                    <View style={{ padding: 10, flexDirection: 'column', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                </Image>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Leave Summary</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                                </Image>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{ flexDirection: 'column' }}>
                        {leaveSummayData?.map((item, index) => {
                            return (
                                <View key={index.toString()}>
                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5, paddingLeft: 5 }}>Employee Name [Emp ID] - {employeeName}[{employeeID}]</Text>
                                    <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Type :</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Entitlement :</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Taken :</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Balance :</Text>
                                        </View>
                                        <View style={{ flex: 3, flexDirection: 'column' }}>
                                            <Text style={{ paddingBottom: 5 }}>{item['Leave_Type']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Carry_Forward_Leave']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Current_Leave_Taken']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Current_Leave_Balance']}</Text>
                                            {/* <this.RealBalance item={item} _this={this}></this.RealBalance> */}
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity style={{ width: 24, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LeaveSummaryDetails', { leaveType: item['Leave_Type'] })}>
                                                <Image source={require('@assets/images/ic_link.png')} style={{ width: 24, height: 40 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                    </ScrollView>
                </>
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

function LeaveSummary(props) {
    const t = useTranslation();
    return <LeaveSummaryClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(LeaveSummary);