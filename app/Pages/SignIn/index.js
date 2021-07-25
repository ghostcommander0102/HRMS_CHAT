/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	Button,
	TouchableOpacity,
	TextInput,
	ScrollView,
	SafeAreaView,
	ActivityIndicator,
	BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import { BaseColor } from '../../config/color';
import { apiActions, AuthActions } from '../../actions';
import * as Utils from '@utils';
import Toast from 'react-native-simple-toast';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import Dialog from "react-native-dialog";
import DefaultPreference from 'react-native-default-preference';
import { KeyboardAvoidingView } from 'react-native';

class SignClass extends Component {
	constructor(props) {
		super(props);
		var width = Dimensions.get('window').width;
		var height = Dimensions.get('window').height;
		this.state = {
			email: 'virox99@yahoo.com',
			width: width,
			height: height - 20,
			password: '1',
			loading: false,
			data: null,
			reset_email: "",
			Loading: false,
			visible: false,
			server_url: '',
		};
		this.backHandler = null;

	}

	async componentDidMount() {
		global.SERVER_HOST = await DefaultPreference.get('server_url');
		this.setState({ email: "virox99@yahoo.com" });
		this.setState({ password: "999" })
		this.setState({server_url: await DefaultPreference.get('server_url')})
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
	}
	backAction() {
		if (this.state.Loading) {
			return true
		}
		if (this.state.dialogVisible) {
			this.setState({ dialogVisible: false })
			return true
		}
		if (this.props.navigation.isFocused()) {
			this.setState({ dialogVisible: false })
			return false
		}
	}
	login() {
		this.setState({ Loading: true })
		const { email, password } = this.state;
		const { navigation } = this.props;
		if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase()) || password == '') {
			Toast.show("Please enter your password and e-mail correctly.");
			this.setState({ Loading: false })
			return
		}

		this.props.AuthActions.authentication(true, this.state, (response) => {
			this.setState({ Loading: false })
			if (response.state == 0) {
				navigation.navigate("Loading");
			} else if (response.state == 1) {
				Toast.show("Please enter your password and e-mail correctly.");
			} else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
		});
	}

	changeUrl() {
		this.setState({ visible: false })
		global.SERVER_HOST = this.state.server_url;
		DefaultPreference.set('server_url', this.state.server_url);
	}
	
	showDialog() {
		this.setState({ visible: true });
	}

	setServerUrl(url) {
		console.log(url);
		this.setState({server_url: url});
	}

	dialog = () => {
        const { visible } = this.state;
        return (
            <View>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Server URL</Dialog.Title>
                    <Dialog.Description>
                        Please input server url.
                	</Dialog.Description>
					<Dialog.Input value={this.state.server_url} onChangeText={(value) => { this.setServerUrl(value) }}></Dialog.Input>
                    <Dialog.Button label="OK" onPress={() => { this.changeUrl() }} />
                    <Dialog.Button label="Cancel" onPress={() => { this.setState({ visible: false }) }} />
                </Dialog.Container>
            </View>
        );
    }

	render() {
		const { Loading, width, height, isOneButton } = this.state
		const { navigation } = this.props;
		return (
			<>
			<SafeAreaView
				style={{
					backgroundColor: 'white',
					flexDirection: 'column',
					flex: 1,
					marginBottom: 100
				}}>
				{Loading ?
					<View style={styles.loadingView}></View>
					: null
				}
				<View style={{ width: '100%', height: '100%', backgroundColor: BaseColor.backgroundColor }}>
					<View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, justifyContent: 'center' }}>
						<Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>LOGIN</Text>
					</View>
					<View
						style={{ paddingRight: 20, paddingLeft: 20, alignItems: 'center', marginTop: 30, flex: 1, flexDirection: 'column' }}>
						<TextInput
							style={styles.textinput}
							underlineColorAndroid="transparent"
							placeholder="Email"
							autoCapitalize="none"
							onChangeText={(text) => this.setState({ email: text })}
						/>

						<TextInput
							style={styles.textinput}
							underlineColorAndroid="transparent"
							placeholder="Password"
							autoCapitalize="none"
							secureTextEntry={true}
							onChangeText={(text) => this.setState({ password: text })}
						/>
						<TouchableOpacity
							onPress={() => this.login()}
							style={[styles.btnLogin]}>
							<Text style={[styles.txtLogin]}>{this.props.lang('text_login')}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.showDialog()}
							style={[styles.btnLogin]}>
							<Text style={[styles.txtLogin]}>CHANGE SERVER URL</Text>
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
				<this.dialog></this.dialog>

			</SafeAreaView>
			<View style={{ height: '100%',width: '100%', zIndex:-1, alignItems: 'center', position: 'absolute', justifyContent:'flex-end', backgroundColor: BaseColor.backgroundColor }}>
				<Text style={{ fontSize: 16, color: 'white' }}>Developed By Virox Software House Sdn Bhd</Text>
				<Text style={{ fontSize: 16, color: 'white' }}>V4.2.2</Text>
			</View>
		</>
		);
	}
}

function SignIn(props) {
	const t = useTranslation();
	return <SignClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
	return {
		AuthActions: bindActionCreators(AuthActions, dispatch),
		apiActions: bindActionCreators(apiActions, dispatch),
	};
};

export default connect(null, mapDispatchToProps)(SignIn);
