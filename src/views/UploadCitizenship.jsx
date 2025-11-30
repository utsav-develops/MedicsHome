import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import the hook
import { useCustomTheme } from '../config/useCustomTheme';
import Icon, { Icons } from '../components/Icons';

const UploadCitizenship = () => {
  const navigation = useNavigation();
  const { colors } = useCustomTheme();
  const { top } = useSafeAreaInsets(); // Get safe area insets for StatusBar

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const go_back = () => {
    navigation.goBack();
  };

  const handleAddFrontImage = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error && !response.customButton) {
        const selectedPhotos = response.assets.map((asset) => asset.uri);
        setFrontImage(selectedPhotos[0]); // Assuming only one image is selected
      }
    });
  };

  const handleAddBackImage = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error && !response.customButton) {
        const selectedPhotos = response.assets.map((asset) => asset.uri);
        setBackImage(selectedPhotos[0]); // Assuming only one image is selected
      }
    });
  };

  const styles = StyleSheet.create({
    header: {
      paddingTop: top, // Use safe area insets for top padding
      height: 60,
      backgroundColor: colors.theme_bg,
      flexDirection: 'row',
      alignItems: 'center'
    },
    uploadedImage: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      borderRadius: 5,
      marginTop: 10,
    },
  });

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={go_back} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <View style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: 18, fontFamily: bold }}>Upload Citizenship</Text>
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: bold, color: colors.theme_fg_two, fontSize: 14, padding: 10 }}>
            Upload your Citizenship Images
          </Text>
          <Text style={{ fontFamily: normal, color: colors.grey, fontSize: 12, marginLeft: 10  }}>
            Uploaded images should be clear
          </Text>
          <View style={{ margin: 10 }} />
          <TouchableOpacity style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row', width:'95%', alignSelf: 'center' }} onPress={handleAddFrontImage}>
            <View style={{ width: '70%' }}>
              <Text style={{ fontFamily: bold, fontSize: 14 }}>Citizenship Front-side Image</Text>
              <View style={{ margin: 5 }} />
              <Text style={{ fontFamily: normal, color: colors.grey, fontSize: 12 }}>Upload your citizenship front side image</Text>
            </View>
            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
              {frontImage && <Image source={{ uri: frontImage }} style={{ width: 50, height: 50 }} />}
            </View>
          </TouchableOpacity>

          <View style={{ margin: 10 }} />

          <TouchableOpacity style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row',width:'95%', alignSelf: 'center' }} onPress={handleAddBackImage}>
            <View style={{ width: '70%' }}>
              <Text style={{ fontFamily: bold, fontSize: 14 }}>Citizenship Back-side Image</Text>
              <View style={{ margin: 5 }} />
              <Text style={{ fontFamily: normal, color: colors.grey, fontSize: 12 }}>Upload your citizenship back side image</Text>
            </View>
            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
              {backImage && <Image source={{ uri: backImage }} style={{ width: 50, height: 50 }} />}
            </View>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </>
  );
};

export default UploadCitizenship;
