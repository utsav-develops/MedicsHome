import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import Icon, { Icons } from "../components/Icons";
import { useLocalization } from "../config/LocalizationContext";
import { useCustomTheme } from "../config/useCustomTheme";
import {
  normal,
  regular,
  bold,
  f_xxl,
  api_url,
  img_url,
  get_patient_logs_details,
  btn_loader,
  target_goal,
  Auth_Token
} from "../config/Constants";
import * as colors from "../assets/css/Colors";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const hexToRgba = (hex, alpha) => {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    console.error(`Invalid hex color: ${hex}`);
    return `rgba(0, 0, 0, ${alpha})`; // Return a default color if invalid
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DetailsScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const patient_sub_category_id = useState(
    route.params?.patient_sub_category_id
  );
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    subcategory_name: "",
    items: {},
    comment: "",
    images: [],
    witness_name: "",
    witness_phone: "",
    goals: [],
  });

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    fetchDataDetails();
  }, []);

  const fetchDataDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(api_url + "staff/get_patient_logs_details", {
        patient_id: global.patient_id ? global.patient_id : global.pat_id,
        patient_subcategory_id: patient_sub_category_id[0],
        token: Auth_Token,
      });

      const data = response.data.result;
      data.images = JSON.parse(data.images);
      setDetails(data);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setLoading(false);
      console.log(JSON.stringify(data));
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const renderGallery = () => {
    return details.images.map((image, index) => (
    <TouchableOpacity style={{marginRight:10}} onPress={()=> navigation.navigate("ImageView",{ photoUri: image })}>
      <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
    </TouchableOpacity>
    ));
  };

  const renderGoals = () => {
    return (
      <>
        {details.goals.map((goal, index) => (
          <View
            key={index}
            style={styles.goals_box}>
            <View style={{ width: '20%' }}>
            <Image style={{ height: 50, width: 50, flex: 1, resizeMode:'contain' }} source={target_goal} />
            </View>
            <View style={{ width: '80%' }}>
            <View>
            <Text style={{ fontSize: 16, fontweight: normal, color: colors.theme_fg_two }}>
              {goal.Description}
            </Text>
            </View>
            <View style={{ width: '100%', alignItems: 'flex-end',}}>
            <Text style={{ fontSize: 12, fontweight: normal, marginTop: 15, backgroundColor: hexToRgba(details.color, 1),  padding:8, color:'white', borderRadius:11 }}>
              {goal.SetDate} to {goal.TargetDate}
            </Text>
            </View>
            </View>
          </View>
        ))}
      </>
    );
  };


  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.dark_White,
    },
    header: {
      height: "25%",
      backgroundColor:  hexToRgba(details.color, 1),
      zIndex: 1,
      width: "100%",
    },
    headerTitle: {
      fontSize: 34,
      fontweight: bold,
      color: "white",
      alignSelf: "center",
      marginTop: "10%",
    },
    container: {
      flex: 1,
      backgroundColor: colors.dark_White,
      marginTop: 80,
    },
    categoryIconBox: {
      height: 80,
      aspectRatio: 1,
      backgroundColor: hexToRgba(details.color, 1),
      alignSelf: "center",
      borderRadius: 100,
      position: "absolute",
      top: -40,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 20,
    },
    midContainer: {
      height: "70%",
      width: "80%",
      backgroundColor: colors.dark_White,
      alignSelf: "center",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: -70,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 20,
    },
    patientName: {
      fontweight: bold,
      fontSize: 28,
      color: colors.theme_fg_two,
      marginTop: 20,
    },
    subHeading: {
      fontSize: 24,
      color: colors.theme_fg_two,
      fontweight: bold,
      marginBottom: 15,
      alignSelf: "center",
    },
    conditions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
      width: "100%",
      backgroundColor: hexToRgba(details.color, 0.3),
      padding: 15,
      borderRadius: 10,
    },
    commentBox: {
      width: "100%",
      padding: 10,
      marginTop: 10,
      alignSelf: "center",
    },
    comment: {
      fontSize: 16,
      color: colors.theme_fg_two,
      marginTop: 10,
      padding: 10,
      fontweight: normal,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: hexToRgba(details.color, 1),
    },
    goals_box: {
      width: "100%",
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginTop: 10,
      borderRadius: 20,
      backgroundColor: hexToRgba(details.color, 0.3),
      flexDirection: 'row',
      alignItems: 'center'
    },
    galleryContainer: {
      marginTop: 15,
      flexDirection: "row",
      padding: 10,
      width: "100%",
      height: '15%',
      gap: 25,
    },
    galleryImage: {
      width: 100,
      height: 100,
      aspectRatio: 1,
      borderRadius: 10,
      marginRight:10,
    },
     iconImage: {
       height: 80,
       width: 80,
       resizeMode: 'contain',
     },
  });

  const formatSavedDate = (savedDate) => {
    // If savedDate is a string, convert it to a Date object
    const date = new Date(savedDate);
    return date.toLocaleString(); // Returns the local date and time string
  };

   const iconUrl = details.icon ? img_url + details.icon : null;
    console.log('Icon URL:', iconUrl);

  return (
    <>
      <View
        style={{
          backgroundColor: hexToRgba(details.color, 1),
          height: Platform.OS === "ios" ? insets.top : null,
        }}
      >
        <StatusBar backgroundColor={hexToRgba(details.color, 1)} />

      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon
              type={Icons.MaterialIcons}
              name="arrow-back"
              color="white"
              style={{ fontSize: 30, position: "absolute", top: 5, left: 5 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{details.subcategory_name}</Text>
          <View style={styles.midContainer}>
         <View style={styles.categoryIconBox}>
           <Image
             style={styles.iconImage}
             source={{ uri: iconUrl }}
           />
         </View>
            <Text style={styles.patientName}>
                {firstName} {lastName}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.theme_fg_two,
                fontweight: normal,
                marginTop: 10,
              }}
            >
                    {loading == true ?
                    <View style={{ width: 50, height:50, alignSelf: 'center', }}>
                      <LottieView source={btn_loader} autoPlay loop />
                    </View>
                  :
                  formatSavedDate(details.saved_date)

                }
            </Text>
          </View>
        </View>

        <ScrollView style={styles.container}>
          {/* Conditions */}
          <View style={{ padding: 10, marginTop: 15, borderRadius: 10 }}>
            <Text style={styles.subHeading}>Conditions</Text>

            {Object.values(details.items).map((item) => (
              <View key={item.itemId} style={styles.conditions}>
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      color: colors.theme_fg_two,
                      fontweight: bold,
                      fontSize: 16,
                    }}
                  >
                    {item.itemName}
                  </Text>
                </View>
                <View style={{ width: "50%", alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color: colors.theme_fg_two,
                      fontweight: normal,
                      fontSize: 16,
                    }}
                  >
                    {item.optionName}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Comment */}
          {details.comment && (
            <View style={{ padding: 10, marginTop: 15, borderRadius: 10 }}>
              <View style={styles.commentBox}>
                <Text style={styles.subHeading}>Comment</Text>
                <Text style={styles.comment}>{details.comment}</Text>
              </View>
            </View>
          )}

          {/* Goals Section */}
          {details.goals && details.goals.length > 0 && (
            <View style={{ padding: 10, marginTop: 15, borderRadius: 10 }}>
              <Text style={styles.subHeading}>Goals</Text>
              {renderGoals()}
            </View>
          )}

          {/* Images */}
          {details.images && details.images.length > 0 && (
            <View style={{ padding: 10, marginTop: 15, borderRadius: 10, }}>
              <Text style={styles.subHeading}>Images</Text>
              <View style={{ borderRightWidth: 4, borderLeftWidth: 4, borderColor: hexToRgba(details.color, 1), borderRadius: 20, alignItems: 'center'}}>
              <ScrollView horizontal={true}>
                <View style={styles.galleryContainer}>{renderGallery()}</View>
              </ScrollView>
              </View>
            </View>
          )}

          {/* Witness */}
          {details.witness_name && details.witness_phone ? (
            <View style={{ padding: 10, marginTop: 85, borderRadius: 10 }}>
              <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <Text style={{ color: hexToRgba(details.color, 1), fontSize: 18, fontStyle: 'italic',  }}>Witnessed by</Text>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontSize: 18, color: colors.theme_fg_two, fontweight: normal }}>
                    {details.witness_name}
                  </Text>
                  <Text style={{ fontSize: 16, color: colors.theme_fg_two, fontweight: normal, marginTop: 5 }}>
                    {details.witness_phone}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          <View style={{ marginTop: 20 }}/>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DetailsScreen;
