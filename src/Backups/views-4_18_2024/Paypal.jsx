import React, { useState,useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, base_url, success_url, failed_url, add_wallet, api_url } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { paypalPaymentStatus, paypalAmount } from '../actions/PaymentActions';
import Wallet from '../views/Wallet';
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';

const Paypal = (props) => {
  let dropDownAlertRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const [amount, setAmount] = useState(route.params.amount);
  const [url, setUrl] = useState(base_url+'paywithpaypal/'+props.route.params.amount);
  const [alreadyProcessed, setAlreadyProcessed] = useState(false); // New state to track if payment already processed

  const drop_down_alert = () => {
          return (
              <DropdownAlert
                  ref={(ref) => {
                      if (ref) {
                          dropDownAlertRef = ref;
                      }
                  }}
              />
          )
      }

  const call_add_wallet = () => {
          axios({
              method: 'post',
              url: api_url + add_wallet,
              data: { id: global.id, amount: amount }
          })
              .then(async response => {
                  if (response.data.status == 1) {
                  } else {
                      dropDownAlertRef.alertWithType('error', 'Error', response.data.message);
                  }

              })
              .catch(error => {
                  console.log("heres the error");
                  alert('Sorry something went wrong')
              });
      }

  const go_back = () => {
   navigation.goBack();
  }

  const _onNavigationStateChange = async (value) => {

    if (!alreadyProcessed){
        if(value.url == success_url ){
               setAlreadyProcessed(true);
               await props.paypalPaymentStatus(1);
               call_add_wallet();
               console.log("Done");
               go_back();
               dropDownAlertRef.alertWithType('success', 'Success', 'Amount successfully added to your wallet');
           }else if(value.url == failed_url){
               setAlreadyProcessed(true);
               await props.paypalPaymentStatus(0);
               console.log("Fail");
               go_back();
           }
       }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
        <WebView
          source={{uri: url}}
          style={{marginTop: 20}}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
        />
        {drop_down_alert()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.lite_bg
  },
  header: {
    height: 60,
    backgroundColor: colors.lite_bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
});

function mapStateToProps(state){
    return{
      paypal_payment_status : state.payment.paypal_payment_status
    };
  }
  
  const mapDispatchToProps = (dispatch) => ({
    paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data))
  });
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(Paypal);