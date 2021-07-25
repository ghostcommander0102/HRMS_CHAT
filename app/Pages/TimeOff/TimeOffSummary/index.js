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
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import GetLocation from 'react-native-get-location'
import Geocoder from 'react-native-geocoding';
import * as Utils from '@utils';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class TimeOffSummaryClass extends Component {
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
            modulDetails: [],
            actionBar: false,
            address_1: "",
            address_2: "",
            timeOff_id: '',
            index: 0,
        }
        this.backHandler = null;
    }

    componentDidMount() {
        Geocoder.init("AIzaSyB2OuI6Nxb6H0HnGtug61l9iCroOwIa7pI"); // use a valid API key
        SetPrefrence('page_name', 1);
        // this.setState({ Loading: true });
        this.loadData()
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    loadData() {
        const { employeeID } = this.state;
        this.props.apiActions.getHRMSTimeOffModuleList(employeeID, (response) => {
            if (response.data) {
                this.setState({ modulDetails: response.data })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
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

    getCurrentLocation(pos, id, index) {
        let self = this
        this.setState({ timeOff_id: id })
        this.setState({ index: index })
        if (pos == 1) {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(location => {
                    console.log(location);
                    let lat = location.latitude;
                    let lng = location.longitude;
                    Geocoder.from(lat, lng)
                        .then(json => {
                            console.log("addressComponent");
                            var addressComponent = json.results[0]["formatted_address"];
                            self.setState({ address_1: addressComponent })
                            self.updateLocation(lat, lng)
                        })
                        .catch(error =>
                            console.warn(error)
                        );
                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })
        } else {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(location => {
                    console.log(location);
                    let lat = location.latitude;
                    let lng = location.longitude;
                    Geocoder.from(lat, lng)
                        .then(json => {
                            console.log("addressComponent");
                            var addressComponent = json.results[0]["formatted_address"];
                            self.setState({ address_2: addressComponent })
                            self.updateLocation2(lat, lng)
                        })
                        .catch(error =>
                            console.warn(error)
                        );
                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })
        }
    }

    updateLocation(lat, lng) {
        const { timeOff_id, address_1, modulDetails, index } = this.state
        this.props.apiActions.updateLocation(timeOff_id, address_1, lat, lng, (response) => {
            if (response.data == "Success") {
                modulDetails[index]['location'] = address_1
                this.setState({modulDetails})
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    updateLocation2(lat, lng) {
        const { timeOff_id, address_2, modulDetails, index } = this.state
        this.props.apiActions.updateLocation2(timeOff_id, address_2, lat, lng, (response) => {
            if (response.data == "Success") {
                modulDetails[index]['location2'] = address_2
                this.setState({modulDetails})
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    render() {
        const { navigation } = this.props;
        const { Loading, modulDetails, actionBar } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Gate Pass Summary</Text>
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
                    <ScrollView style={{ flexDirection: 'column' }}>
                        {modulDetails?.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 0.5 }}>
                                    <View style={{ flex: 4, flexDirection: 'column' }}>
                                        <Text>[{item['Country']}][{item['Date']}][{item['Type']}][{item['StartHour']}][
                                        {item['EndHour']}][{item['STATUS']}]
                                        </Text>
                                        <Text>Description: {item['DESCRIPTION']}</Text>
                                        {item['location']
                                            ?
                                            <Text>Location 1: {item['location']}</Text>
                                            :
                                            <Text>Location 1: Not captured yet</Text>
                                        }
                                        {item['location2']
                                            ?
                                            <Text>Location 2: {item['location2']}</Text>
                                            :
                                            <Text>Location 1: Not captured yet</Text>
                                        }
                                    </View>
                                    <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', flex: 3, alignItems: 'center' }}>
                                            <TouchableOpacity style={{ width: 20, height: 28, flex: 1, justifyContent: 'center' }} onPress={() => { this.props.navigation.navigate('TimeOffQR', { timeOff: item }) }}>
                                                <Image source={require('@assets/images/ic_qr.png')} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center' }} onPress={() => { this.props.navigation.navigate('TimeOff', {timeOff: item}) }}>
                                                <Image source={require('@assets/images/ic_link.png')} style={{ width: 20, height: 30 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: 20, height: 20, flex: 1, justifyContent: 'center' }} onPress={() => { this.props.navigation.navigate('TimeOffChat', {timeOff: item}) }}>
                                                <Image source={require('@assets/images/ic_chat.png')} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <View style={{ flex: 0.2 }}></View>
                                            <View style={{ flex: 1 }}>
                                                {!item['location']
                                                    ?
                                                    <TouchableOpacity onPress={() => { this.getCurrentLocation(1, item['id'], index) }}>
                                                        <Text style={{ color: 'white', padding: 1, borderRadius: 3, textAlign: 'center', backgroundColor: BaseColor.btnColor, height: 20 }}>Pos 1</Text>
                                                    </TouchableOpacity>
                                                    : null
                                                }
                                            </View>
                                            <View style={{ flex: 0.2 }}></View>
                                            <View style={{ flex: 1 }}>
                                                {!item['location2']
                                                    ?
                                                    <TouchableOpacity onPress={() => { this.getCurrentLocation(2, item['id'], index) }}>
                                                        <Text style={{ color: 'white', padding: 1, borderRadius: 3, textAlign: 'center', backgroundColor: BaseColor.btnColor, height: 20 }}>Pos 2</Text>
                                                    </TouchableOpacity>
                                                    : null
                                                }
                                            </View>
                                            <View style={{ flex: 0.2 }}></View>
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

function TimeOffSummary(props) {
    const t = useTranslation();
    return <TimeOffSummaryClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOffSummary);