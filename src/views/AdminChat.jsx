import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { bold, normal, base_url, width_100, f_xl } from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const AdminChat = () => {

  const navigation = useNavigation();

  const navigate_home = () =>{
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }
     const { t } = useLocalization();
     const insets = useSafeAreaInsets();
     const { isDarkMode, toggleTheme, colors } = useCustomTheme();

     const go_back = () => {
      navigation.goBack();
    }
const styles = StyleSheet.create({
    container: {
        flex:1,
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
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('chatAdmin')}</Text>
            </View>
        </View>
        <WebView 
          source={{ uri: base_url+'workplace_chat/'+global.id }} 
          style={{ width: width_100 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
    </SafeAreaView>
    </>
  )
}


export default AdminChat;
