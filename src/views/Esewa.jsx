import React, { useState,useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, base_url, success_url, failed_url, add_wallet, api_url ,esewa_failed_url, esewa_success_url , normal} from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { esewaPaymentStatus, esewaAmount } from '../actions/PaymentActions';
import Wallet from '../views/Wallet';
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const Esewa = (props) => {
  let dropDownAlertRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const [amount, setAmount] = useState(route.params.amount);
  const [url, setUrl] = useState(base_url+'paywithesewa/'+props.route.params.amount);
  const [alreadyProcessed, setAlreadyProcessed] = useState(false); // New state to track if payment already processed
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();


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
                    dropDownAlertRef.alertWithType('success', 'Success', 'Amount successfully added to your wallet');

                    setTimeout(() => {
                      go_back();
                    },2500);

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
    const indexOfQuestionMark = value.url.indexOf('?');
    const baseUrl = indexOfQuestionMark !== -1 ? value.url.slice(0, indexOfQuestionMark) : value.url;

    if (!alreadyProcessed){
        if(baseUrl === esewa_success_url ){
               setAlreadyProcessed(true);
               await props.esewaPaymentStatus(1);
               call_add_wallet();
           }else if(baseUrl == esewa_failed_url){
               setAlreadyProcessed(true);
               await props.esewaPaymentStatus(0);
               dropDownAlertRef.alertWithType('error', 'Sorry', 'Could not Topup Your Wallet. Please Retry');
               setTimeout(() => {
                go_back();
              },2500);
           }
       }
  }

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#24272c',
    },
    header: {
      height:60,
      backgroundColor: '#2ABA00',
      flexDirection: 'row',
      alignItems: 'center'
    },
  });

  return (
  <>
        <View
        style={{
          backgroundColor:'#2ABA00',
          height: Platform.OS === 'ios' ? insets.top : null,
        }}>
        <StatusBar
          backgroundColor='#2ABA00'
        />
        </View>
      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: 'white', fontFamily: normal }}>e-Sewa</Text>

      </View>
      <SafeAreaView style={styles.container}>

        <WebView
          source={{uri: url}}
          style={{marginTop: 20}}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
        />

    </SafeAreaView>
       {drop_down_alert()}
       </>
  );
};



function mapStateToProps(state){
    return{
        esewa_payment_status: state.payment.esewa_payment_status
    };
  }

  const mapDispatchToProps = (dispatch) => ({
    esewaPaymentStatus: (data) => dispatch(esewaPaymentStatus(data))
  });


  export default connect(mapStateToProps,mapDispatchToProps)(Esewa);