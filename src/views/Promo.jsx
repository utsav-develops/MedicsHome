import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, bold, regular, api_url, promo_codes, loader, btn_loader, f_m, f_s, f_xl } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropShadow from "react-native-drop-shadow";
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { updatePromo } from '../actions/BookingActions';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const Promo = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        call_promo_codes();
    }, []);

    const call_promo_codes = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + promo_codes,
            data: { lang: global.lang, workplace_id: global.id }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const call_apply_promo = (data) => {
        props.updatePromo(data);
        global.promo_id = data.id;
        go_back();
    }

    const show_list = ({ item }) => (
        <View style={{ alignItems: 'center' }}>
            <DropShadow
                style={{
                    width: '95%',
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
                <View style={{ margin: 2.5 }} />
                <View style={{ width: '100%', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 20, marginTop: 5, marginBottom: 5 }}>
                    <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: bold }}>{item.promo_name}</Text>
                        <View style={{ margin: 3 }} />
                        <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.description}</Text>
                    </View>
                    <View style={{ margin: 5 }} />
                    <View style={{ width: '100%', borderRadius: 10, flexDirection: 'row', borderWidth: 1, padding: 10, backgroundColor: colors.text_container_bg, borderStyle: 'dotted' }}>
                        <View style={{ width: '70%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg, fontSize: f_m, fontFamily: normal }}>{global.currency}{item.discount}{t('OFF')}</Text>
                        </View>
                        {loading == true ?
                            <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                                <LottieView source={btn_loader} autoPlay loop />
                            </View>
                        :
                            <TouchableOpacity onPress={call_apply_promo.bind(this, item)} activeOpacity={1} style={{ width: '30%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, borderRadius: 10, padding: 10 }}>
                                <Text style={{ color: colors.theme_fg_three, fontSize: f_s, fontFamily: normal }}>{t('apply')}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </DropShadow>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            height: screenHeight,
            width: screenWidth,
            backgroundColor: colors.lite_bg
        },
        header: {
            height: 60,
            backgroundColor: colors.theme_bg,
            flexDirection: 'row',
            alignItems: 'center'
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
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('promoCodes')}</Text>
                </View>
            </View>
            <ScrollView>
                <FlatList
                    data={data}
                    renderItem={show_list}
                    keyExtractor={item => item.id}
                />
            </ScrollView>
            {loading == true &&
                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                    <LottieView source={loader} autoPlay loop />
                </View>
            }
        </SafeAreaView>
        </>
    );
};



const mapDispatchToProps = (dispatch) => ({
    updatePromo: (data) => dispatch(updatePromo(data)),
});

export default connect(null, mapDispatchToProps)(Promo);
