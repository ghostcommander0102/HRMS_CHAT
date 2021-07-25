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
import AntDesign from 'react-native-vector-icons/AntDesign';
import DefaultPreference from 'react-native-default-preference';
import Toast from 'react-native-simple-toast';

class ClaimChatClass extends Component {

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
            claimID: props.navigation.state.params.Claim['id'],
            claim_employee_id: props.navigation.state.params.Claim['EMPLOYEE_ID'],
            Travel_Title: props.navigation.state.params.Claim['Travel_Title'],
            EMPLOYEE_NAME: props.navigation.state.params.Claim['EMPLOYEE_NAME'],
            project_name: props.navigation.state.params.Claim['project_name'],
            project_type: props.navigation.state.params.Claim['project_type'],
            Type: props.navigation.state.params.Claim['Type'],
            contact: props.navigation.state.params.Claim['contact'],
            Country: props.navigation.state.params.Claim['Country'],
            Date_Start: props.navigation.state.params.Claim['Date_Start'],
            Date_End: props.navigation.state.params.Claim['Date_End'],
            DESCRIPTION: props.navigation.state.params.Claim['DESCRIPTION'],
            receiver: '',
            claimManager: store.getState().auth.login.data.CLAIM_MANAGER,
            newClaim: {},
            msgID: "",
        }
        this.backHandler = null;
    }
    shouldComponentUpdate(preprops, state) {
        if (preprops.navigation.state.params.Claim) {
            if (preprops.navigation.state.params.Claim['id'] != state.claimID) {
                if (preprops.navigation.state.params.status == true) {
                    console.log('1');
                    state.claimID = preprops.navigation.state.params.Claim['id'];
                    this.setState({ newClaim: preprops.navigation.state.params.Claim });
                    this.initNew();
                } else {
                    console.log('2');
                    PushNotification.localNotificationSchedule({
                        userInfo: remoteMessage.data,
                        title: remoteMessage.notification.title,
                        message: remoteMessage.notification.body,
                        date: new Date(Date.now() + 1000) // within 10 secs
                    });
                }
            } else if (preprops.navigation.state.params.Claim['id'] == state.claimID) {
                if (preprops.navigation.state.params.Claim['ID'] != state.msgID) {
                    if (preprops.navigation.state.params.Claim['MESSAGE']) {
                        console.log('3');
                        this.getHRMSClaimMessageList();
                    }
                }
            }
        }
        return true;
    }

    initNew() {
        const { newClaim } = this.state;
        if (newClaim) {
            this.setState({ claimID: '' })
            this.setState({ claim_employee_id: '' })
            this.setState({ Travel_Title: '' })
            this.setState({ EMPLOYEE_NAME: '' })
            this.setState({ project_name: '' })
            this.setState({ project_type: '' })
            this.setState({ Type: '' })
            this.setState({ contact: '' })
            this.setState({ Country: '' })
            this.setState({ Date_Start: '' })
            this.setState({ Date_End: '' })
            this.setState({ DESCRIPTION: '' })
            this.setState({ receiver: '' })

            this.setState({ claimID: newClaim['id'] })
            this.setState({ claim_employee_id: newClaim['EMPLOYEE_ID'] })
            this.setState({ Travel_Title: newClaim['Travel_Title'] })
            this.setState({ EMPLOYEE_NAME: newClaim['EMPLOYEE_NAME'] })
            this.setState({ project_name: newClaim['project_name'] })
            this.setState({ project_type: newClaim['project_type'] })
            this.setState({ Type: newClaim['Type'] })
            this.setState({ contact: newClaim['contact'] })
            this.setState({ Country: newClaim['Country'] })
            this.setState({ Date_Start: newClaim['Date_Start'] })
            this.setState({ Date_End: newClaim['Date_End'] })
            this.setState({ DESCRIPTION: newClaim['DESCRIPTION'] })
            this.setState({ receiver: newClaim['SENDER'] })
            this.init();
        }
    }
    async init() {
        await SetPrefrence('page_name', 11);
        const { employeeID, claim_employee_id, claimManager } = this.state
        if (this.state.receiver == "") {
            await this.setState({ receiver: claim_employee_id })
            if (employeeID == claim_employee_id) {
                await this.setState({ receiver: claimManager })
            }
        }
        if (this.props.navigation.state.params.Claim['SENDER']) {
            await this.setState({ receiver: this.props.navigation.state.params.Claim['SENDER'] })
        }
        this.getHRMSClaimMessageList();
        DefaultPreference.set("isTimer", "true");
        // if (this.timerHandle) {
        //     clearTimeout(this.timerHandle);      // ***
        // }
    }
    componentDidMount() {
        this.listener = this.props.navigation.addListener("didFocus", this.init.bind(this));
        this.setState({ Loading: true });
        this.init();
        this.refreshStatus();
    }

    refreshStatus() {
        let self = this;
        const { employeeID, receiver, claimID } = self.state;
        self.props.apiActions.refreshClaimChat(employeeID, receiver, claimID, (response) => {
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
        //     DefaultPreference.get("isTimer").then(function (value) {
        //     let isTimer = value;
        //     if (isTimer == "false") {
        //         return;
        //     }
        //     self.timerHandle = setTimeout(() => {
        //         try {
        //             self.props.apiActions.refreshClaimChat(employeeID, receiver, claimID, (response) => {
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

    getHRMSClaimMessageList() {
        const { employeeID, claimID, receiver } = this.state;
        this.props.apiActions.getHRMSClaimMessageList(employeeID, receiver, claimID, (response) => {
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
        const { employeeID, claimID, receiver, textMessage, photo, type } = this.state;

        if (textMessage == '' && photo == '') {
            Toast.show(this.props.lang('message_fill_all_fields'))
            return
        }
        this.setState({ Loading: true });
        this.props.apiActions.sendHRMSClaimMessage(employeeID, receiver, claimID, textMessage, photo, type, (response) => {
            this.setState({ textMessage: '' })
            this.setState({ photo: "" })
            if (response?.data) {
                this.setState(state => {
                    const messageData = [...state.messageData, response.data];
                    return {
                        ...this.state,
                        messageData
                    }
                })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
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
        const { Travel_Title, EMPLOYEE_NAME, project_name, project_type, Type, contact, Country, Date_Start, Date_End, DESCRIPTION } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Claim Module - Chat</Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderBottomWidth: 0.5 }}>
                        <View style={{ padding: 5 }}>
                            <View style={{ flexDirection: 'row', margin: 3 }}>
                                <Text style={{ fontWeight: 'bold' }}>Title:</Text>
                                <Text style={{}}>{Travel_Title}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 3 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Claim Type:</Text>
                                    <Text style={{}}>{Type}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Country:</Text>
                                    <Text style={{}}>{Country}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 3 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Start Date:</Text>
                                    <Text style={{}}>{Date_Start}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>End Date:</Text>
                                    <Text style={{}}>{Date_End}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 3 }}>
                                <Text style={{ fontWeight: 'bold', flex: 1.5 }}>Justification:</Text>
                                <Text style={{ flex: 4 }}>{DESCRIPTION}</Text>
                            </View>
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

function ClaimChat(props) {
    const t = useTranslation();
    return <ClaimChatClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(ClaimChat);