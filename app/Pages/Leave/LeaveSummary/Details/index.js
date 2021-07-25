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
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';

class DetailsClass extends Component {

    constructor(props) {
        super(props);
        const screenWidth = Math.round(Dimensions.get('window').width);
        this.state = {
            width: screenWidth - 170,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            leaveType: props.navigation.state.params.leaveType,
            summaryDetailsData: []
        }
        this.backHandler = null;
    }

    componentDidMount() {
        SetPrefrence('page_name', 1);
        this.setState({ Loading: true });
        this.getHRMSLeaveSummaryDetailList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }
    getHRMSLeaveSummaryDetailList() {
        const { employeeID, leaveType } = this.state;
        this.props.apiActions.getHRMSLeaveSummaryDetailList(employeeID, leaveType, (response) => {
            if (response.data) {
                this.setState({ summaryDetailsData: response.data })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }
    deleteHRMSLeaveSummaryDetail(leaveID, status, index) {
        if (status != 'Pending') {
            Toast.show(this.props.lang('message_failed_delete_pending'));
            return;
        }
        const { employeeID } = this.state;
        this.setState({ Loading: true })
        this.props.apiActions.deleteHRMSLeaveSummaryDetail(employeeID, leaveID, (response) => {
            if (response.data) {
                Toast.show('Success');
                var array = [...this.state.summaryDetailsData]; // make a separate copy of the array
                array.splice(index, 1);
                this.setState({ summaryDetailsData: array });
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
        const { Loading, summaryDetailsData, leaveType } = this.state;
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
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Leave Summary Details-{leaveType}</Text>
                    </View>
                    <ScrollView style={{ flexDirection: 'column' }}>
                        {summaryDetailsData?.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 0.5 }}>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Start Date:</Text>
                                        <Text style={{ fontWeight: 'bold' }}>End Date:</Text>
                                        <Text style={{ fontWeight: 'bold' }}>Total Days</Text>
                                        <Text style={{ fontWeight: 'bold' }}>Status:</Text>
                                        <Text style={{ fontWeight: 'bold' }}>Reason:</Text>
                                    </View>
                                    <View style={{ flex: 2, flexDirection: 'column' }}>
                                        <Text>{item['Date_Start']}</Text>
                                        <Text>{item['Date_End']}</Text>
                                        <this.Total_days startDate={item['Date_Start']} endDate={item['Date_End']} halfDay={item['Half_Day']}></this.Total_days>
                                        <Text>{item['Leave_Status']}</Text>
                                        <Text>{item['Reason']}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={{ width: 20, height: 28, flex: 1, justifyContent: 'center' }} onPress={() => { this.deleteHRMSLeaveSummaryDetail(item['id'], item['Leave_Status']), index }}>
                                            <Image source={require('@assets/images/ic_trash.png')} style={{ width: 22, height: 30 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('LeaveChat', { leave: item })}>
                                            <Image source={require('@assets/images/ic_chat.png')} style={{ width: 30, height: 30 }} />
                                        </TouchableOpacity>
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

function Details(props) {
    const t = useTranslation();
    return <DetailsClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(Details);