import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar,
    LayoutAnimation, UIManager, Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, f_xl, f_xs, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateRole } from '../actions/RegisterActions';
import { useLocalization } from '../config/LocalizationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';

const CheckPerson = (props) => {
    const navigation = useNavigation();
    const [role, setRole] = useState('');
    let dropDownAlertRef = useRef();
    const inputRef = useRef();
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {}, []);

    const toggleDropdown = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setIsOpen(false);
    };

    const navigate = async () => {
        if (role) {
            props.updateRole(role);
            navigation.navigate('CreateEmail');
        } else {
            dropDownAlertRef.alertWithType('error', 'Error', 'Please select a role');
        }
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
            width: '100%',
            justifyContent: 'center',
            paddingLeft: 10,
        },
        dropdown: {
            backgroundColor: colors.text_container_bg,
            borderRadius: 5,
            width: '100%',
        },
        dropdownItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.grey,
        },
    });

    return (
        <>
            <View
                style={{
                    backgroundColor: colors.theme_bg,
                    height: Platform.OS === 'ios' ? insets.top : null,
                }}>
                <StatusBar backgroundColor={colors.theme_bg} />
            </View>
            <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

                <View style={[styles.header]}>
                    <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ margin: 20 }} />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Choose your role</Text>
                    <View style={{ margin: 5 }} />
                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}>Are you a patient or patient's family member?</Text>
                    <View style={{ margin: 20 }} />
                    <View style={{ width: '80%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                                <Icon type={Icons.MaterialCommunityIcons} name="account-question" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                            </View>
                            <View style={{ width: '75%', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                                <TouchableOpacity style={styles.textinput} onPress={toggleDropdown}>
                                    <Text style={{fontSize: f_m, color: colors.grey,}}>{role ? role : "Select your role"}</Text>
                                </TouchableOpacity>
                                {isOpen && (
                                    <View style={styles.dropdown}>
                                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleRoleSelect('Patient')}>
                                            <Text style={{ fontSize: f_m, color: colors.grey }}>Patient</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleRoleSelect('Family Member')}>
                                            <Text style={{ fontSize: f_m, color: colors.grey }}>Family Member</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{ margin: 30 }} />
                        <TouchableOpacity
                            activeOpacity={role ? 1 : 0.7}
                            onPress={navigate}
                            style={{
                                width: '100%',
                                backgroundColor: colors.medics_blue,
                                borderRadius: 10,
                                height: 50,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text style={{ color:'white', fontSize: f_m, fontFamily: bold }}>{t('next')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            {drop_down_alert()}
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    updateRole: (data) => dispatch(updateRole(data)),
});

export default connect(null, mapDispatchToProps)(CheckPerson);
