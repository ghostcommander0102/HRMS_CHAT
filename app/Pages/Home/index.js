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
	Platform,
	ActivityIndicator,
	AppRegistry
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import messaging from '@react-native-firebase/messaging';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import Icons from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNotification from "react-native-push-notification";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import NetInfo from '@react-native-community/netinfo'
import Toast from 'react-native-simple-toast';

class HomeClass extends Component {
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
			dialogVisible: false,
			Loading: false,
			customerTitle: "",
			email_address: store.getState().auth.login.data.EMAIL_ADDRESS,
			employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
			width: screenWidth - 110,
			actionBar: false,
			claim_pending_count: 0,
			leave_pending_count: 0,
			letter_pending_count: 0,
			timeoff_pending_count: 0,
			netStatus: false,
		}
		this.backHandler = null;
	}
	componentDidMount() {
		const self = this;
		SetPrefrence('page_name', 1);
		this.listener = this.props.navigation.addListener("didFocus", this.getLTCLPendingList.bind(this));
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
		this.unsubscribe = NetInfo.addEventListener(state => {
			if (!state.isConnected) {
				Toast.show("Maybe network connection has failed.");
				return;
			}
		});
		const { email_address } = this.state;
		this.props.apiActions.getCustomerTitle((response) => {
			this.setState({ customerTitle: response.data })
		})
		this.requestUserPermission();
		this.getLTCLPendingList();
		this.initPushNotification();

	}
	async requestUserPermission() {
		const authStatus = await messaging().requestPermission();

		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			console.log('Authorization status:', authStatus);
		}
	}
	getLTCLPendingList() {
		const { employeeID } = this.state;
		this.props.apiActions.getLTCLPendingList(employeeID, (response) => {
			if (response.data) {
				this.setState({ claim_pending_count: response.data.claim_pending_count });
				this.setState({ leave_pending_count: response.data.leave_pending_count });
				this.setState({ letter_pending_count: response.data.letter_pending_count });
				this.setState({ timeoff_pending_count: response.data.timeoff_pending_count });
			} else if (response.success) {
				Toast.show("Maybe network connection has failed.");
			}
		})
	}

	init() {
		this.getLTCLPendingList.bind();
		this.initPushNotification();
	}

	async initPushNotification() {
		let self = this;
		let messageID = "";
		messaging()
			.getToken()
			.then(token => {
				SetPrefrence('device_token', token);
				self.props.AuthActions.device_token(Platform.OS);
			});
		this.notificationListener = messaging().onMessage(async remoteMessage => {
			let page = await GetPrefrence('page_name');
			console.log(page);
			console.log(remoteMessage.messageId);
			if (remoteMessage.messageId) {
				if (messageID == remoteMessage.messageId) {
					return;
				}
				messageID = remoteMessage.messageId;
			}
			if (page == 1) {
				PushNotification.localNotificationSchedule({
					userInfo: remoteMessage.data,
					title: remoteMessage.notification.title,
					message: remoteMessage.notification.body,
					date: new Date(Date.now()) // within 10 secs
				});
			} else {
				if (remoteMessage.data.TYPE == 3) {
					if (page == 3) {
						return;
					} else {
						PushNotification.localNotificationSchedule({
							userInfo: remoteMessage.data,
							title: remoteMessage.notification.title,
							message: remoteMessage.notification.body,
							date: new Date(Date.now()) // within 10 secs
						});
					}
				} else if (remoteMessage.data.TYPE == 5 || remoteMessage.data.TYPE == 20) {
					if (page == 20) {
						return;
					} else {
						PushNotification.localNotificationSchedule({
							userInfo: remoteMessage.data,
							title: remoteMessage.notification.title,
							message: remoteMessage.notification.body,
							date: new Date(Date.now()) // within 10 secs
						});
					}
				} else if (remoteMessage.data.TYPE == 11 || remoteMessage.data.TYPE == 23) {
					if (page == 11) {
						if (self.state.employeeID == remoteMessage.data.SENDER) {
							PushNotification.localNotificationSchedule({
								userInfo: remoteMessage.data,
								title: remoteMessage.notification.title,
								message: remoteMessage.notification.body,
								date: new Date(Date.now()) // within 10 secs
							});
						}
					} else {
						PushNotification.localNotificationSchedule({
							userInfo: remoteMessage.data,
							title: remoteMessage.notification.title,
							message: remoteMessage.notification.body,
							date: new Date(Date.now()) // within 10 secs
						});
					}
				} else if (remoteMessage.data.TYPE == 8 || remoteMessage.data.TYPE == 21) {
					console.log('leaveChat');
					if (page == 8) {
						console.log('leaveChat');
						if (self.state.employeeID == remoteMessage.data.SENDER) {
							PushNotification.localNotificationSchedule({
								userInfo: remoteMessage.data,
								title: remoteMessage.notification.title,
								message: remoteMessage.notification.body,
								date: new Date(Date.now()) // within 10 secs
							});
						}
					} else {
						PushNotification.localNotificationSchedule({
							userInfo: remoteMessage.data,
							title: remoteMessage.notification.title,
							message: remoteMessage.notification.body,
							date: new Date(Date.now()) // within 10 secs
						});
					}
				} else if (remoteMessage.data.TYPE == 14 || remoteMessage.data.TYPE == 22) {
					if (page == 14) {
						if (self.state.employeeID == remoteMessage.data.SENDER) {
							PushNotification.localNotificationSchedule({
								userInfo: remoteMessage.data,
								title: remoteMessage.notification.title,
								message: remoteMessage.notification.body,
								date: new Date(Date.now()) // within 10 secs
							});
						}
					} else {
						PushNotification.localNotificationSchedule({
							userInfo: remoteMessage.data,
							title: remoteMessage.notification.title,
							message: remoteMessage.notification.body,
							date: new Date(Date.now()) // within 10 secs
						});
					}
				} else {
					PushNotification.localNotificationSchedule({
						userInfo: remoteMessage.data,
						title: remoteMessage.notification.title,
						message: remoteMessage.notification.body,
						date: new Date(Date.now()) // within 10 secs
					});
				}
			}

		});
		messaging().setBackgroundMessageHandler(async remoteMessage => {
			console.log('background');
		})
		messaging()
			.getInitialNotification()
			.then(async remoteMessage => {

			});
		messaging().onNotificationOpenedApp(async remoteMessage => {
			console.log(remoteMessage);
		});
		PushNotification.configure({
			senderID: 59400956304,
			onNotification: async function (notification) {
				let page = await GetPrefrence('page_name');
				if (page == 1) {
					if (notification.userInteraction == true) {
						if (notification.data.TYPE == 3) {
							self.props.navigation.navigate('AttendanceChat');
						} else if (notification.data.TYPE == 5) {
							self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: notification.data.attendance_id });
						} else if (notification.data.TYPE == 20) {
							self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: 0 });
						} else if (notification.data.TYPE == 11 || notification.data.TYPE == 23) {
							console.log('ClaimChat')
							self.props.navigation.navigate('ClaimChat', { Claim: notification.data, status: notification.userInteraction });
						} else if (notification.data.TYPE == 8 || notification.data.TYPE == 21) {
							console.log('leaveChat')
							self.props.navigation.navigate('LeaveChat', { leave: notification.data, status: notification.userInteraction });
						} else if (notification.data.TYPE == 6) {
							self.props.navigation.navigate('LeaveApproval');
						} else if (notification.data.TYPE == 9 || notification.data.TYPE == 7) {
							self.props.navigation.navigate('Leave', { leave: notification.data });
						} else if (notification.data.TYPE == 14 || notification.data.TYPE == 22) {
							self.props.navigation.navigate('TimeOffChat', { timeOff: notification.data, status: notification.userInteraction });
						} else if (notification.data.TYPE == 10) {
							self.props.navigation.navigate('ClaimApproval', { Claim: notification.data });
						} else if (notification.data.TYPE == 12) {
							self.props.navigation.navigate('ClaimSummary', { Claim: notification.data });
						} else if (notification.data.TYPE == 15) {
							self.props.navigation.navigate('TimeOff', { timeOff: notification.data });
						} else if (notification.data.TYPE == 13) {
							self.props.navigation.navigate('TimeOffApproval', { timeOff: notification.data });
						}
					}
				} else {
					if (notification.data.TYPE == 3) {
						if (page == 3) {
							return;
						}
						else if (notification.userInteraction == true) {
							self.props.navigation.navigate('AttendanceChat');
						}
					} else if (notification.data.TYPE == 5) {
						if (page == 20) {
							return;
						}
						else if (notification.userInteraction == true) {
							self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: notification.data.attendance_id });
						}
					} else if (notification.data.TYPE == 20) {
						if (page == 20) {
							return;
						}
						else if (notification.userInteraction == true) {
							self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: 0 });
						}
					} else if (notification.data.TYPE == 11 || notification.data.TYPE == 23) {
						if (page == 11) {
							if (self.state.employeeID == notification.data['SENDER'] && notification.userInteraction == false) {
								return;
							} else {
								self.props.navigation.navigate('ClaimChat', { Claim: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
							}
						} else if (notification.userInteraction == true) {
							self.props.navigation.navigate('ClaimChat', { Claim: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
						}

					} else if (notification.data.TYPE == 8 || notification.data.TYPE == 21) {
						if (page == 8) {
							if (self.state.employeeID == notification.data['SENDER'] && notification.userInteraction == false) {
								return;
							} else {
								self.props.navigation.navigate('LeaveChat', { leave: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
							}
						} else if (notification.userInteraction == true) {
							self.props.navigation.navigate('LeaveChat', { leave: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
						}
					} else if (notification.data.TYPE == 14 || notification.data.TYPE == 22) {
						if (page == 14) {
							if (self.state.employeeID == notification.data['SENDER'] && notification.userInteraction == false) {
								return;
							} else {
								self.props.navigation.navigate('TimeOffChat', { timeOff: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
							}
						} else if (notification.userInteraction == true) {
							self.props.navigation.navigate('TimeOffChat', { timeOff: notification.data, status: notification.userInteraction, title: notification.title, body: notification.message });
						}
					} else {
						if (notification.userInteraction == true) {
							if (notification.data.TYPE == 3) {
								self.props.navigation.navigate('AttendanceChat');
							} else if (notification.data.TYPE == 5) {
								self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: notification.data.attendance_id });
							} else if (notification.data.TYPE == 20) {
								self.props.navigation.navigate('AttendanceLateChat', { receiver: notification.data.SENDER, attendance_id: 0 });
							} else if (notification.data.TYPE == 11 || notification.data.TYPE == 23) {
								self.props.navigation.navigate('ClaimChat', { Claim: notification.data });
							} else if (notification.data.TYPE == 8 || notification.data.TYPE == 21) {
								self.props.navigation.navigate('LeaveChat', { leave: notification.data });
							} else if (notification.data.TYPE == 6) {
								self.props.navigation.navigate('LeaveApproval');
							} else if (notification.data.TYPE == 9 || notification.data.TYPE == 7) {
								self.props.navigation.navigate('Leave', { leave: notification.data });
							} else if (notification.data.TYPE == 14 || notification.data.TYPE == 22) {
								self.props.navigation.navigate('TimeOffChat', { timeOff: notification.data });
							} else if (notification.data.TYPE == 10) {
								self.props.navigation.navigate('ClaimApproval', { Claim: notification.data });
							} else if (notification.data.TYPE == 12) {
								self.props.navigation.navigate('ClaimSummary', { Claim: notification.data });
							} else if (notification.data.TYPE == 15) {
								self.props.navigation.navigate('TimeOff', { timeOff: notification.data });
							} else if (notification.data.TYPE == 13) {
								self.props.navigation.navigate('TimeOffApproval', { timeOff: notification.data });
							}
						}
					}
				}
				//notification.finish(PushNotificationIOS.FetchResult.NoData);
			},
			onAction: function (notification) {
				console.log("action", notification);
				// console.log("ACTION:", notification.action);
				// console.log("NOTIFICATION:", notification);
			},
			onRegistrationError: function (err) {
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});
	}

	componentWillUnmount() {
		if (this.backHandler)
			this.backHandler.remove();
		if (this.listener)
			this.listener.remove();
		if (this.notificationListener) {
			this.notificationListener();
		}
		if (this.unsubscribe) this.unsubscribe()
	}

	backAction() {
		if (this.props.navigation.isFocused()) {
			BackHandler.exitApp()
		}
	}

	hideDialog() {
		this.setState({ dialogVisible: false })
	}

	LogOut() {
		this.props.AuthActions.remove_token(Platform.OS, (response) => {
			if (response.success) {
				this.props.navigation.navigate("Loading");
			} else {
			}
		});
	}

	render() {
		const { navigation } = this.props;
		const { actionBar, claim_pending_count, timeoff_pending_count, leave_pending_count, letter_pending_count } = this.state;
		return (
			<SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: BaseColor.backgroundColor }}>
				<View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, alignItems: 'center', flexDirection: 'row' }}>
					<Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold', flex: 8 }}>{this.state.customerTitle}</Text>
					<View style={{ flex: 1, alignItems: 'flex-end' }}>
						<Menu
							style={{ backgroundColor: BaseColor.backgroundColor }}
							ref={this.setMenuRef}
							button={<Text onPress={this.showMenu}><Icons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
						>
							<MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(); this.LogOut() }}>LogOut</MenuItem>
						</Menu>
					</View>
				</View>
				<View style={{ padding: 5, flexDirection: 'row', flex: 1, alignItems: 'center' }}>
					<View style={{ flexDirection: 'column', flex: 1 }}>
						<TouchableOpacity style={[styles.home_items]} onPress={() => { this.setState({ actionBar: false }); this.props.navigation.navigate("TimeOff") }}>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<View style={[styles.item_image]}>
									<Image source={require('@assets/images/timeoff.png')} style={{ width: 50, height: 40 }}>
									</Image>
									<View style={{ width: 50, height: 50, position: 'absolute', flex: 1, borderRadius: 10 }}>
										<Text style={{ fontSize: 14, color: BaseColor.danger, fontWeight: 'bold' }}>{timeoff_pending_count != 0 ? timeoff_pending_count : null}</Text>
									</View>
								</View>
								<View style={[styles.item_text]}>
									<Text style={{ color: BaseColor.grayColor, fontWeight: 'bold', fontSize: 15 }}>Gate Pass</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.home_items]} onPress={() => { this.setState({ actionBar: false }); this.props.navigation.navigate('Claim') }}>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<View style={[styles.item_image]}>
									<Image source={require('@assets/images/claim.png')} style={{ width: 45, height: 38 }}>
									</Image>
									<View style={{ width: 50, height: 50, position: 'absolute', flex: 1, borderRadius: 10 }}>
										<Text style={{ fontSize: 14, color: BaseColor.danger, fontWeight: 'bold' }}>{claim_pending_count != 0 ? claim_pending_count : null}</Text>
									</View>
								</View>
								<View style={[styles.item_text]}>
									<Text style={{ color: BaseColor.grayColor, fontWeight: 'bold', fontSize: 15 }}>Claim</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'column', flex: 1 }}>
						<TouchableOpacity style={[styles.home_items]} onPress={() => { this.setState({ actionBar: false }); this.props.navigation.navigate("Attendance") }}>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<View style={[styles.item_image]}>
									<Image source={require('@assets/images/attendance.png')} style={{ width: 50, height: 40 }}>
									</Image>
								</View>
								<View style={[styles.item_text]}>
									<Text style={{ color: BaseColor.grayColor, fontWeight: 'bold', fontSize: 15 }}>Attendance</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.home_items]} onPress={() => { this.setState({ actionBar: false }); this.props.navigation.navigate("Leave") }}>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<View style={[styles.item_image]}>
									<Image source={require('@assets/images/leave.png')} style={{ width: 40, height: 40 }}>
									</Image>
									<View style={{ width: 50, height: 50, position: 'absolute', flex: 1, borderRadius: 10 }}>
										<Text style={{ fontSize: 14, color: BaseColor.danger, fontWeight: 'bold' }}>{leave_pending_count != 0 ? leave_pending_count : null}</Text>
									</View>
								</View>
								<View style={[styles.item_text]}>
									<Text style={{ color: BaseColor.grayColor, fontWeight: 'bold', fontSize: 15 }}>Leave</Text>
								</View>
							</View>
						</TouchableOpacity>


					</View>
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

function Home(props) {
	const t = useTranslation();
	return <HomeClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
	return {
		AuthActions: bindActionCreators(AuthActions, dispatch),
		apiActions: bindActionCreators(apiActions, dispatch),
	};
};

export default connect(null, mapDispatchToProps)(Home);