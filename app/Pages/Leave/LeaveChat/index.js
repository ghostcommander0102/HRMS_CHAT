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
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import Icons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import * as Utils from "@utils";
import Toast from 'react-native-simple-toast';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import AntDesign from 'react-native-vector-icons/AntDesign';
import DefaultPreference from 'react-native-default-preference';
import * as actionTypes from "@actions/actionTypes";

class LeaveChatClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            Loading: false,
            customerTitle: "",
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            userID: "",
            messageData: [],
            textMessage: "",
            photo: "",
            type: "",
            receiver: "",
            leaveManager: store.getState().auth.login.data.LEAVE_MANAGER,
            leaveID: props.navigation.state.params.leave['id'],
            EMPLOYEE_NAME: props.navigation.state.params.leave['EMPLOYEE_NAME'],
            Manager_NAME: props.navigation.state.params.leave['Manager_NAME'],
            Date_Start: props.navigation.state.params.leave['Date_Start'],
            Date_End: props.navigation.state.params.leave['Date_End'],
            Reason: props.navigation.state.params.leave['Reason'],
            EMPLOYEE_ID: props.navigation.state.params.leave['EMPLOYEE_ID'],
            msgID: '',
            newLeave: {},
        }
        this.backHandler = null;
    }

    shouldComponentUpdate(preprops, state) {
        if (preprops.navigation.state.params.leave) {
            if (preprops.navigation.state.params.leave['id'] != state.leaveID) {
                if (preprops.navigation.state.params.status == true) {
                    console.log('true');
                    state.leaveID = preprops.navigation.state.params.leave['id'];
                    this.setState({ newLeave: preprops.navigation.state.params.leave });
                    this.initNew();
                } else {
                    console.log('false');
                    PushNotification.localNotificationSchedule({
                        userInfo: preprops.navigation.state.params.leave,
                        title: preprops.navigation.state.params.title,
                        message: preprops.navigation.state.params.body,
                        date: new Date(Date.now()) // within 10 secs
                    });
                }
            } else if (preprops.navigation.state.params.leave['id'] == state.leaveID) {
                if (preprops.navigation.state.params.leave['ID'] != state.msgID) {
                    console.log('old');
                    if (preprops.navigation.state.params.leave['MESSAGE']) {
                        this.getHRMSLeaveMessageList();
                    }
                }
            }
        }
        return true;
    }

    componentDidMount() {
        this.listener = this.props.navigation.addListener("didFocus", this.init.bind(this));
        this.setState({ Loading: true });
        this.init();
        this.refreshStatus();
    }

    initNew() {
        const { newLeave } = this.state;
        if (newLeave) {
            this.setState({ leaveID: '' })
            this.setState({ EMPLOYEE_NAME: '' })
            this.setState({ Manager_NAME: '' })
            this.setState({ Date_Start: '' })
            this.setState({ Date_End: '' })
            this.setState({ Reason: '' })
            this.setState({ EMPLOYEE_ID: '' })
            this.setState({ receiver: '' })

            this.setState({ leaveID: newLeave['id'] })
            this.setState({ EMPLOYEE_NAME: newLeave['EMPLOYEE_NAME'] })
            this.setState({ Manager_NAME: newLeave['Manager_NAME'] })
            this.setState({ Date_Start: newLeave['Date_Start'] })
            this.setState({ Date_End: newLeave['Date_End'] })
            this.setState({ Reason: newLeave['Reason'] })
            this.setState({ EMPLOYEE_ID: newLeave['EMPLOYEE_ID'] })
            this.setState({ receiver: newLeave['SENDER'] })
            this.init();
        }
    }

    async init() {
        SetPrefrence('page_name', 8);
        const { employeeID, EMPLOYEE_ID, leaveManager } = this.state;
        if (this.state.receiver == "") {
            await this.setState({ receiver: EMPLOYEE_ID })
            if (employeeID == EMPLOYEE_ID) {
                await this.setState({ receiver: leaveManager })
            }
        }
        if (this.props.navigation.state.params.leave['SENDER']) {
            await this.setState({ receiver: this.props.navigation.state.params.leave['SENDER'] })
        }
        this.getHRMSLeaveMessageList();
        DefaultPreference.set("isTimer", "true");
        // if (this.timerHandle) {
        //     clearTimeout(this.timerHandle);      // ***
        // }
    }

    refreshStatus() {
        let self = this;
        const { employeeID, receiver, leaveID } = self.state;
        self.props.apiActions.refreshLeaveChat(employeeID, receiver, leaveID, (response) => {
            if (response.data) {
                if (response.data[0].count == 0) {
                    const { messageData } = self.state;
                    for (var i = 0; i < messageData.length; i++) {
                        messageData[i]['send_status'] = 1;
                        messageData[i]['receive_status'] = 1;
                    }
                    self.setState({ messageData });
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
        // DefaultPreference.get("isTimer").then(function (value) {
        //     let isTimer = value;
        //     if (isTimer == "false") {
        //         return;
        //     }
        //     self.timerHandle = setTimeout(() => {
        //         try {
        //             self.props.apiActions.refreshLeaveChat(employeeID, receiver, leaveID, (response) => {
        //                 if (response.data) {
        //                     if (response.data[0].count == 0) {
        //                         const { messageData } = self.state;
        //                         for (var i = 0; i < messageData.length; i++) {
        //                             messageData[i]['send_status'] = 1;
        //                             messageData[i]['receive_status'] = 1;
        //                         }
        //                         self.setState({ messageData });
        //                     }
        //                 }
        //             })
        //             self.refreshStatus();
        //         } catch (err) {

        //         }
        //     }, 5000);
        // })
    }

    getHRMSLeaveMessageList() {
        const { employeeID, leaveID, receiver } = this.state;
        this.props.apiActions.getHRMSLeaveMessageList(employeeID, receiver, leaveID, (response) => {
            this.setState({ Loading: false });
            if (response.data) {
                this.setState({ messageData: response.data });
                let len = response.data.length;
                this.setState({ msgID: response.data[len - 1]['id'] });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }

    componentWillUnmount() {
        DefaultPreference.set("isTimer", "false");
        SetPrefrence('page_name', 1);
        if (this.listener) {
            this.listener.remove();
        }
    }

    backAction() {
        if (this.props.navigation.isFocused()) {
            return false
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    sendMessage() {
        const { employeeID, leaveID, receiver, textMessage, photo, type } = this.state;
        const self = this;
        if (textMessage == '' && photo == '') {
            Toast.show(this.props.lang('message_fill_all_fields'))
            return;
        }
        // this.setState({ Loading: true })
        this.props.apiActions.sendHRMSLeaveMessage(employeeID, receiver, leaveID, textMessage, photo, type, (response) => {
            self.setState({ textMessage: '' })
            self.setState({ photo: "" })
            if (response?.data) {
                self.setState(state => {
                    const messageData = [...state.messageData, response.data];
                    return {
                        ...self.state,
                        messageData
                    }
                })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            // this.setState({ Loading: false })
        })
    }

    sendImage() {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (res) => {
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
            } else {
                this.setState({ photo: res.data });
                this.setState({ type: res.type });
                this.sendMessage();
            }
        });
    }

    render() {
        const { navigation } = this.props;
        const { Loading, messageData, employeeID, EMPLOYEE_NAME, Manager_NAME, Date_Start, Date_End, Reason } = this.state;
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
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => navigation.goBack()}>
                            <Icons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Leave Chat</Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Requestor :</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1.5 }}>
                                <Text>{EMPLOYEE_NAME}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Approver :</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1.5 }}>
                                <Text>{Manager_NAME}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Start Date :</Text>
                                <Text>{Date_Start}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>End Date :</Text>
                                <Text>{Date_End}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold', flex: 1 }}>Reason:</Text>
                            <Text style={{ flex: 5 }}>{Reason}</Text>
                        </View>
                    </View>
                    <ScrollView
                        ref={(view) => {
                            this.scrollView = view;
                        }}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.scrollView.scrollToEnd({ animated: true });
                        }}
                        style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                        {messageData?.map((message, index) => {
                            if (message.SENDER == employeeID) {
                                return (
                                    <View key={index.toString()} style={[styles.sender, { flexDirection: "row" }]}>
                                        {message.PHOTO
                                            ?
                                            <View style={[styles.msg_photo]}>
                                                <Image source={{ uri: `${global.SERVER_HOST}${message.PHOTO}` }} style={{ width: 198, height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}></Image>
                                                <Text style={{ fontSize: 12 }}>{message.DATE_CREATED}</Text>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'column', maxWidth: '70%', minWidth: '20%' }}>
                                                <TextInput editable={false} style={[styles.text_send]} multiline={true}>{message.MESSAGE}</TextInput>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 3 }}>
                                                    {message.send_status == 1 ?
                                                        <AntDesign name={'checkcircle'} size={14} color='green' />
                                                        : <AntDesign name={'checkcircle'} size={14} color='gray' />
                                                    }
                                                    {message.receive_status == 1 ?
                                                        <AntDesign name={'checkcircle'} size={14} color='green' />
                                                        : <AntDesign name={'checkcircle'} size={14} color='gray' />
                                                    }
                                                    <Text >{message.DATE_CREATED}</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={[styles.receiver, { flexDirection: "row" }]} key={index.toString()}>
                                        {message.SENDER_PHOTO
                                            ?
                                            <Image source={{ uri: message.SENDER_PHOTO }} style={[styles.avatar_receive]}></Image>
                                            :
                                            <Image source={require('@assets/images/ic_empty_user.png')} style={[styles.avatar_receive]}></Image>
                                        }
                                        {message.PHOTO
                                            ?
                                            <View style={[styles.msg_photo]}>
                                                <Image source={{ uri: `${global.SERVER_HOST}${message.PHOTO}` }} style={{ width: 198, height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}></Image>
                                                <Text style={{ fontSize: 12 }}>{message.DATE_CREATED}</Text>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'column', maxWidth: '70%', minWidth: '20%' }}>
                                                <TextInput editable={false} style={[styles.text_receive]} multiline={true}>{message.MESSAGE}</TextInput>
                                                <Text>{message.DATE_CREATED}</Text>
                                            </View>
                                        }
                                    </View>
                                )
                            }
                        })}
                    </ScrollView>
                    <View style={{ justifyContent: 'flex-end', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            onChangeText={(value) => { this.setState({ textMessage: value }) }}
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                paddingLeft: 5,
                                flex: 3,
                                fontSize: 22,
                                height: 50,
                            }}
                            multiline={true}
                            value={this.state.textMessage}
                            placeholder="Type your message">
                        </TextInput>
                        <TouchableOpacity style={{ margin: 2 }} onPress={() => this.sendImage()}>
                            <Icons name={'camera-alt'} size={40} color='gray' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.sendMessage()} style={{ margin: 2 }}>
                            <Icons name={'send'} size={40} color='black' />
                        </TouchableOpacity>
                    </View>
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

function LeaveChat(props) {
    const t = useTranslation();
    return <LeaveChatClass lang={t} {...props} />
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

export default connect(null, mapDispatchToProps)(LeaveChat);