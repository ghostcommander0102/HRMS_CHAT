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
    SafeAreaView,
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
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';
import PushNotification from "react-native-push-notification";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import * as actionTypes from "@actions/actionTypes";

class LeaveApprovalClass extends Component {
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
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            actionBar: false,
            leaveApprovalData: [],
            totalLeaveApprovalData: []
        }
        this.backHandler = null;
    }

    componentDidMount() {
        SetPrefrence('page_name', 1);

        this.setState({ Loading: true });
        this.getHRMSLeaveApprovalList()
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.listener = this.props.navigation.addListener("didFocus", this.init.bind(this));
    }

    init() {
        SetPrefrence('page_name', 1);
    }

    getHRMSLeaveApprovalList() {
        const { employeeID } = this.state
        this.props.apiActions.getHRMSLeaveApprovalList(employeeID, (response) => {
            if (response.data) {
                let pendingData = [];
                let len = response.data.length;
                let tempData = [];
                for (var i = 0; i < len; i++) {
                    if (response.data[i]['Leave_Status'] == 'Pending') {
                        pendingData.push(response.data[i]);
                    } else {
                        tempData.push(response.data[i])
                    }
                }
                var data = pendingData.concat(tempData);
                this.setState({ totalLeaveApprovalData: data })
                this.setState({ leaveApprovalData: data.slice(0, 15) });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }
    addArray() {
        const { leaveApprovalData, totalLeaveApprovalData } = this.state;
        var len = leaveApprovalData.length;
        this.setState({
            leaveApprovalData: [...this.state.leaveApprovalData, ...totalLeaveApprovalData.slice(len, len + 15)]
        });
    }
    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }
    updateLeaveStatus(id, index, status) {
        const { employeeID } = this.state;
        this.setState({ Loading: true });
        this.props.apiActions.updateHRMSLeaveStatus(employeeID, id, status, (response) => {
            if (response.data) {
                if (response.data.message) {
                    Toast.show(response.data.message);
                } else if (response.data == 'Success') {
                    Toast.show('Success');
                    const { leaveApprovalData } = this.state;
                    leaveApprovalData[index]['Leave_Status'] = status;
                    this.setState({ leaveApprovalData });
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false });
        })
    }
    backAction() {
        if (this.props.navigation.isFocused()) {
            return false
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    Total_days({ startDate, endDate, halfDay }) {
        let date1 = new Date(endDate);
        let date2 = new Date(startDate);
        let diff_time = date1.getTime() - date2.getTime();
        let diff_days = diff_time / (1000 * 3600 * 24) + 1;
        if (halfDay == "true") {
            diff_days -= 0.5;
        }
        return (
            <Text style={{ paddingBottom: 5 }}>{diff_days}</Text>
        )
    }

    render() {
        const { navigation } = this.props;
        const { Loading, actionBar, leaveApprovalData } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Leave Approval</Text>
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
                    <View style={{ padding: 10, flexDirection: 'column', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                </Image>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Leave Approval</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                                </Image>
                            </View>
                        </View>
                    </View>

                    <ScrollView style={{ flexDirection: 'column' }} onMomentumScrollEnd={() => { this.addArray() }}>
                        {leaveApprovalData?.map((item, index) => {
                            return (
                                <View key={index.toString()}>
                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5, paddingLeft: 5 }}>Employee Name [Emp ID] - {item['EMPLOYEE_NAME']}[{item['EMPLOYEE_ID']}]</Text>
                                    <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Start Date:</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>End Date:</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Total Days:</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Status:</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Leave Type:</Text>
                                            <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Reason:</Text>
                                        </View>
                                        <View style={{ flex: 2, flexDirection: 'column' }}>
                                            <Text style={{ paddingBottom: 5 }}>{item['Date_Start']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Date_End']}</Text>
                                            <this.Total_days startDate={item['Date_Start']} endDate={item['Date_End']} halfDay={item['Half_Day']}></this.Total_days>
                                            <Text style={{ paddingBottom: 5 }}>{item['Leave_Status']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Leave_Type']}</Text>
                                            <Text style={{ paddingBottom: 5 }}>{item['Reason']}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            {item['Leave_Status'] == 'Approved' || item['Leave_Status'] == 'Rejected' ?
                                                null
                                                :
                                                <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateLeaveStatus(item['id'], index, 'Approved')}>
                                                    <Image source={require('@assets/images/ic_approval.png')} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                            }
                                            <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LeaveChat', { leave: item })}>
                                                <Image source={require('@assets/images/ic_chat.png')} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
                                            {item['Leave_Status'] == 'Approved' || item['Leave_Status'] == 'Rejected' ?
                                                null
                                                :
                                                <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateLeaveStatus(item['id'], index, 'Rejected')}>
                                                    <Image source={require('@assets/images/ic_reject.png')} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                            }
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

function LeaveApproval(props) {
    const t = useTranslation();
    return <LeaveApprovalClass lang={t} {...props} />
}
const mapStateToProps = ({ app }) => {
    return {
        notification_data: app.data
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
        localNotificationData: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaveApproval);