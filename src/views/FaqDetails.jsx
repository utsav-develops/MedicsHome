//Fixed
import React, { useState } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, f_25, f_s } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';

const FaqDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState(route.params.data);
    const insets = useSafeAreaInsets();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const go_back = () => {
        navigation.goBack();
    }
    const styles = StyleSheet.create({
        container: {
            flex:1,
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
        <SafeAreaView style={styles.container}>

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ backgroundColor: colors.theme_bg_three, padding: 10, margin: 10, borderRadius: 10 }}>
                    <View style={{ margin: 10 }}>
                        <Text ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_25, fontFamily: bold  }}>{data.question}</Text>
                        <View style={{ margin: 10 }} />
                        <Text style={{ color: colors.grey, fontSize: f_s, fontFamily: regular  }}>
                            {data.answer}
                        </Text>
                    </View>
                    <View style={{ margin: 10 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
};



export default FaqDetails;