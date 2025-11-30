import React, {useRef} from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation,  } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, GOOGLE_KEY } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropShadow from "react-native-drop-shadow";
import { Badge, Divider } from '@rneui/themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const PrivacyPolicies = (props) => {
  const navigation = useNavigation();
  const search = useRef();


  const go_back = () => {
    navigation.goBack();
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
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_KEY,
          language: 'en',
        }}
        
    />
      <ScrollView>

      </ScrollView>
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

export default PrivacyPolicies;