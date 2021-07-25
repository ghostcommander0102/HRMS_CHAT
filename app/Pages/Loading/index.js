import React, { Component } from "react";
import { ActivityIndicator, View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { Images, BaseColor } from "@config";
import styles from "./styles";
import { store } from "@store";
import * as Utils from "@utils";
import { apiActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DefaultPreference from 'react-native-default-preference';

class Loading extends Component {
  constructor(props) {
    super(props);
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    this.state = {
      width: width,
      height: height,
    }
  }
  async componentDidMount() {
    if(!await DefaultPreference.get('server_url')){
      await DefaultPreference.set('server_url', `${Utils.SERVER_HOST}`);
    }else {
      global.SERVER_HOST = await DefaultPreference.get('server_url');
    }
    setTimeout(() => {
      try {
        if (store.getState().auth.login.success) {
          return this.props.navigation.navigate("Home");
        }
      } catch (err) {
      }
      return this.props.navigation.navigate("Main");
    }, 1000);
  }
  checkDate() {
    const user = store.getState().auth.login.data.user;
    if (user.role != 6) {
      return false;
    }
    if (!user.payment)
      return true;

    if ((new Date(user.payment.toDate)).getTime() < (new Date()).getTime())
      return true;
    return false;
  }
  render() {
    const { height, width } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Image source={require('@assets/images/logo.png')} style={{ width: 250, height: 150 }}>
          </Image>
        </View>
        <ActivityIndicator
          size="large"
          color={BaseColor.textPrimaryColor}
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    apiActions: bindActionCreators(apiActions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Loading);