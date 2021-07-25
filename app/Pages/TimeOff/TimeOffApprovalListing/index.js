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
import { BaseColor } from '@config/color';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import { getLanguage, setLanguage, useTranslation } from 'react-multi-lang'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from "@utils";
import { SafeAreaView } from 'react-native-safe-area-context';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class TimeOffApprovalListingClass extends Component {
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
            approvalData: [],
            allApprovalData: [],
            actionBar: false
        }
        this.backHandler = null;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        this.getHRMSTimeOffApprovalList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.listener = this.props.navigation.addListener("didFocus", this.getHRMSTimeOffApprovalList.bind(this));
    }
    getHRMSTimeOffApprovalList() {
        const { employeeID } = this.state;
        this.setState({ Loading: true })
        this.props.apiActions.getHRMSTimeOffApprovalList(employeeID, (response) => {
            if (response.data) {
                var len = response.data.length;
                this.setState({ allApprovalData: response.data });
                this.setState({ approvalData: response.data.slice(0, 15) });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }

    addArray() {
        const { approvalData, allApprovalData } = this.state;
        var len = approvalData.length;
        this.setState({
            approvalData: [...this.state.approvalData, ...allApprovalData.slice(len, len + 15)]
        });
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
        if (this.listener)
            this.listener.remove();
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
        const { } = this.state;
        let self = this;
        const { Loading, approvalData, actionBar } = this.state;
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
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => navigation.navigate('Home')}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Gate Pass Approval Listing</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Menu
                                style={{ backgroundColor: BaseColor.backgroundColor }}
                                ref={this.setMenuRef}
                                button={<Text onPress={this.showMenu}><EntypoIcons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
                            >
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(); this.props.navigation.navigate('TimeOff') }}>Entry</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('TimeOffSummary') }}>Summary</MenuItem>
                                <MenuDivider />
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(), this.props.navigation.navigate('TimeOffApprovalListing') }}>Approval</MenuItem>
                            </Menu>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                            </Image>
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Gate Pass Approval Listing</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                            </Image>
                        </View>
                    </View>

                    <ScrollView style={{ paddingLeft: 10, paddingRight: 10, flexDirection: 'column', flex: 1 }} onMomentumScrollEnd={() => { this.addArray() }}>
                        {approvalData?.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 7, flexDirection: 'column' }}>
                                        <Text>{item['EMPLOYEE_NAME']} [{item['EMPLOYEE_ID']}]</Text>
                                        <Text>{item['Timeoff_Title']} </Text>
                                        <Text>{item['Date']} {item['StartHour']} - {item['EndHour']}</Text>
                                    </View>
                                    <View style={{ flex: 2, justifyContent: 'center' }}>
                                        <Text>[{item['STATUS']}]</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ width: 20, height: 30 }} onPress={() => this.props.navigation.navigate('TimeOffApproval', { timeOff: item })}>
                                            <Image source={require('@assets/images/ic_link.png')} style={{ width: 20, height: 30 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => this.props.navigation.navigate('TimeOffChat', { timeOff: item })}>
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

function TimeOffApprovalListing(props) {
    const t = useTranslation();
    return <TimeOffApprovalListingClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOffApprovalListing);