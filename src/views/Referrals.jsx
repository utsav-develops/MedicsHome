import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, img_url, api_url,gift, add_wallet,success_icon,gift_icon, no_data_loader, income_icon, expense_icon, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import RBSheet from "react-native-raw-bottom-sheet";
import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import { Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';
import nurse_refer from '../assets/img/nurse_refer.png';


const ReferralDetails = () => {
    const navigation = useNavigation();
    let dropDownAlertRef = useRef();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [payment_methods_list, setPaymentMethodsList] = useState([]);
    const wallet_ref = useRef(null);
    const [data, setData] = useState([]);
    const [all, setAll] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [receives, setReceives] = useState([]);
    const [actual_received, setActualReceives] = useState([])
    const [gift_remaining, setRemainingCount] = useState(null)
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [wallet_amount, setWalletAmount] = useState(0);
    const [filter, setFilter] = useState(1);
    const [flutterwave_id, setFlutterwaveId] = useState(0);
    const [isQRCodeVisible, setQRCodeVisible] = useState(false);
    const { t } = useLocalization();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();
    const[wrapper, setShowWrapper] = useState(true);

    const go_back = () => {
        navigation.goBack();
    }

    const [referralMessage, setReferralMessage] = useState("");
    const [referralCode, setReferralCode] = useState("");

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            call_wallet();
            call_staff_referral_message();
        });

        return unsubscribe;
    }, []);



    const filterReferralReceives = () => {
//             return receives.filter(item => item.message.includes("Referral Bonus"));
            return receives;
    }

        const change_state = () => {
                setShowWrapper(!wrapper);
        }

    const call_staff_referral_message = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + 'workplace/get_referral_message', // replace with your endpoint
            data: { workplace_id: global.id, lang: 'en' }
        })
            .then(response => {
                setLoading(false);
                setReceives(response.data.referred_name);
                console.log(response.data);
                setReferralMessage(response.data.result.referral_message);
                setRemainingCount(response.data.gift_count_remaining);
                setReferralCode(response.data.code);
            })
            .catch(error => {
            console.log(error.response);
                setLoading(false);
                alert('Sorry something went wrong');
            });
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
                setFilter(1);
                setData(response.data.result.all);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong');
            });
    }

    const close_dialogbox = () => {
        setDialogVisible(false);
    }

    const shareReferralCode = async () => {
        try {
            const result = await Share.share({
                message: `Start Locum with [App Name] and use my referral code ${referralCode} to get [referral_amount] into your wallet. Download the app here: [App Download Link]`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const drop_down_alert = () => {
        return (
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
            />
        );
    }


    const show_list = ({ item }) => (
    <>

        <View style={{ flexDirection: 'row', width: '100%', padding: 10, marginTop: 5}}>
            <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <View style={{ height: 50, width: 50 }}>
                    <Image source={success_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: normal }}>{item.first_name} Used your referral</Text>
            </View>

        </View>
        <View style={{width:'70%',backgroundColor: colors.medics_grey, height: 1, alignSelf: 'center', marginTop: 5}} />
        </>
    );


    const toggleQRCodeModal = () => {
        setQRCodeVisible(prev => !prev);
    };

    const styles = StyleSheet.create({
        safeAreaView: {
            backgroundColor: colors.lite_bg,
            flex: 1
        },
        header: {
            height: 60,
            backgroundColor: colors.theme_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        backButton: {
            width: '15%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        backIcon: {
            fontSize: 30,
            color: colors.theme_fg_three
        },
        headerTitle: {
            width: '85%',
            color: colors.theme_fg_three,
            fontSize: f_xl,
            fontFamily: bold
        },
        scrollView: {
            flex: 1
        },
        container: {
            padding: 20
        },
//         referralSection: {
//             borderRadius: 0,
//             marginBottom: 0,
//             shadowColor: "#000",
//             shadowRadius: 20,
//         },
        referralHeading: {
            fontSize: 22,
            fontFamily: bold,
            color: colors.text_grey,
            marginBottom: 5,
            textAlign: "center"
        },
        referralText: {
            fontSize: 16,
            color: colors.medics_grey,
            marginBottom: 15,
            padding: 10,
        },
        referralCodeContainer: {
            backgroundColor: colors.lite_bg,
            borderRadius: 0,
            width: '100%',
            marginBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
        },
        referralCodeLabel: {
            fontSize: 18,
            fontFamily: bold,
            color: colors.theme_fg_two,
            marginBottom: 5,
            textAlign: "center"
        },
        referralCodeLabel1: {
            fontSize: 18,
            fontFamily: normal,
            color: colors.medics_grey,
            marginBottom: 5,
        },
        referralCode: {
            fontSize: 26,
            fontFamily: bold,
            color: colors.medics_grey,
            textAlign: "center"
        },
        referralCodeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        referralCodeColumn: {
            flexDirection: 'column',
        },
        qrCodeButton: {
            marginLeft: 10
        },
        qrCodeIcon: {
            fontSize: 80,
            color: colors.medics_blue,
        },
        shareButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.button,
            borderRadius: 5,
            padding: 10,
            justifyContent: 'center'
        },
        shareButtonText: {
            color: colors.medics_blue,
            fontFamily: bold,
            fontSize: 20,
            marginRight: 10,
            justifyContent: 'center'
        },
        shareIcon: {
            color: colors.medics_blue,
            fontSize: 20
        },
        listItem: {
            flexDirection: 'row',
            width: '100%',
            marginTop: 10,
            marginBottom: 10
        },
        dateText: {
            width: '20%',
            color: colors.text_grey,
            fontSize: f_xs,
            fontFamily: normal
        },
        messageText: {
            width: '50%',
            color: colors.theme_fg_two,
            fontSize: f_s,
            fontFamily: normal
        },
        amountText: {
            width: '30%',
            textAlign: 'right',
            color: colors.success,
            fontSize: f_m,
            fontFamily: normal
        },
//         noDataView: {
//             height: 300,
//             width: 300,
//             alignSelf: 'center'
//         },
        modalView: {
            position: 'absolute',
            top: 115,
            alignSelf: 'center',
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        closeModalButton: {
            backgroundColor: colors.medics_blue,
            padding: 10,
            borderRadius: 15,
        },
        closeModalButtonText: {
            color: "white",
            fontFamily: bold,
            textAlign: "center",
            fontSize: f_xl,
        },
//         segment_active_bg: {
//             padding: 5,
//             width: 100,
//             backgroundColor: colors.theme_bg,
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: 10
//         },
//         segment_active_fg: {
//             color: colors.theme_fg_three,
//             fontSize: 14,
//             fontFamily: normal
//         },
//         segment_inactive_bg: {
//             padding: 5,
//             width: 100,
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: 10
//         },
//         segment_inactive_fg: {
//             color: colors.text_grey,
//             fontSize: 14,
//             fontFamily: normal
//         },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }
    });

    const filteredReceives = filterReferralReceives();

    return (
        <>
            <View
                style={{
                    backgroundColor: colors.theme_bg,
                    height: Platform.OS === 'ios' ? 50 : null,
                }}>
                <StatusBar
                    backgroundColor={colors.theme_bg}
                />
            </View>

            <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
                <View style={[styles.header]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.goBack()}
                        style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                    <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('referralDetails')}</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <View>
                        <View style={styles.referralSection}>

                            <View style={styles.referralCodeContainer}>
                                <Text style={styles.referralCodeLabel}>{t('yourReferralCode')}</Text>

                                    <View style={styles.referralCodeRow}>
                                    <TouchableOpacity onPress={toggleQRCodeModal} style={styles.qrCodeButton}>
                                        <Icon type={Icons.MaterialIcons} name="qr-code" style={styles.qrCodeIcon} />
                                    </TouchableOpacity>
                                    <View style={styles.referralCodeColumn}>
                                     <Text style={styles.referralCode}>{referralCode}</Text>
                                    <TouchableOpacity onPress={shareReferralCode} style={styles.shareButton}>
                                         <Text style={styles.shareButtonText}> {t('shareCode')}</Text>
                                         <Icon type={Icons.MaterialIcons} name="share" style={styles.shareIcon} />
                                     </TouchableOpacity>
                                </View>
                                </View>
                            </View>
                        </View>
                    </View>

 <SafeAreaView style={{ justifyContent: 'space-between', flexDirection:'row', padding:10 }}>
      <View style={{ padding: 10, width:'60%', borderRadius: 15}}>
        <FlatList
          data={[
            { key: 'Invite your colleauges to join Medics' },
            { key: 'Click QR to scan or Share referral code' },
            { key:  referralMessage },
          ]}
           renderItem={({ item }) => {
                     return (

                       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width:'100%',height: undefined }}>
                         <View style={{ width: 7, height: 7, borderRadius: 9, backgroundColor: colors.medics_blue}} />
                         <Text style={{ fontSize: 18, margin: 'auto', marginLeft:10, color: 'grey',padding:1 }}>{item.key}</Text>
                       </View>
                     );
                   }}
                   keyExtractor={(item) => item.key}
                 />
               </View>
{/*                { height: 230, width:170 } */}
                <View style={{ height: 200, width:145 }}>
                    <Image source={nurse_refer} style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
             </SafeAreaView>

{/* <View style={{margin: 5}} /> */}

 <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Text style={styles.referralCodeLabel1}>{t('referralreceived')}</Text>
                <View style={{ height: 2, width: '100%', backgroundColor: colors.text_grey }} />
                <View style={{ margin: 2 }} />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{  paddingHorizontal: 10, borderTopColor: colors.text_grey, borderRadius: 10 }}>
                {filteredReceives.length > 0 ? (
                    <FlatList
                        data={receives}
                        renderItem={show_list}
                        keyExtractor={(item, index) => index.toString()}
                    />
                ) : (
                    <View style={{ height: 300, width: 300, alignSelf: 'center' }}>
                        <LottieView source={no_data_loader} autoPlay loop />
                    </View>
                )}
            </ScrollView>
          </View>
        </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isQRCodeVisible}
                    onRequestClose={() => setQRCodeVisible(false)}
                >
                    <StatusBar hidden={false} />
                    <View style={styles.overlay}></View>
                    <View style={styles.modalView}>
                        <QRCode value={referralCode} size={250} />
                        <View style={{ marginTop: 20 }} />
                        <TouchableOpacity onPress={toggleQRCodeModal} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {filteredReceives.length > 0?
                <>
                {wrapper?
                <View style = {{position:'absolute', bottom:0,width:'100%', height:'20%', borderTopLeftRadius:20, borderTopRightRadius:20, justifyContent:'center',backgroundColor:'orange' }}>
                    <Image source={gift_icon} style={{ flex: 1, height: undefined, width: undefined, }} />
                    {gift_remaining != 0?
                    <View style={{position:'absolute', top:0, alignItems:'center', alignSelf:'center',justifyContent:'center', borderBottomLeftRadius:100, borderBottomRightRadius:100, width:70, height:70, backgroundColor:'white'}}>
                        <Text style={{fontFamily: bold, color:'black', fontSize:50, top:0, position:'absolute' }}>{gift_remaining}</Text>
                    </View>
                    :
                    <TouchableOpacity onPress={ () => navigation.navigate('AboutUs')} style={{position:'absolute', top:0, alignItems:'center', alignSelf:'center',justifyContent:'center', borderBottomLeftRadius:50, borderBottomRightRadius:50, width:'60%', height:50, backgroundColor:'white'}}>
                            <Text style={{fontFamily: bold, color:'black', fontSize:30, top:0, position:'absolute', flexWrap:'wrap'}}>Contact Us</Text>
                    </TouchableOpacity>
                    }

                    <TouchableOpacity onPress = {change_state} style={{position:'absolute', top:0, right:0, alignItems:'center',justifyContent:'center', borderBottomLeftRadius:100, borderBottomRightRadius:100, width:50, height:50, backgroundColor:'white'}}>
                        <Icon type={Icons.AntDesign} name="down" color={'black'} style={{ fontSize: 30 }} />
                    </TouchableOpacity>

                    <View style={{position:'absolute', bottom:0, height:'35%',width:'80%', alignSelf:'center',borderTopLeftRadius:20, borderTopRightRadius:20,justifyContent:'center', backgroundColor:'red'}}>
                    {gift_remaining != 0?
                            <Text style={{position:'absolute', fontSize:25, alignSelf:'center', fontFamily: bold, color:'white'}}>More To Unlock Your Gift</Text>
                            :
                            <Text style={{position:'absolute', fontSize:25, alignSelf:'center', fontFamily: bold, color:'white'}}>Hurrayyyy!!!</Text>
                        }
                    </View>
                </View>
                :

                <TouchableOpacity onPress = {change_state} style={{position:'absolute', bottom:0, right:0, alignItems:'center',justifyContent:'center', borderTopLeftRadius:25, width:50, height:50, backgroundColor:'orange'}}>
                        <Text style={{fontFamily: bold, color:'black', fontSize:30, }}>{gift_remaining}</Text>
                </TouchableOpacity>


                }
                </>
                :null
                }
            </SafeAreaView>
        </>
    );
};

export default ReferralDetails;
