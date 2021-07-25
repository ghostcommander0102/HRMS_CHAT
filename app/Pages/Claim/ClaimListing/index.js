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

class ClaimListingClass extends Component {

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
            approvalData: [],
            allApprovalData: [],
            visible: false,
            claim_id: 0,
            index: 0
        }
        this.backHandler = null;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        this.getHRMSClaimList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.listener = this.props.navigation.addListener("didFocus", this.getHRMSClaimList.bind(this));
    }
    getHRMSClaimList() {
        const { employeeID } = this.state;
        this.setState({ Loading: true })
        this.props.apiActions.getHRMSClaimList(employeeID, (response) => {
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

    deleteHRMSClaim() {
        const { employeeID, id, index } = this.state;
        this.setState({ Loading: true });
        this.props.apiActions.deleteHRMSClaim(employeeID, id, (response) => {
            if (response.data) {
                if (response.data == "Success") {
                    Toast.show(response.data);
                    var approvalData = [...this.state.approvalData]; // make a separate copy of the array
                    approvalData.splice(index, 1);
                    this.setState({ approvalData });
                    var allApprovalData = [...this.state.allApprovalData]; // make a separate copy of the array
                    allApprovalData.splice(index, 1);
                    this.setState({ allApprovalData });
                } else {
                    Toast.show(response.data.message);
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false });
        })
        this.setState({ visible: false });
    }

    showDialog(id, index) {
        this.setState({ visible: true });
        this.setState({ id: id })
        this.setState({ index: index })
    }

    dialog = () => {
        const { visible } = this.state;
        return (
            <View>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Remove</Dialog.Title>
                    <Dialog.Description>
                        Are you sure to remove this item?
                </Dialog.Description>
                    <Dialog.Button label="Remove" onPress={() => { this.deleteHRMSClaim() }} />
                    <Dialog.Button label="Cancel" onPress={() => { this.setState({ visible: false }) }} />
                </Dialog.Container>
            </View>
        );
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
        const { Loading, approvalData } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Claim Listing</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                            </Image>
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Claim Listing</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                            </Image>
                        </View>
                    </View>
                    <ScrollView style={{ flexDirection: 'column', flex: 1 }} onMomentumScrollEnd={() => { this.addArray() }}>
                        {approvalData?.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 8, flexDirection: 'column', padding: 5 }}>
                                        <Text style={{ fontSize: 16 }}>{item['Travel_Title']} [{item['STATUS']}]</Text>
                                        <Text style={{ fontSize: 16 }}>{item['Date_Start']} - {item['Date_End']}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ width: 20, height: 30 }} onPress={() => this.props.navigation.navigate('ClaimModule', { Claim: item })}>
                                            <Image source={require('@assets/images/ic_link.png')} style={{ width: 20, height: 30 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ width: 20, height: 30 }} onPress={() => this.showDialog(item['id'], index)}>
                                            <Image source={require('@assets/images/ic_trash.png')} style={{ width: 20, height: 30 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    <this.dialog></this.dialog>
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

function ClaimListing(props) {
    const t = useTranslation();
    return <ClaimListingClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(ClaimListing);