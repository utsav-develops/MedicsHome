import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    ScrollView,
    Keyboard,
    StatusBar,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { api_url, register, normal, bold, regular, f_xl, f_xs, f_m , btn_loader} from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';

const CreatePassword = (props) => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirm_password, setConfirmPassword] = useState('');
    const [referral_code, setReferralCode] = useState('');

    let dropDownAlertRef = useRef();
    const inputRef = useRef();
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setTimeout(() => inputRef.current.focus(), 100)
    }, []);


    const check_valid = () => {
        if (password) {
            check_password();
        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('pleaseEnterPassword'));
        }
    }

    const check_password = () => {
        if (password == confirm_password) {
            //navigation.navigate('Home');
            call_register();
        } else {
            dropDownAlertRef.alertWithType('error',  t('validationError'), t('passwordsDidnotMatch'));
        }
    }
    console.log(props.role);
    console.log(props.role=='Patient'? 1 : 0);

    const call_register = async () => {

        Keyboard.dismiss();
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + register,
            data: { fcm_token: global.fcm_token, phone_number: props.phone_number, phone_with_code: props.phone_with_code, country_code: props.country_code, first_name: props.first_name, last_name: props.last_name, email: props.email, role: props.role=='Patient'? 1 : 0, password: password, referral_code: referral_code }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    save_data(response.data.result, response.data.status, response.data.message, response.data.patient_id);
                } else {
                    dropDownAlertRef.alertWithType('error',t('error'), response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
                dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
            });
    }

    const save_data = async (data, status, message, patient_id) => {

        if (status == 1) {
            try {
            console.log(patient_id);
                await AsyncStorage.setItem('id', data.id.toString());
                if(patient_id !== null){
                    await AsyncStorage.setItem('patient_id', patient_id.toString());
                    await AsyncStorage.setItem('role', 'Patient');
                }
                else{
                    await AsyncStorage.setItem('role', 'Family Member');
                }
                await AsyncStorage.setItem('first_name', data.first_name.toString());
                await AsyncStorage.setItem('profile_picture', data.profile_picture.toString());
                await AsyncStorage.setItem('phone_with_code', data.phone_with_code.toString());
                await AsyncStorage.setItem('email', data.email.toString());
                await AsyncStorage.setItem('role', props.role.toString());
                global.id = await data.id;
                global.patient_id = await patient_id;
                global.first_name = await data.first_name;
                global.phone_with_code = await data.phone_with_code;
                global.email = await data.email;
                global.role = await props.role;
                global.profile_picture = await data.profile_picture;
                await navigate();
            } catch (e) {
                console.log(e);
                dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
            }
        } else {
            dropDownAlertRef.alertWithType('error',  t('error'), message);
        }
    }

    const navigate = async (data) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
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
    const styles = StyleSheet.create({
        header: {
            height: 60,
            backgroundColor: colors.lite_bg,
            flexDirection: 'row',
            alignItems: 'center'
        },
        textinput: {
            fontSize: f_m,
            color: colors.grey,
            fontFamily: regular,
            height: 60,
            backgroundColor: colors.text_container_bg,
            width: '100%'
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
        <ScrollView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>{t('createPassword')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>{t('createNewPassword')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="lock" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                ref={inputRef}
                                placeholder={t('password')}
                                secureTextEntry={true}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setPassword(TextInputValue)}
                            />
                        </View>
                    </View>
                    <View style={{ margin: 10 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="lock" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                placeholder= {t('confirmPassword')}
                                secureTextEntry={true}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setConfirmPassword(TextInputValue)}
                            />
                        </View>
                    </View>
                    <View style={{ margin: 10 }} />
                    <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Referral Code</Text>
                    <View style={{ margin: 10 }} />

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="person" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                placeholder= {'Referral Code (Optional)'}
                                secureTextEntry={false}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setReferralCode(TextInputValue)}
                            />
                        </View>
                    </View>

                    <View style={{ margin: 30 }} />
                    {loading == false ?
                        <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>{t('register')}</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView source={btn_loader} autoPlay loop />
                        </View>
                    }

                </View>
            </View>

        </ScrollView>
        {drop_down_alert()}
        </>
    );
};



function mapStateToProps(state) {
    return {
        phone_number: state.register.phone_number,
        phone_with_code: state.register.phone_with_code,
        country_code: state.register.country_code,
        first_name: state.register.first_name,
        last_name: state.register.last_name,
        email: state.register.email,
        role: state.register.role,
    };
}

export default connect(mapStateToProps, null)(CreatePassword);