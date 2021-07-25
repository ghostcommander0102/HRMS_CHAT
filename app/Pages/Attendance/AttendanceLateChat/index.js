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
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import Toast from 'react-native-simple-toast';

class AttendanceLateChatClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            Loading: false,
            customerTitle: "",
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            receiverID: props.navigation.state.params.receiver,
            attendance_id: props.navigation.state.params.attendance_id,
            userID: "",
            messageData: [],
            textMessage: "",
            photo: "",
            type: "",
        }
        this.backHandler = null;
    }
    componentDidMount() {
        let self = this;
        console.log('-Attendance LateChat---', this.state.receiverID)
        SetPrefrence('page_name', 20);
        this.getHRMSAttendanceLateMessages();
        this.receiverMessage();
    }
    receiverMessage() {
        let self = this;
        const { receiverID } = this.state;
        messaging().onMessage(async remoteMessage => {
            if (self.props.navigation.isFocused()) {
                if (remoteMessage.data.TYPE == 20) {
                    if (remoteMessage.data.SENDER == receiverID) {
                        self.setState(state => {
                            const messageData = [...state.messageData, remoteMessage.data];
                            return {
                                ...self.state,
                                messageData
                            }
                        })
                    } else {
                        PushNotification.localNotificationSchedule({
                            userInfo: remoteMessage.data,
                            title: remoteMessage.notification.title,
                            message: remoteMessage.notification.body,
                            date: new Date(Date.now() + 1000) // within 10 secs
                        });
                    }
                }
            }
        });
        messaging().onNotificationOpenedApp(async remoteMessage => {
            if (self.props.navigation.isFocused()) {
                if (remoteMessage.data.TYPE == 5) {
                    self.setState({ receiverID: remoteMessage.data.SENDER })
                    self.setState({ attendance_id: remoteMessage.data.attendance_id })
                    self.getHRMSAttendanceLateMessages();
                } 
            }
        })
    }
    
    componentWillUnmount() {
        SetPrefrence('page_name', 1);
    }

    getHRMSAttendanceLateMessages() {
        this.setState({ Loading: true });
        const { employeeID, receiverID, attendance_id } = this.state;
        this.props.apiActions.getHRMSAttendanceLateMessages(employeeID, receiverID, attendance_id, (response) => {
            if(response.data){
                this.setState({ messageData: response.data });
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

    sendMessage() {
        this.setState({ Loading: true });
        this.props.apiActions.sendHRMSAttendanceLateMessage(this.state, (response) => {
            this.setState({ textMessage: "" })
            if (response?.data) {
                this.setState(state => {
                    const messageData = [...state.messageData, response.data];
                    return {
                        ...this.state,
                        messageData
                    }
                })
            }
            this.setState({ Loading: false });
        })
    }
    ReceiveMessage() {
        console.log("ReceiveMessage");
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
        const { Loading, messageData, employeeID } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Attendance Late Chat</Text>
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
                                            <TextInput editable={false} style={[styles.text_send]} multiline={true}>{message.MESSAGE}{"\n"}{message.DATE_CREATED}</TextInput>
                                        }
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={index.toString()} style={[styles.receiver, { flexDirection: "row" }]}>
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
                                            <TextInput editable={false} style={[styles.text_receive]} multiline={true}>{message.MESSAGE}{"\n"}{message.DATE_CREATED}</TextInput>
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

function AttendanceLateChat(props) {
    const t = useTranslation();
    return <AttendanceLateChatClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(AttendanceLateChat);