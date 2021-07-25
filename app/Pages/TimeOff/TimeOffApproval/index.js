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
import { round } from 'react-native-reanimated';
import Toast from 'react-native-simple-toast';
import PushNotification from "react-native-push-notification";

class TimeOffApprovalClass extends Component {

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
            totalLeaveApprovalData: [],
            timeOff: props.navigation.state.params.timeOff,
            timeoff_month_statistics: [],
            timeoff_year_statistics: [],
            showDashboard: false,
        }
        this.backHandler = null;
    }

    componentDidMount() {
        SetPrefrence('page_name', 1);
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.loadDashboardData()
    }

    loadDashboardData() {
        const { timeOff } = this.state;
        this.props.apiActions.loadDashboardData(timeOff['EMPLOYEE_ID'], timeOff['id'], (response) => {
            if (response.data) {
                this.setState({ timeoff_month_statistics: response.data.timeoff_month_statistics })
                this.setState({ timeoff_year_statistics: response.data.timeoff_year_statistics })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    updateHRMSTimeOffStatus(status) {
        const { timeOff } = this.state;
        this.setState({ Loading: true })

        this.props.apiActions.updateHRMSTimeOffStatus(timeOff['id'], status, (response) => {
            if (response.data) {
                if (response.data.message) {
                    Toast.show(response.data.message);
                } else {
                    timeOff['STATUS'] = status;
                    this.setState(timeOff);
                    Toast.show(this.props.lang('string_success'));
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
        const { Loading, actionBar, timeOff, timeoff_month_statistics, timeoff_year_statistics, showDashboard } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: BaseColor.colorBlueLighter }}>
                {Loading == true
                    ?
                    <View style={{ height: "100%", width: "100%", opacity: 0.3, position: 'absolute', zIndex: 1000 }}></View>
                    :
                    null
                }
                {actionBar == true
                    ?
                    <TouchableWithoutFeedback onPress={() => { this.setState({ actionBar: false }) }}>
                        <View style={{ height: "100%", width: "100%", opacity: 0.3, position: 'absolute', zIndex: 50 }}>
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    null
                }
                <View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Gate Pass Approval</Text>
                </View>
                <View style={{ padding: 10, flexDirection: 'column', paddingTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                            </Image>
                        </View>
                        <View style={{ flex: 2.5 }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Gate Pass Approval Listing</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                            </Image>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Employee:</Text>
                            <Text>{timeOff['EMPLOYEE_NAME']}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Title:</Text>
                            <Text>{timeOff['Timeoff_Title']}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>Type:</Text>
                                <Text>{timeOff['Type']}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>Date:</Text>
                                <Text>{timeOff['Date']}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>Start Time:</Text>
                                <Text>{timeOff['StartHour']}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>End Time:</Text>
                                <Text>{timeOff['EndHour']}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Justification:</Text>
                            <Text>{timeOff['DESCRIPTION']}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Dashboard:</Text>
                            <TouchableOpacity onPress={() => { this.setState({ showDashboard: !showDashboard }) }}>
                                <Image source={require('@assets/images/ic_question.png')} style={{ width: 20, height: 20 }}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {showDashboard == true
                    ?
                    <>
                        <View style={{ flexDirection: 'column', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Present Month</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>Category</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>No. of Time</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>Total Hours</Text>
                            </View>
                            {timeoff_month_statistics?.map((item, index) => {
                                return (
                                    <View key={index.toString()} style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{item['category']}</Text>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{item['times']}</Text>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{parseFloat(item['total_hours']).toFixed(2)}</Text>
                                    </View>
                                )
                            })}

                        </View>
                        <View style={{ flexDirection: 'column', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Present Year</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>Category</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>No. of Time</Text>
                                <Text style={{ flex: 1, fontWeight: 'bold', backgroundColor: BaseColor.btnColor, color: 'white', padding: 3 }}>Total Hours</Text>
                            </View>
                            {timeoff_year_statistics?.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row' }} key={index.toString()}>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{item['category']}</Text>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{item['times']}</Text>
                                        <Text style={{ flex: 1, borderWidth: 0.5, padding: 3 }}>{parseFloat(item['total_hours']).toFixed(2)}</Text>
                                    </View>
                                )
                            })}

                        </View>
                    </>
                    :
                    null}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {timeOff['STATUS'] == 'Pending' ?
                        <>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("TimeOffChat", { timeOff: timeOff })}>
                                <Text style={[styles.btnStyles]}>Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.updateHRMSTimeOffStatus("Rejected")}>
                                <Text style={[styles.btnStyles]}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.updateHRMSTimeOffStatus("Approved")}>
                                <Text style={[styles.btnStyles]}>Approve</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <TouchableOpacity style={{ width: '50%' }} onPress={() => this.props.navigation.navigate("TimeOffChat", { timeOff: timeOff })}>
                            <Text style={[styles.btnStyles]}>Chat</Text>
                        </TouchableOpacity>
                    }

                </View>
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

function TimeOffApproval(props) {
    const t = useTranslation();
    return <TimeOffApprovalClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOffApproval);