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
    ActivityIndicator
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
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";

class ClaimSummaryClass extends Component {

    constructor(props) {
        super(props);
        const screenWidth = Math.round(Dimensions.get('window').width);
        this.state = {
            width: screenWidth - 110,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            textUserName: store.getState().auth.login.data.EMPLOYEE_NAME,
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            visible: false,
            Claim: props.navigation.state.params.Claim,
            claimModuleDataList: [],
        }
        this.backHandler = null;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        this.getHRMSClaimModuleList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    getHRMSClaimModuleList() {
        const { employeeID, Claim } = this.state;
        this.props.apiActions.setClaimReceived(Claim['id'], (response) => {
            console.log(response);
        })
        this.props.apiActions.getHRMSClaimModuleList(employeeID, Claim['id'], (response) => {
            if (response.data) {
                this.setState({ claimModuleDataList: response.data });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }

    showDialog(id, index) {
        this.setState({ visible: true });
        this.setState({ id: id })
        this.setState({ index: index })
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
        const { } = this.state;
        const { Loading, Claim, claimModuleDataList } = this.state;
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
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Claim Summary</Text>
                    </View>
                    <ScrollView>
                        {claimModuleDataList?.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 10, alignItems: 'center' }} key={index.toString()}>
                                    <View style={{ flexDirection: 'column', flex: 5 }}>
                                        <Text style={{ fontSize: 16, paddingBottom: 10 }}>[{Claim['Country']}][{item['Date']}][{item['Type']}][{(parseFloat(item['Amount']) + parseFloat(item['service_charge']) + parseFloat(item['tax_amount'])).toFixed(2)}][{Claim['STATUS']}]</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Description: </Text>
                                            <Text style={{ fontSize: 16 }}>{item['Description']}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            {Claim['STATUS'] == 'Pending' &&
                                                <TouchableOpacity style={{ width: 20, height: 30 }} onPress={() => this.props.navigation.navigate('ClaimModule', { Claim: Claim, claimDetail: item })}>
                                                    <Image source={require('@assets/images/ic_link.png')} style={{ width: 20, height: 30 }} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => { this.props.navigation.navigate('ClaimChat', { Claim: Claim }) }}>
                                                <Image source={require('@assets/images/ic_chat.png')} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
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

function ClaimSummary(props) {
    const t = useTranslation();
    return <ClaimSummaryClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(ClaimSummary);