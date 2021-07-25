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
import PushNotification from "react-native-push-notification";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class TimeOffClass extends Component {
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
            TimeOffType: "",
            countryCode: 'MY',
            withAlphaFilter: true,
            withFlag: true,
            withCountryNameButton: true,
            withFilter: true,
            isStartDatePickerVisible: false,
            isEndDatePickerVisible: false,
            isDatePickerVisible: false,
            startDate: "",
            endDate: "",
            offDate: "",
            realOffDate: "",
            actionBar: false,
            typeList: [],
            allProjectItem: [],
            description: "",
            title: "",
            selectedCountry: "Malaysia",
            realStartDate: "",
            realEndDate: "",
            timeOffID: "",
            status: "Pending",
        }
        this.backHandler = null;
    }

    shouldComponentUpdate(preprops, state) {
        if (preprops.navigation.state.params?.timeOff) {
            console.log(preprops.navigation.state.params.timeOff['id'])
            if (state.timeOffID != preprops.navigation.state.params.timeOff['id']) {
                this.getDetails(preprops);
            }
        }
        return true;
    }

    componentDidMount() {
        // this.setState({ Loading: true });
        SetPrefrence('page_name', 1);
        // this.getDetails();
        // this.listener = this.props.navigation.addListener("didFocus", this.getDetails.bind(this));
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        this.loadTimeOffType()
        this.loadData()
    }
    getDetails(preprops) {
        if (preprops.navigation.state.params?.timeOff) {
            var timeOff = preprops.navigation.state.params.timeOff
            this.setState({ timeOffID: '' })
            this.setState({ title: '' })
            this.setState({ TimeOffType: '' })
            this.setState({ offDate: '' })
            this.setState({ realOffDate: '' })
            this.setState({ endDate: '' })
            this.setState({ startDate: '' })
            this.setState({ description: '' })

            this.setState({ timeOffID: timeOff['id'] })
            this.setState({ title: timeOff['Timeoff_Title'] })
            this.setState({ TimeOffType: timeOff['Type'] })
            this.setState({ offDate: Utils.date2str(timeOff['Date'], "D MMM YYYY") })
            this.setState({ realOffDate: timeOff['Date'] })
            this.setState({ endDate: timeOff['EndHour'] })
            this.setState({ startDate: timeOff['StartHour'] })
            this.setState({ description: timeOff['DESCRIPTION'] })
            this.props.apiActions.setTimeOffReceived(timeOff['id'], (response) => {
                console.log(response.data);
            })
        }
    }
    loadTimeOffType() {
        this.props.apiActions.getHRMSTimeOffTypeList((response) => {
            // console.log(response)
            if (response.data) {
                this.setState({ typeList: response.data });
                this.setState({ TimeOffType: response.data[0]['Type'] })
            } else if (response.success) {
                Toast.show("Maybe network connection has failed.");
            }

        })
    }

    loadData() {
        const { employeeID } = this.state;
        this.props.apiActions.getHRMSTimeOffModuleList(employeeID, (response) => {
            // console.log('timeoff---------------', response.data)
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

    onCountrySelect(country) {
        this.setState({ countryCode: country['cca2'] });
        this.setState({ selectedCountry: country['name'] })
    }

    handleDate = (date) => {
        this.setState({ offDate: Utils.date2str(date, "D MMM YYYY") })
        this.setState({ isDatePickerVisible: false })
        this.setState({ realOffDate: Utils.date2str(date, 'yyyy-MM-DD') })
    }

    handleStartDate = (date) => {
        this.setState({ startDate: Utils.date2str(date, 'HH:mm') })
        this.setState({ isStartDatePickerVisible: false })
    };

    handleEndDate = (date) => {
        this.setState({ endDate: Utils.date2str(date, 'HH:mm') })
        this.setState({ isEndDatePickerVisible: false })
    }
    submit() {
        this.setState({ Loading: true });
        const { title, description, startDate, endDate } = this.state;
        if (startDate > endDate) {
            Toast.show(this.props.lang('message_invalid_date'));
            this.setState({ Loading: false });
            return;
        }
        if (title == "" || description == "" || startDate == "" || endDate == "") {
            Toast.show(this.props.lang('message_all_mandatory'));
            this.setState({ Loading: false });
            return;
        }
        this.props.apiActions.submitHRMSTimeOffModule(this.state, (response) => {
            if (response.data) {
                if (response.data?.message) {
                    Toast.show(response.data.message)
                } else {
                    Toast.show('Submitted');
                }
            } else if(response.success){
				Toast.show("Maybe network connection has failed.");
			}
            this.setState({ Loading: false })
        })
    }

    render() {
        const { navigation } = this.props;
        const { isStartDatePickerVisible, isEndDatePickerVisible, startDate, endDate, actionBar, typeList, allProjectItem, projectName, projectType, projectContact, offDate, isDatePickerVisible, description, title } = this.state;
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
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>Gate Pass Module</Text>
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
                    <ScrollView style={{ padding: 10, flexDirection: 'column', flex: 1, paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: this.state.imageLogo }} style={{ width: 75, height: 42 }}>
                                </Image>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Gate Pass Module</Text>
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
                                    <TextInput autoFocus={true} style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} onChangeText={(value) => this.setState({ title: value })} value={title}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
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
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Type</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <RNPickerSelect
                                        value={this.state.TimeOffType}
                                        selectedValue={this.state.TimeOffType}
                                        style={{
                                            inputAndroid: {
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                placeholderColor: 'black',
                                                color: 'black',
                                            }
                                        }}
                                        placeholder={{}}
                                        onValueChange={(value, key) => { this.setState({ TimeOffType: value }) }}
                                        items={typeItems}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Date</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{offDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={(data) => this.handleDate(data)}
                                            onCancel={() => this.setState({ isDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Start Time</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isStartDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{startDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isStartDatePickerVisible}
                                            mode="time"
                                            onConfirm={(data) => this.handleStartDate(data)}
                                            onCancel={() => this.setState({ isStartDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 15, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>End Time</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isEndDatePickerVisible: true })}>
                                        <Text style={{ borderBottomWidth: 1 }}>{endDate}</Text>
                                        <DateTimePickerModal
                                            isVisible={isEndDatePickerVisible}
                                            mode="time"
                                            onConfirm={(data) => this.handleEndDate(data)}
                                            onCancel={() => this.setState({ isEndDatePickerVisible: false })}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, alignItems: 'center' }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                                </View>
                                <View style={{ flex: 7 }}>
                                    <TextInput style={{ borderBottomWidth: 1, fontSize: 16, padding: 0 }} onChangeText={(value) => this.setState({ description: value })} value={description}></TextInput>
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

function TimeOff(props) {
    const t = useTranslation();
    return <TimeOffClass lang={t} {...props} />
}

const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TimeOff);