import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Modal,
    TextInput
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, img_url, api_url, add_wallet, no_data_loader, income_icon, expense_icon, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import RBSheet from "react-native-raw-bottom-sheet";
import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import { paypalPaymentStatus } from '../actions/PaymentActions';
import { connect } from 'react-redux';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const Wallet = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    let dropDownAlertRef = useRef();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [payment_methods_list, setPaymentMethodsList] = useState([]);
    const wallet_ref = useRef(null);
    const inputRef = useRef();
    const [data, setData] = useState([]);
    const [all, setAll] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [receives, setReceives] = useState([]);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [wallet_amount, setWalletAmount] = useState(0);
    const [filter, setFilter] = useState(1);
    const [flutterwave_id, setFlutterwaveId] = useState(0);
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText]= useState('');


    const go_back = () => {
        navigation.goBack();
    }
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();

    const handleOnRedirect = (data) => {
        setFlutterwaveId({ flutterwave_id: 0 });
        if (data.status == "successful") {
            call_add_wallet();
        } else {
            alert("Sorry, your payment declined");
        }
       // wallet_ref.current.open();
    }


    const openModal = () =>{
        setModalVisible(true);
    }

    const closeModal = () =>{
        setModalVisible(false);
    }


    const close_flutterwave = () => {
        setFlutterwaveId({ flutterwave_id: 0 });
        wallet_ref.current.close();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
//              if (props.paypal_payment_status != 0) {
//                  console.log("wallet received: "+amount);
//                  props.paypal_payment_status = 0;
//                  await props.paypalPaymentStatus(0);
//                  call_add_wallet();
//                  call_wallet();
//             }
            call_wallet();
            call_payment_methods();
        });

        return (
            unsubscribe
        );
    }, []);

    const call_add_wallet = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + add_wallet,
            data: { id: global.id, amount: amount }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    call_wallet();
                    dropDownAlertRef.alertWithType('success', t('success'), t('amountAddedtoWallet'));
                    wallet_ref.current.close();
                    closeModal();
                } else {
                    dropDownAlertRef.alertWithType('error', t('error'), response.data.message);
                }

            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const call_payment_methods = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + payment_methods,
            data: { lang: global.lang }
        })
            .then(async response => {
                setLoading(false);
                setFlutterwaveId(0);
                if (props.paypal_payment_status != 0) {
                    await props.paypalPaymentStatus(0);
                    props.paypal_payment_status = 0;
//                     call_add_wallet();
                } else if (response.data.status == 1) {
                    setPaymentMethodsList(response.data.result)
                }
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const choose_payment = async () => {
        call_payment_methods();
        if (inputText == '' || isNaN(inputText) || parseFloat(inputText) <= 0) {
            alert('Please enter valid amount')
        } else {
            setDialogVisible(false);
            setAmount(parseFloat(inputText));
            await openModal();
        }
    }

    const select_payment = async (item) => {
        await payment_done(item.id);
        //await wallet_ref.current.close();
        closeModal();
    }

    const payment_done = async (payment_id) => {
        setFlutterwaveId(0);
        if (payment_id != 0) {

            if (payment_id == 6) {
               navigate_paypal();
            }
            else if (payment_id == 39) {
               navigate_esewa();
            }
            else if (payment_id == 40) {
               navigate_Fonepay();
            }
              else if (payment_id == 37) {

            }
        }
        else {
            alert("Sorry something went wrong");
        }
    }

    const navigate_paypal = () => {
        navigation.navigate("Paypal", { amount: amount })

    }
    const navigate_Fonepay = () => {
            navigation.navigate("Fonepay", { amount: amount })
        }
    const navigate_esewa = () => {
        navigation.navigate("Esewa", { amount: amount })
    }

    const open_dialog = () => {
        setDialogVisible(true);
    }

    const close_dialogbox = () => {
        setDialogVisible(false);
    }


    const change_filter = (id) => {
        setFilter(id);
        if (id == 1) {
            setData(all);
        } else if (id == 2) {
            setData(expenses);
        } else if (id == 3) {
            setData(receives);
        }
    }

    const call_wallet = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + wallet,
            data: { id: global.id }
        })
            .then(async response => {
                setLoading(false);
                setWalletAmount(response.data.result.wallet);
                setAll(response.data.result.all);
                setExpenses(response.data.result.expenses);
                setReceives(response.data.result.receives);
                setFilter(1);
                setData(response.data.result.all);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

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

    const show_list = ({ item }) => (
        <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
            <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                {item.type == 1 ?
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={income_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                    </View>
                    :
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={expense_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                    </View>
                }
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{Moment(item.created_at).format("DD-MMM-YYYY")}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.message}</Text>
            </View>
            <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                {item.type == 1 ?
                    <Text style={{ color: colors.success, fontSize: f_m, fontFamily: normal }}>+ {global.currency}{item.amount}</Text>
                    :
                    <Text style={{ color: colors.error, fontSize: f_m, fontFamily: normal }}>- {global.currency}{item.amount}</Text>
                }
            </View>
        </View>
    );

    const styles = StyleSheet.create({
        header: {
            height: 60,
            backgroundColor: colors.theme_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        segment_active_bg: { padding: 5, width: 100, backgroundColor: colors.theme_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
        segment_active_fg: { color: colors.theme_fg_three, fontSize: 14, fontFamily: normal },
        segment_inactive_bg: { padding: 5, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
        segment_inactive_fg: { color: colors.text_grey, fontSize: 14, fontFamily: normal },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        modalContent: {
          width: "100%",
          padding: 20,
          backgroundColor: colors.theme_dark,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          position: "absolute",
          bottom: 0,
          minHeight: "50%",
        },
        modalText: {
          fontSize: 18,
          marginBottom: 20,
          fontFamily: normal,
          color: colors.theme_fg_two,
        },
    });


    return (
    <>
          <View
          style={{
            backgroundColor: colors.theme_bg,
            height: Platform.OS === 'ios' ? insets.top : null,
          }}>
          <StatusBar
            backgroundColor={colors.theme_bg}
          />
          </View>
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('wallet')}</Text>
                </View>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <DropShadow
                        style={{
                            width: '100%',
                            marginBottom: 5,
                            marginTop: 5,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 5,
                        }}
                    >
                        <View style={{ width: '100%', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon type={Icons.MaterialIcons} name="credit-card" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                </View>
                                <View style={{ width: '55%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.text_grey, fontSize: f_s, fontFamily: normal }}>{t('totalBalance')}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={1} onPress={open_dialog} style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg, fontSize: f_xs, fontFamily: normal }}>{t('topups')} +</Text>
                                </TouchableOpacity>
                                <View style={{ height: 2, borderBottomWidth: 1, borderColor: colors.grey }} />
                            </View>
                            <View style={{ height: 10, borderBottomWidth: 1, borderColor: colors.grey, width: '85%', alignSelf: 'flex-end', borderStyle: 'dotted', marginBottom: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginLeft: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_30, fontFamily: normal, letterSpacing: 1 }}>{global.currency}{wallet_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </DropShadow>
                </View>
                <View style={{ padding: 20 }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.text_grey, fontSize: f_s, fontFamily: normal }}>{t('transactionsList')}</Text>
                    <View style={{ margin: 10 }} />
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '33%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={change_filter.bind(this, 1)} style={[filter == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('all')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={change_filter.bind(this, 2)} style={[filter == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('expenses')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={change_filter.bind(this, 3)} style={[filter == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                                <Text style={[filter == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('receives')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ margin: 10 }} />
                    <View style={{ flex: 1 }}>
                        {data.length > 0 ?
                            <FlatList
                                data={data}
                                renderItem={show_list}
                                keyExtractor={item => item.id}
                            />
                            :
                            <View style={{ height: 300, width: 300, alignSelf: 'center' }}>
                                <LottieView source={no_data_loader} autoPlay loop />
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { minHeight: "25%" }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.modalText}>{t('loadMoney')}</Text>
                  <TouchableOpacity onPress={()=> closeModal()}>
                  <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                  </TouchableOpacity>
                </View>
                  <FlatList
                style={{backgroundColor:colors.theme_dark}}
                    data={payment_methods_list}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={{ flexDirection: 'row', padding: 15, marginTop: 10, width: '100%', alignSelf: 'center', justifyContent: 'space-between' }} onPress={select_payment.bind(this, item)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 50 }}>
                                    <Image
                                        style={{ flex: 1, height: 55, width: 55, borderRadius: 15 }}
                                        source={{ uri: img_url + item.icon }}
                                    />
                                </View>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: normal, fontSize: f_xl, alignItems: 'center', justifyContent: 'flex-start', color:colors.theme_fg_two, paddingLeft: 20 }}>{item.payment}</Text>
                                </View>
                            </View>
                            <Icon type={Icons.MaterialIcons} name="chevron-right" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.id}
                />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="fade"
              transparent={true}
              visible={isDialogVisible}
              onRequestClose={close_dialogbox}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { minHeight: "30%" }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.modalText}>{t('addWallet')}</Text>
                      <TouchableOpacity onPress={()=> close_dialogbox()}>
                      <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: normal, color: colors.theme_fg_two }}>{t('pleaseEnter')}</Text>
                    <TextInput
                      ref={inputRef}
                      placeholder={' '+t('enterAmount') + ' in NRS'}
                      placeholderTextColor={colors.grey}
                      keyboardType="numeric"
                      style={{
                        backgroundColor: colors.text_container_bg,
                        width: "100%",
                        borderRadius: 15,
                        borderWidth: 1,
                        marginTop: 10,
                        color: 'black'
                      }}
                      onChangeText={setInputText}
                    />
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                    <TouchableOpacity onPress={()=>choose_payment()} style={{ borderRadius: 5, flexDirection:'row', alignItems: 'center' }}>
                    <Text style={{ fontSize:18, color: colors.medics_blue, fontFamily: normal}}>{t('next')}</Text>
                     <Icon type={Icons.MaterialCommunityIcons} name="arrow-right" color={colors.medics_blue} style={{ fontSize: 22 }} />
                    </TouchableOpacity>
                    </View>
                </View>
              </View>
            </Modal>

        </SafeAreaView>
     {drop_down_alert()}
     </>

    );
};



function mapStateToProps(state) {
    return {
        paypal_payment_status: state.payment.paypal_payment_status,
        esewa_payment_status: state.payment.esewa_payment_status

    };
}

const mapDispatchToProps = (dispatch) => ({
    paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data)),
    esewaPaymentStatus: (data) => dispatch(esewaPaymentStatus(data))

});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);