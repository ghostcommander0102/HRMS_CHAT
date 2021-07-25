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
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Utils from "@utils";

class ClaimApprovalClass extends Component {

    constructor(props) {
        super(props);
        const screenWidth = Math.round(Dimensions.get('window').width);
        this.state = {
            width: screenWidth - 110,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            claimID: props.navigation.state.params.Claim['id'],
            Claim: props.navigation.state.params.Claim,
            Travel_Title: props.navigation.state.params.Claim['Travel_Title'],
            EMPLOYEE_NAME: props.navigation.state.params.Claim['EMPLOYEE_NAME'],
            project_name: props.navigation.state.params.Claim['project_name'],
            project_type: props.navigation.state.params.Claim['project_type'],
            Type: props.navigation.state.params.Claim['Type'],
            contact: props.navigation.state.params.Claim['contact'],
            Country: props.navigation.state.params.Claim['Country'],
            Date_Start: props.navigation.state.params.Claim['Date_Start'],
            Date_End: props.navigation.state.params.Claim['Date_End'],
            moduleList: [],
            totalAmount: 0,
            showImage: false,
            photoUrl: ""
        }
        this.backHandler = null;
    }
    // {"Country": "Malaysia", "DESCRIPTION": "Expenses", 
    // "DOWNLOAD_STATUS": null, "Date_Approval": "0000-00-00",
    // "Date_Created": "2020-11-02 06:12:04", 
    // "Date_End": "2020-10-31", 
    // "Date_Start": "2020-10-01", 
    // "EMPLOYEE_ID": "248", 
    // "EMPLOYEE_NAME": "WONG SHWU JEN", 
    // "Manager_ID": "113,132,S1001,113A", 
    // "Manager_Name": "", 
    // "SEND_STATUS": "0", 
    // "STATUS": "Approved", 
    // "Total_Travel_Days": "0", 
    // "Total_Working_Days": "0", 
    // "Travel_Title": "October expenses", "Type": "Petrol", "claim_manager_level": "2", 
    // "claim_manager_status_1": "2", "claim_manager_status_2": "1", "claim_manager_status_3": "0", 
    // "claim_manager_status_4": "0", "claim_manager_status_5": "0", "contact": "NA", "id": "489", 
    // "project_name": "NA", "project_type": "Project"}
    componentDidMount() {
        this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        this.getHRMSClaimModuleList();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    getHRMSClaimModuleList() {
        const { employeeID, claimID } = this.state;
        this.props.apiActions.getHRMSClaimModuleList(employeeID, claimID, (response) => {
            if (response.data?.length > 0) {
                this.setState({ moduleList: response.data })
                let amount = 0;
                for (var i = 0; i < response.data.length; i++) {
                    amount += parseFloat(response.data[i]['Amount']) + parseFloat(response.data[i]['service_charge']) + parseFloat(response.data[i]['tax_amount']);
                }
                this.setState({ totalAmount: amount.toFixed(2).toString() });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false });
        })
    }

    updateHRMSClaimStatus(status) {
        const { employeeID, claimID, Claim } = this.state;
        this.setState({ Loading: true });
        this.props.apiActions.updateHRMSClaimStatus(employeeID, claimID, status, (response) => {
            if (response.data) {
                if (response.data.message) {
                    Toast.show(response.data.message);
                } else {
                    Claim['STATUS'] = status;
                    this.setState(Claim);
                    Toast.show(response.data);
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false });
        })
    }

    showImage(url) {
        if (url != "") {
            this.setState({ photoUrl: `${global.SERVER_HOST}${url}` });
            this.setState({ showImage: true });
        } else {
            Toast.show('empty photo');
        }
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }

    backAction() {
        const { showImage } = this.state;
        if (this.props.navigation.isFocused()) {
            if (showImage) {
                this.setState({ showImage: false })
                return true
            }
            return false
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }
    btnBackClicked() {
        const { showImage } = this.state;
        if (showImage) {
            this.setState({ showImage: false })
            return
        }
        this.props.navigation.goBack()
    }
    render() {
        const { navigation } = this.props;
        const { Loading, Travel_Title, EMPLOYEE_NAME, project_name, project_type, Type, contact, Country, Date_Start, Date_End, moduleList, showImage } = this.state;
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
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => this.btnBackClicked()}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Claim Approval</Text>
                    </View>
                    {showImage
                        ?
                        <Image source={{ uri: this.state.photoUrl }} style={{ height: '100%', width: '100%' }}></Image>
                        :
                        <>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ padding: 5 }}>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Title:</Text>
                                        <Text style={{ fontSize: 16 }}>{Travel_Title}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Employee:</Text>
                                        <Text style={{ fontSize: 16 }}>{EMPLOYEE_NAME}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Project Name:</Text>
                                        <Text style={{ fontSize: 16 }}>{project_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <View style={{ flexDirection: 'row', flex: 1.2 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Project Type:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{project_type}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Contact:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{contact}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <View style={{ flexDirection: 'row', flex: 1.2 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Claim Type:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{Type}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Country:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{Country}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', margin: 3 }}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Start Date:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{Date_Start}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>End Date:</Text>
                                            <Text style={{ fontSize: 16, flex: 1 }}>{Date_End}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <ScrollView style={{ flexDirection: 'column', borderTopWidth: 2, borderColor: BaseColor.btnColor }}>
                                {moduleList?.map((item, index) => {
                                    return (
                                        <View key={index.toString()}>
                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Date:</Text>
                                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Type:</Text>
                                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Description:</Text>
                                                    <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>Amount:</Text>
                                                </View>
                                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                                    <Text style={{ paddingBottom: 5 }}>{item['Date']}</Text>
                                                    <Text style={{ paddingBottom: 5 }}>{item['Type']}</Text>
                                                    <Text style={{ paddingBottom: 5 }}>{item['Description']}</Text>
                                                    <Text style={{ paddingBottom: 5 }}>{(parseFloat(item['Amount']) + parseFloat(item['service_charge']) + parseFloat(item['tax_amount'])).toFixed(2)}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ width: 20, height: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.showImage(item['PHOTO'])}>
                                                        <Image source={require('@assets/images/ic_link.png')} style={{ width: 20, height: 30 }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', flex: 1 }}>Total:</Text>
                                    <Text style={{ flex: 5 }}>{this.state.totalAmount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    {this.state.Claim['STATUS'] == 'Pending' ?
                                        <>
                                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("ClaimChat", { Claim: this.state.Claim })}>
                                                <Text style={[styles.btnStyles]}>Chat</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.updateHRMSClaimStatus("Rejected")}>
                                                <Text style={[styles.btnStyles]}>Reject</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.updateHRMSClaimStatus("Approved")}>
                                                <Text style={[styles.btnStyles]}>Approve</Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <TouchableOpacity style={{ width: '50%' }} onPress={() => this.props.navigation.navigate("ClaimChat", { Claim: this.state.Claim })}>
                                            <Text style={[styles.btnStyles]}>Chat</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        </>
                    }

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

function ClaimApproval(props) {
    const t = useTranslation();
    return <ClaimApprovalClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(ClaimApproval);