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

class TimeOffChatClass extends Component {

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
            timeOffManager: store.getState().auth.login.data.TIMEOFF_MANAGER,
            timeoffID: props.navigation.state.params.timeOff['id'],
            Timeoff_Title: props.navigation.state.params.timeOff['Timeoff_Title'],
            timeoff_Date: props.navigation.state.params.timeOff['Date'],
            timeoff_Type: props.navigation.state.params.timeOff['Type'],
            startHour: props.navigation.state.params.timeOff['StartHour'],
            endHour: props.navigation.state.params.timeOff['EndHour'],
            description: props.navigation.state.params.timeOff['DESCRIPTION'],
            EMPLOYEE_ID: props.navigation.state.params.timeOff['EMPLOYEE_ID'],
            EMPLOYEE_NAME: props.navigation.state.params.timeOff['EMPLOYEE_NAME'],
            msgID: "",
            newTimeoff: {},
        }
        this.backHandler = null;
    }

    shouldComponentUpdate(preprops, state) {
        if (preprops.navigation.state.params.timeOff) {
            if (preprops.navigation.state.params.timeOff['id'] != state.timeoffID) {
                if (preprops.navigation.state.params.status == true) {
                    console.log('ddddd');
                    state.timeoffID = preprops.navigation.state.params.timeOff['id'];
                    this.setState({ newTimeoff: preprops.navigation.state.params.timeOff });
                    this.initNew();
                } else {
                    PushNotification.localNotificationSchedule({
                        userInfo: preprops.navigation.state.params.timeOff,
                        title: preprops.navigation.state.params.title,
                        message: preprops.navigation.state.params.body, // (required)
                        date: new Date(Date.now() + 1000) // within 10 secs
                    });
                }
            } else if (preprops.navigation.state.params.timeOff['id'] == state.timeoffID) {
                if (preprops.navigation.state.params.timeOff['ID'] != state.msgID) {
                    if (preprops.navigation.state.params.timeOff['MESSAGE']) {
                        this.getHRMSTimeOffMessageList();
                    }
                }
            }
        }
        return true;
    }
    initNew() {
        const { newTimeoff } = this.state;
        if (newTimeoff) {
            this.setState({ timeoffID: '' })
            this.setState({ Timeoff_Title: '' })
            this.setState({ timeoff_Date: '' })
            this.setState({ timeoff_Type: '' })
            this.setState({ startHour: '' })
            this.setState({ endHour: '' })
            this.setState({ description: '' })
            this.setState({ EMPLOYEE_ID: '' })
            this.setState({ EMPLOYEE_NAME: '' })

            this.setState({ timeoffID: newTimeoff['id'] })
            this.setState({ Timeoff_Title: newTimeoff['Timeoff_Title'] })
            this.setState({ timeoff_Date: newTimeoff['Date'] })
            this.setState({ timeoff_Type: newTimeoff['Type'] })
            this.setState({ startHour: newTimeoff['StartHour'] })
            this.setState({ endHour: newTimeoff['EndHour'] })
            this.setState({ description: newTimeoff['DESCRIPTION'] })
            this.setState({ EMPLOYEE_ID: newTimeoff['EMPLOYEE_ID'] })
            this.setState({ EMPLOYEE_NAME: newTimeoff['EMPLOYEE_NAME'] })
            this.init();
        }
    }
    async init() {
        SetPrefrence('page_name', 14);
        const { employeeID, EMPLOYEE_ID, timeOffManager } = this.state
        if (this.state.receiver == "") {
            await this.setState({ receiver: EMPLOYEE_ID })
            if (employeeID == EMPLOYEE_ID) {
                await this.setState({ receiver: timeOffManager })
            }
        }
        if (this.props.navigation.state.params.timeOff['SENDER']) {
            await this.setState({ receiver: this.props.navigation.state.params.timeOff['SENDER'] })
        }
        this.getHRMSTimeOffMessageList();
        DefaultPreference.set("isTimer", "true");
    }
    async componentDidMount() {
        this.listener = this.props.navigation.addListener("didFocus", this.init.bind(this));
        this.setState({ Loading: true });
        this.init();
        this.refreshStatus();
    }

    refreshStatus() {
        let self = this;
        const { employeeID, receiver, timeoffID } = self.state;
        self.props.apiActions.refreshTimeoffChat(employeeID, receiver, timeoffID, (response) => {
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
        //             self.props.apiActions.refreshTimeoffChat(employeeID, receiver, timeoffID, (response) => {
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

    getHRMSTimeOffMessageList() {
        const { employeeID, timeoffID, receiver } = this.state;
        this.props.apiActions.getHRMSTimeOffMessageList(employeeID, receiver, timeoffID, (response) => {
            this.setState({ Loading: false });
            if(response.data){
                this.setState({ messageData: response.data });
                let len = response.data.length;
                this.setState({ msgID: response.data[len - 1]['id'] });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }

    async componentWillUnmount() {
        DefaultPreference.set("isTimer", "false");
        SetPrefrence('page_name', 1);
        if(this.listener){
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
        const { employeeID, timeoffID, receiver, textMessage, photo, type } = this.state;
        const self = this;
        if (textMessage == '' && photo == '') {
            Toast.show(this.props.lang('message_fill_all_fields'))
            return
        }
        this.setState({ Loading: true })
        this.props.apiActions.sendHRMSTimeOffMessage(employeeID, receiver, timeoffID, textMessage, photo, type, (response) => {
            self.setState({ textMessage: '' })
            self.setState({ photo: "" })
            console.log(response.data);
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
            this.setState({ Loading: false })
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
        const { Loading, messageData, employeeID, EMPLOYEE_NAME, Timeoff_Title, timeoff_Date, startHour, endHour, description, timeoff_Type } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Gate Pass Chat</Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', flex: 1 }}>Employee :</Text>
                                <Text style={{ flex: 1.2 }}>{EMPLOYEE_NAME}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Title :</Text>
                                <Text>{Timeoff_Title}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Type :</Text>
                                <Text>{timeoff_Type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Date :</Text>
                                <Text>{timeoff_Date}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Start Date :</Text>
                                <Text>{startHour}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>End Date :</Text>
                                <Text>{endHour}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <Text style={{ fontWeight: 'bold', flex: 2.5 }}>Justification:</Text>
                            <Text style={{ flex: 7 }}>{description}</Text>
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

function TimeOffChat(props) {
    const t = useTranslation();
    return <TimeOffChatClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOffChat);