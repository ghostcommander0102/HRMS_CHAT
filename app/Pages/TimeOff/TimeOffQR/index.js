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
import QRCode1 from 'react-native-qrcode-generator';

class TimeOffQRClass extends Component {

    constructor(props) {
        super(props);
        const screenWidth = Math.round(Dimensions.get('window').width);
        this.state = {
            width: screenWidth - 170,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            timeOff: props.navigation.state.params.timeOff,
            QR_Code: {
                'n': this.props.navigation.state.params.timeOff['EMPLOYEE_NAME'],
                'i': this.props.navigation.state.params.timeOff['id'],
                's': this.props.navigation.state.params.timeOff['StartHour'],
                'e': this.props.navigation.state.params.timeOff['EndHour'],
                'd': this.props.navigation.state.params.timeOff['Date'],
                't': this.props.navigation.state.params.timeOff['STATUS'],
                'c': this.props.navigation.state.params.timeOff['DESCRIPTION']
            },
        }
        this.backHandler = null;
    }

    componentDidMount() {
        // console.log(this.state.QR_Code)
        SetPrefrence('page_name', 1);
        // this.setState({ Loading: true });
        console.log(Object.keys(this.state.QR_Code).length)
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
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
        const { Loading, timeOff } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>QR Code</Text>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 0.5 }}>
                        <View style={{ flex: 4, flexDirection: 'column' }}>
                            <Text>
                                [{timeOff['Country']}][{timeOff['Date']}][{timeOff['Type']}][{timeOff['StartHour']}][
                                    {timeOff['EndHour']}][{timeOff['STATUS']}]
                            </Text>
                            <Text>Description: {timeOff['DESCRIPTION']}</Text>
                            <Text>Location 1: {timeOff['location'] ? timeOff['location'] : "Not captured yet"}</Text>
                            <Text>Location 2: {timeOff['location2'] ? timeOff['location2'] : "Not captured yet"}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{ height: 220, width: 220, backgroundColor: 'white', justifyContent: 'center', paddingLeft: 10 }}>
                            {Object.keys(this.state.QR_Code).length != 0 ?
                                <QRCode1
                                    value={this.state.QR_Code}
                                    size={200}
                                    bgColor='black'
                                    fgColor='white' />
                                :
                                null
                            }
                        </View>
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

function TimeOffQR(props) {
    const t = useTranslation();
    return <TimeOffQRClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOffQR);