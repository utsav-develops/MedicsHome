import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, profile_update, change_phone, api_url, btn_loader, f_xl, f_xs, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import OTP from '../views/OTP';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const EditPhoneNumber = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [phone_number, setPhoneNumber] = useState('');
    const [formattedValue, setFormattedValue] = useState("");
    const [value, setValue] = useState("");
    const [country_code, set_country_code] = useState("44");
    const { t } = useLocalization();

     const navigate_otp = async (data_o) => {
        navigation.navigate('OTP', { otp: data_o.otp, phone_with_code: "+" + country_code+ phone_number, country_code: "+" + country_code, phone_number: phone_number, id: 0, from: "profile" });
    }

    let dropDownAlertRef = useRef();
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setTimeout(() => inputRef.current.focus(), 100)
    }, []);


    const check_valid = () => {
        if (phone_number) {
            call_change_phone();
        } else {
            dropDownAlertRef.alertWithType('error', t('validationError'), t('enterPhonenum'));
        }
    }
        const call_change_phone = async () => {
                setLoading(true);
                await axios({
                    method: 'post',
                    url: api_url + change_phone,
                    data: { phone_with_code: "+" + country_code+ phone_number }
                })
                    .then(async response => {
                        setLoading(false);
                        console.log(response.data.result);
                        navigate_otp(response.data.result);
                    })
                    .catch(error => {
                        setLoading(false);
                        dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
                    });
            }


    const call_profile_update = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + profile_update,
            data: { staff_id: global.id, phone_number: phone_number }
        })
            .then(async response => {
                setLoading(false);
                dropDownAlertRef.alertWithType('success', t('successfullyUpdated'), t('phnNumUpdated'));
                go_back();
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

    return (
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 20 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('enterPhonenum')}</Text>
                <View style={{ margin: 5 }} />
                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontWeight: 'normal' }}>{t('needEnter')}</Text>
                <View style={{ margin: 20 }} />
                <View style={{ width: '80%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialCommunityIcons} name="account-edit" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                ref={inputRef}
                                secureTextEntry={false}
                                placeholder={t('phoneNum')}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                onChangeText={TextInputValue =>
                                    setPhoneNumber(TextInputValue)}
                            />
                        </View>
                    </View>
                    <View style={{ margin: 30 }} />
                    {loading == false ?
                        <TouchableOpacity onPress={check_valid.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('next')}</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView source={btn_loader} autoPlay loop />
                        </View>
                    }
                </View>

            </View>
            {drop_down_alert()}
        </SafeAreaView>
    );
};

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
        fontweight: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,
        width: '100%'
    },
});

export default EditPhoneNumber;