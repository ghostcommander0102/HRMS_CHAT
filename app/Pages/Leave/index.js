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
import { BaseColor } from '../../config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import { ScrollView, Switch, TextInput, } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Utils from "@utils";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import PushNotification from "react-native-push-notification";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class LeaveClass extends Component {
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
            textUserName: store.getState().auth.login.data.EMPLOYEE_NAME,
            textDesignation: store.getState().auth.login.data.Designation,
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            halfDay: "Morning",
            leaveType: "Annual Leave",
            isStartDatePickerVisible: false,
            isEndDatePickerVisible: false,
            startDate: "",
            endDate: "",
            actionBar: false,
            isHalfDay: false,
            LeaveApplicationData: [],
            LeaveID: "",
            Reason: "",
            realStartDate: "",
            realEndDate: "",
        }
        this.backHandler = null;
    }
    shouldComponentUpdate(preprops, state) {
        if (preprops.navigation.state.params?.leave) {
            if (state.LeaveID != preprops.navigation.state.params.leave['id']) {
                console.log('preprops', state.LeaveID);
                this.getDetails(preprops);
            }
        }
        return true;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        var date = new Date()
        this.getHRMSLeaveApplication();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }
    getDetails(preprops) {
        if (preprops.navigation.state.params?.leave) {
            var leave = preprops.navigation.state.params.leave
            this.setState({})
            this.setState({ Reason: '' })
            this.setState({ realStartDate: '' })
            this.setState({ realEndDate: '' })
            this.setState({ startDate: '' })
            this.setState({ endDate: '' })
            this.setState({ leaveType: '' })
            this.setState({ halfDay: '' })
            this.setState({ isHalfDay: false })

            this.setState({ LeaveID: leave['id'] })
            this.setState({ Reason: leave['Reason'] })
            this.setState({ realStartDate: leave['Date_Start'] })
            this.setState({ realEndDate: leave['Date_End'] })
            this.setState({ startDate: Utils.date2str(leave['Date_Start'], "D MMM YYYY") })
            this.setState({ endDate: Utils.date2str(leave['Date_End'], "D MMM YYYY") })
            this.setState({ leaveType: leave['Leave_Type'] })
            this.setState({ halfDay: leave['Session'] })
            if (leave['Half_Day'] == "true") {
                this.setState({ isHalfDay: true })
            } else if (leave['Half_Day'] == "false") {
                this.setState({ isHalfDay: false })
            }
            this.props.apiActions.setLeaveReceived(leave['id'], (response) => {
            })
        }
    }
    getHRMSLeaveApplication() {
        const { employeeID } = this.state
        this.props.apiActions.getHRMSLeaveApplication(employeeID, (response) => {
            if (response.data?.length) {
                this.setState({ LeaveApplicationData: response.data });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            // {"Date_Approval": "2020-10-24", "Date_Created": "2020-10-24 06:42:27", "Date_End": "2020-11-27", "Date_Start": "2020-11-27", 
            // "EMPLOYEE_ID": "S1001", "EMPLOYEE_NAME": "WALLACE EWE", "Half_Day": "false", "Leave_Pending_Status": "1", "Leave_Status": "Rejected", 
            // "Leave_Type": "Annual Leave", "Manager_ID": "S1001", "Manager_ID_2": "N/A", "Manager_ID_3": "N/A", "Manager_NAME": "WALLACE EWE", 
            // "Manager_Name": "WALLACE EWE", "Reason": "test", "SEND_STATUS": "0", "Session": "", "Total_Working_Days": "0.0", "id": "2318", 
            // "leave_approve_manager_level": "2", "leave_approve_manager_status_1": "2", "leave_approve_manager_status_2": "1", 
            // "leave_approve_manager_status_3": "0", "leave_approve_manager_status_4": "0", "leave_approve_manager_status_5": "0"}
        })
    }

    submitHRMSLeave() {
        const { isHalfDay, leaveType, halfDay, Reason, startDate, endDate, realEndDate, realStartDate } = this.state;
        if (realEndDate < realStartDate) {
            Toast.show(this.props.lang('message_invalid_date'));
            return
        }
        if (Reason == "" || realEndDate == "" || realStartDate == "") {
            Toast.show(this.props.lang('message_fill_all_fields'));
            return
        }
        if (!isHalfDay) {
            this.setState({ halfDay: "" })
        }
        this.setState({ Loading: true })
        this.props.apiActions.submitHRMSLeave(this.state, (response) => {
            if (response.data) {
                if (response.data.message) {
                    Toast.show(response.data.message);
                } else {
                    Toast.show('Success');
                    this.getHRMSLeaveApplication();
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
        // if (this.listener)
        //     this.listener.remove();
    }

    backAction() {
        if (this.props.navigation.isFocused()) {
            this.props.navigation.navigate('Home')
            return false
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    handleStartDate = (date) => {
        this.setState({ startDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ realStartDate: Utils.date2str(date, 'yyyy-MM-DD') })
        this.setState({ isStartDatePickerVisible: false })
    };

    handleEndDate = (date) => {
        this.setState({ endDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ realEndDate: Utils.date2str(date, 'yyyy-MM-DD') })
        this.setState({ isEndDatePickerVisible: false })
    }
    render() {
        const { navigation } = this.props;
        const { isStartDatePickerVisible, isEndDatePickerVisible, startDate, endDate, actionBar, employeeID, textDesignation } = this.state;
        let self = this;
        const { Loading, isHalfDay, LeaveApplicationData, Reason } = this.state;
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
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => this.props.navigation.navigate('Home')}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Leave Application</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Menu
                                style={{ backgroundColor: BaseColor.backgroundColor }}
                                ref={this.setMenuRef}
                                button={<Text onPress={this.showMenu}><EntypoIcons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
                            >
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(); this.props.navigation.navigate('Leave') }}>Entry</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('LeaveSummary') }}>Summary</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('LeaveApproval') }}>Approval</MenuItem>
                            </Menu>
                        </View>
                    </View>
                    <ScrollView style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                </Image>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Leave Application</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                                </Image>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 10, marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>User ID</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16 }}>{employeeID}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Designation</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16 }}>{textDesignation}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Start Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isStartDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{startDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isStartDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleStartDate(data)}
                                            onCancel={() => this.setState({ isStartDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>End Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isEndDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{endDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isEndDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleEndDate(data)}
                                            onCancel={() => this.setState({ isEndDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Half Day</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Switch
                                        style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                                        value={isHalfDay}
                                        onValueChange={() => this.setState({ isHalfDay: !isHalfDay })} />
                                    <RNPickerSelect
                                        disabled={!isHalfDay}
                                        value={this.state.halfDay}
                                        selectedValue={this.state.halfDay}
                                        style={{
                                            inputIOS: {
                                                justifyContent: 'center',
                                                color: 'black',
                                                marginTop: 5
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value) => this.setState({ halfDay: value })}
                                        items={[
                                            { label: 'Morning', value: '0' },
                                            { label: 'Afternoon', value: '1' },
                                            { label: 'Evening', value: '2' },
                                        ]}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Leave Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
                                        value={this.state.leaveType}
                                        selectedValue={this.state.leaveType}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value) => this.setState({ leaveType: value })}
                                        items={[
                                            { label: 'Annual Leave', value: 'Annual Leave' },
                                            { label: 'Sick Leave', value: 'Sick Leave' },
                                            { label: 'Unpaid Leave', value: 'Unpaid Leave' },
                                            { label: 'Emergency Leave', value: 'Emergency Leave' },
                                            { label: 'Maternity Leave', value: 'Maternity Leave' },
                                        ]}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Reason</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput onChangeText={(value) => this.setState({ Reason: value })} value={Reason} style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }}></TextInput>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.submitHRMSLeave() }}
                                style={{
                                    marginTop: 30,
                                    alignItems: 'center',
                                    backgroundColor: BaseColor.btnColor,
                                    height: 40,
                                    justifyContent: 'center',
                                    borderRadius: 5
                                }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: BaseColor.navyBlue, marginTop: 10 }}>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Type</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Start Date</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>End Date</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Status</Text></View>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {LeaveApplicationData?.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row' }} key={index.toString()}>
                                        <View style={{ flex: 1, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Leave_Type']}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Date_Start']}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Date_End']}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Leave_Status']}</Text></View>
                                    </View>
                                )
                            })}

                        </View>
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

function Leave(props) {
    const t = useTranslation();
    return <LeaveClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(Leave);