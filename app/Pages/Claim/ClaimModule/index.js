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
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CountryPicker from 'react-native-country-picker-modal'
import * as Utils from "@utils";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";
import ImagePicker from 'react-native-image-picker';
import defaultExport from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class ClaimModuleClass extends Component {
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
        const screenHeight = Math.round(Dimensions.get('window').height);
        this.state = {
            width: screenWidth - 110,
            height: screenHeight,
            dialogVisible: false,
            Loading: false,
            employeeID: store.getState().auth.login.data.EMPLOYEE_ID,
            textUserName: store.getState().auth.login.data.EMPLOYEE_NAME,
            imageLogo: store.getState().auth.login.data.COMPANY_LOGO,
            imagePhoto: store.getState().auth.login.data.PHOTO,
            Claim: props.navigation.state.params.Claim,
            claimID: props.navigation.state.params.Claim['id'],
            actionBar: false,
            claimDate: "",
            realClaimDate: "",
            isDatePickerVisible: false,
            claimType: "",
            claimTypeList: [],
            gstList: [],
            taxCode: "",
            claimModuleDataList: [],
            totalAmount: 0,
            id: "",
            index: "",
            visible: false,
            selectImage: "",
            amount: "",
            description: "",
            remark: "",
            photo: "",
            type: "",
            claimDetailID: "",
            status: "Save",
            taxRate: "",
            photoUrl: "",
            claimDetail: this.props.navigation.state.params.claimDetail,
            tax_amount: "",
            service_charge: ""
        }
        this.backHandler = null;
    }
    componentDidMount() {
        this.getHRMSClaimDetailTypeList()
        this.getGstList()
        this.getHRMSClaimModuleList()
        SetPrefrence('page_name', 1);
        this.getDetails();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.listener = this.props.navigation.addListener("didFocus", this.getDetails.bind(this));
    }

    getDetails() {
        this.setState({ claimDetail: this.props.navigation.state.params?.claimDetail });
        if (this.state.claimDetail) {
            const { claimDetail } = this.state;
            this.setState({claimType: ''});
            this.setState({taxCode: ''});
            this.setState({ remark: '' })
            this.setState({ description: '' })
            this.setState({ amount: '' })
            this.setState({ realClaimDate: '' })
            this.setState({ claimDate: '' })
            this.setState({ photoUrl: '' })
            this.setState({ claimDetailID: '' })
            this.setState({ tax_amount: '' })
            this.setState({ service_charge: '' })

            this.setState({claimType: claimDetail['Type']});
            this.setState({taxCode: claimDetail['tax_code']});
            this.setState({ remark: claimDetail['Remark'] })
            this.setState({ description: claimDetail['Description'] })
            this.setState({ amount: claimDetail['Amount'] })
            this.setState({ realClaimDate: claimDetail['Date'] })
            this.setState({ claimDate: Utils.date2str(claimDetail['Date'], "D MMM YYYY") })
            this.setState({ photoUrl: claimDetail['PHOTO'] })
            this.setState({ claimDetailID: claimDetail['id'] })
            this.setState({ tax_amount: claimDetail['tax_amount'] })
            this.setState({ service_charge: claimDetail['service_charge'] })
        }
    }

    getHRMSClaimDetailTypeList() {
        const { employeeID } = this.state
        this.props.apiActions.getHRMSClaimDetailTypeList(employeeID, (response) => {
            if (response.data) {
                this.setState({ claimTypeList: response.data })
                this.setState({ ClaimType: response.data[0]['Type'] })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    getGstList() {
        let self = this;
        this.props.apiActions.getGstList((response) => {
            if (response.data) {
                self.setState({ gstList: response.data });
                self.setState({ taxCode: response.data[0]['tax_code'] });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    getHRMSClaimModuleList() {
        let self = this;
        this.props.apiActions.getHRMSClaimModuleList(this.state.employeeID, this.state.Claim.id, (response) => {
            if (response.data) {
                this.setState({ claimModuleDataList: response.data });
                let total = 0;
                for (var i = 0; i < response.data.length; i++) {
                    total += (parseFloat(response.data[i]['Amount']) + parseFloat(response.data[i]['service_charge']) + parseFloat(response.data[i]['tax_amount']));
                }
                self.setState({ totalAmount: total.toFixed(2) });
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
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
    handleDate = (date) => {
        this.setState({ claimDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ isDatePickerVisible: false })
        this.setState({ realClaimDate: Utils.date2str(date, 'yyyy-MM-DD') })
    }
    submit() {
        const { employeeID, Claim } = this.state
        this.setState({ Loading: true });
        this.props.apiActions.updateHRMSClaimStatus(employeeID, Claim.id, "Pending", (response) => {
            if(response.data){
                if(response.data.message){
                    Toast.show(response.data.message);
                }else{
                    Toast.show(response.data);
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false });
        })
    }
    save() {
        const { realClaimDate, claimType, taxCode, description, amount, Claim, remark, tax_amount, service_charge } = this.state;
        if (realClaimDate == "" || claimType == "" || description == "" || amount == "" || remark == "" || tax_amount == "" || service_charge == "") {
            Toast.show(this.props.lang('message_all_mandatory'));
            return;
        }
        if (Claim.Date_Start > realClaimDate || Claim.Date_End < realClaimDate) {
            Toast.show(this.props.lang('message_invalid_date'));
            return;
        }
        this.setState({ Loading: true });
        this.props.apiActions.submitHRMSClaimModule(this.state, (response) => {
            this.setState({ Loading: false });
            if (response.data) {
                if (response.data.message) {
                    Toast.show(response.data.message);
                } else {
                    Toast.show("Success");
                    this.setState({selectImage: ""});
                    this.getHRMSClaimModuleList();
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }
    selectImage() {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (res) => {
            if (res.didCancel) {
            } else if (res.error) {
            } else if (res.customButton) {
            } else {
                this.setState({ selectImage: res.data });
                this.setState({ photo: res.data });
                this.setState({ type: res.type });
            }
        });
    }
    showDialog(id, index) {
        this.setState({ visible: true });
        this.setState({ id: id })
        this.setState({ index: index })
    }
    deleteHRMSClaimModule() {
        const { employeeID, id, index } = this.state;
        this.props.apiActions.deleteHRMSClaimModule(employeeID, id, (response) => {
            if (response.data) {
                if (response.data == "Success") {
                    Toast.show(response.data);
                    this.getHRMSClaimModuleList();
                } else {
                    Toast.show(response.data.message);
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
        this.setState({ visible: false });
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
                    <Dialog.Button label="Remove" onPress={() => { this.deleteHRMSClaimModule() }} />
                    <Dialog.Button label="Cancel" onPress={() => { this.setState({ visible: false }) }} />
                </Dialog.Container>
            </View>
        );
    }

    CliamImage({ _this }) {
        if (_this.state.selectImage) {
            return (
                <Image style={{ width: 150, height: 100 }} source={{ uri: 'data:image/jpeg;base64,' + _this.state.selectImage }} />
            )
        } else if (_this.state.photoUrl) {
            return (
                <Image style={{ width: 150, height: 100 }} source={{ uri: global.SERVER_HOST + _this.state.photoUrl }} />
            )
        } else {
            return (
                <Image style={{ width: 150, height: 100 }} source={require('@assets/images/ic_empty.jpg')}></Image>
            )
        }
    }

    render() {
        const { navigation } = this.props;
        const { actionBar, height } = this.state;
        const { Loading, Claim, claimDate, isDatePickerVisible, claimTypeList, gstList, claimModuleDataList, claimDetail } = this.state;
        let typeItem = claimTypeList?.map((item, i) => {
            return { value: item['Type'], label: item['Type'] }
        });

        let gstItme = gstList?.map((item, i) => {
            return { value: item['tax_code'], label: item['tax_code'] }
        });

        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: BaseColor.colorBlueLighter }}>
                {Loading == true
                    ?
                    <View style={{ height: "100%", width: "100%", opacity: 0.3, position: 'absolute', zIndex: 1000 }}></View>
                    :
                    null
                }
                {actionBar == true
                    ?
                    <TouchableWithoutFeedback onPress={() => { this.setState({ actionBar: false }) }}>
                        <View style={{ height: "100%", width: "100%", opacity: 0.3, position: 'absolute', zIndex: 50 }}>
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    null
                }
                <>
                    <View style={{ backgroundColor: BaseColor.headerColor, width: "100%", height: 60, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: '3%' }} onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name={'arrow-back'} size={30} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Claim Module</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Menu
                                style={{ backgroundColor: BaseColor.backgroundColor }}
                                ref={this.setMenuRef}
                                button={<Text onPress={this.showMenu}><EntypoIcons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
                            >
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(); this.props.navigation.navigate('ClaimSummary', { Claim: Claim }) }}>Summary</MenuItem>
                            </Menu>
                        </View>
                    </View>

                    <ScrollView style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingRight: 10, paddingLeft: 10, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                </Image>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Employee Claim</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Image source={{ uri: this.state.imagePhoto }} style={{ width: 40, height: 40 }}>
                                </Image>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', padding: 10 }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Title</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.Travel_Title}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Claim Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.Type}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Project Name</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.project_name}</Text>
                                    {/* <RNPickerSelect
                                        value={this.state.projectName}
                                        selectedValue={this.state.projectName}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                placeholderColor: 'black',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value, key) => { this.setState({ projectName: value }), this.setState({ projectContact: allProjectItem[key]['contact'] }), this.setState({ projectType: allProjectItem[key]['project_type'] }) }}
                                        items={projectItems}
                                    /> */}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Project Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.project_type}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Contact</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.contact}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Country</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.Country}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Start Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Utils.date2str(Claim.Date_Start, "D MMM YYYY")}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>End Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Utils.date2str(Claim.Date_End, "D MMM YYYY")}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Justification</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 16, padding: 0 }}>{Claim.DESCRIPTION}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
                                        value={this.state.claimType}
                                        selectedValue={this.state.claimType}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                placeholderColor: 'black',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value, key) => { this.setState({ claimType: value }) }}
                                        items={typeItem}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tax</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
                                        value={this.state.taxCode}
                                        selectedValue={this.state.taxCode}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                placeholderColor: 'black',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value, key) => { this.setState({ taxCode: value }), this.setState({ taxRate: this.state.gstList[key]['tax_rate'] }) }}
                                        items={gstItme}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{claimDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleDate(data)}
                                            onCancel={() => this.setState({ isDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} value={this.state.description} onChangeText={(value) => this.setState({ description: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Amount</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} value={this.state.amount} keyboardType={'numeric'} onChangeText={(value) => this.setState({ amount: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Service Charge</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} value={this.state.service_charge} keyboardType={'numeric'} onChangeText={(value) => this.setState({ service_charge: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tax Amount</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} value={this.state.tax_amount} keyboardType={'numeric'} onChangeText={(value) => this.setState({ tax_amount: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Remark</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} value={this.state.remark} onChangeText={(value) => this.setState({ remark: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <this.CliamImage _this={this}></this.CliamImage>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    marginTop: 30,
                                    alignItems: 'center',
                                    backgroundColor: BaseColor.btnColor,
                                    height: 40,
                                    justifyContent: 'center',
                                    borderRadius: 5
                                }}
                                    onPress={() => this.selectImage()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginTop: 30,
                                    alignItems: 'center',
                                    backgroundColor: BaseColor.btnColor,
                                    height: 40,
                                    justifyContent: 'center',
                                    borderRadius: 5
                                }}
                                    onPress={() => this.save()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    marginTop: 30,
                                    alignItems: 'center',
                                    backgroundColor: BaseColor.btnColor,
                                    height: 40,
                                    justifyContent: 'center',
                                    borderRadius: 5
                                }}
                                    onPress={() => this.submit()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Submit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: BaseColor.navyBlue, marginTop: 10 }}>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Date</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Type</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Amount</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.table_header]}>Delete</Text></View>
                        </View>
                        <ScrollView style={{ flexDirection: 'column' }}>
                            {claimModuleDataList?.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row' }} key={index.toString()}>
                                        <View style={{ flex: 1, borderWidth: 0.6, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Date']}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.6, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{item['Type']}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.6, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.table_content]}>{(parseFloat(item['Amount']) + parseFloat(item['service_charge']) + parseFloat(item['tax_amount'])).toFixed(2)}</Text></View>
                                        <View style={{ flex: 1, borderWidth: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ width: 15, height: 20 }} onPress={() => this.showDialog(item['id'], index)}>
                                                <Image source={require('@assets/images/ic_trash.png')} style={{ width: 20, height: 25 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                        <View style={{ flex: 1, margin: 10 }}>
                            <Text>Total:        {this.state.totalAmount}</Text>
                        </View>
                    </ScrollView>
                </>
                <this.dialog></this.dialog>
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

function ClaimModule(props) {
    const t = useTranslation();
    return <ClaimModuleClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(ClaimModule);