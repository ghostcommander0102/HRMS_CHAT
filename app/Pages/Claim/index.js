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
import { BaseColor } from '../../config/color';
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
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class ClaimClass extends Component {
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
            ClaimType: "",
            countryCode: 'MY',
            withAlphaFilter: true,
            withFlag: true,
            withCountryNameButton: true,
            withFilter: true,
            isStartDatePickerVisible: false,
            isEndDatePickerVisible: false,
            startDate: "",
            endDate: "",
            actionBar: false,
            typeList: [],
            allProjectItem: [],
            projectName: "",
            projectType: "",
            projectContact: "",
            description: "",
            title: "",
            selectedCountry: "Malaysia",
            realStartDate: "",
            realEndDate: ""
        }
        this.backHandler = null;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        this.loadClaimType();
        this.loadProjectName();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    loadClaimType() {
        this.props.apiActions.getHRMSClaimTypeList((response) => {
            if(response.data){
                this.setState({ typeList: response.data });
                this.setState({ ClaimType: response.data[0]['Type'] })
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
        })
    }

    loadProjectName() {
        this.props.apiActions.getProjectTypeList((response) => {
            if(response.data){
                this.setState({ allProjectItem: response.data });
                this.setState({ projectName: response.data[0]['project_name'] })
                this.setState({ projectType: response.data[0]['project_type'] })
                this.setState({ projectContact: response.data[0]['contact'] })
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

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    onCountrySelect(country) {
        this.setState({ countryCode: country['cca2'] });
        this.setState({ selectedCountry: country['name'] })
    }

    handleStartDate = (date) => {
        this.setState({ realStartDate: Utils.date2str(date, 'yyyy-MM-DD') })
        this.setState({ startDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ isStartDatePickerVisible: false })
    };

    handleEndDate = (date) => {
        this.setState({ realEndDate: Utils.date2str(date, 'yyyy-MM-DD') })
        this.setState({ endDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ isEndDatePickerVisible: false })
    }
    submit() {
        this.setState({ Loading: true });
        const { title, description, realStartDate, realEndDate } = this.state;
        if (realStartDate > realEndDate) {
            Toast.show(this.props.lang('message_invalid_date'));
            this.setState({ Loading: false });
            return;
        }
        if (title == "" || description == "" || realStartDate == "" || realEndDate == "") {
            Toast.show(this.props.lang('message_fill_all_fields'));
            this.setState({ Loading: false });
            return;
        }
        this.props.apiActions.submitHRMSClaim(this.state, (response) => {
            if (response.data?.message) {
                Toast.show(response.data['message'])
            } else if(response.data) {
                Toast.show('SAVE');
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }

    render() {
        const { navigation } = this.props;
        const { isStartDatePickerVisible, isEndDatePickerVisible, startDate, endDate, actionBar, typeList, allProjectItem, projectName, projectType, projectContact, height } = this.state;
        let typeItems = typeList?.map((item, i) => {
            return { value: item['Type'], label: item['Type'] }
        });
        let projectItems = allProjectItem?.map((item, i) => {
            return { value: item['project_name'], label: item['project_name'] }
        });
        let self = this;
        const { Loading, countryCode, withAlphaFilter, withFlag, withCountryNameButton, withFilter } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Employee Claim</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Menu
                                style={{ backgroundColor: BaseColor.backgroundColor }}
                                ref={this.setMenuRef}
                                button={<Text onPress={this.showMenu}><EntypoIcons name={'dots-three-vertical'} size={30} color='#fff' /></Text>}
                            >
                                <MenuItem underlayColor={BaseColor.grayColor} textStyle={{ color: 'white' }} onPress={() => { this.hideMenu(); this.props.navigation.navigate('ClaimApprovalListing') }}>Approval</MenuItem>
                            </Menu>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', width: 20, height: 150, marginTop: height / 2 - 75, zIndex: 100 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ClaimListing') }} style={{ width: 20, height: 150, backgroundColor: BaseColor.btnColor }}>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ padding: 10, flexDirection: 'column', flex: 1, paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
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
                        <View style={{ flexDirection: 'column', padding: 10, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Title</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput autoFocus={true} style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} onChangeText={(value) => this.setState({ title: value })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Claim Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
                                        value={this.state.ClaimType}
                                        selectedValue={this.state.ClaimType}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                placeholderColor: 'black',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value, key) => { this.setState({ ClaimType: value }) }}
                                        items={typeItems}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Project Name</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
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
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Project Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }}>{projectType}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Contact</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <Text style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }}>{projectContact}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Start Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isStartDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{startDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isStartDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleStartDate(data)}
                                            onCancel={() => this.setState({ isStartDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>End Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isEndDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{endDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isEndDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleEndDate(data)}
                                            onCancel={() => this.setState({ isEndDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Country</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <CountryPicker
                                        {...{
                                            countryCode,
                                            withFilter,
                                            withFlag,
                                            withCountryNameButton,
                                            withAlphaFilter,
                                            onSelect(country: Country) {
                                                self.onCountrySelect(country);
                                            },
                                        }}
                                        false
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} onChangeText={(value) => this.setState({ description: value })}></TextInput>
                                </View>
                            </View>
                            <TouchableOpacity style={{
                                flex: 1,
                                marginTop: 30,
                                alignItems: 'center',
                                backgroundColor: BaseColor.btnColor,
                                height: 40,
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                                onPress={() => this.submit()}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
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

function Claim(props) {
    const t = useTranslation();
    return <ClaimClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(Claim);