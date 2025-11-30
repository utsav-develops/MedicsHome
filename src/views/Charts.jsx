import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import { normal, regular, bold, f_xl, get_patient_logs, api_url, img_url, no_data_loader, Auth_Token} from '../config/Constants';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import LottieView from 'lottie-react-native';


const Charts = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  console.log("patient id " + global.patient_id);

  console.log("pat id " +global.pat_id);
  useEffect(() => {
    fetchChartData();
  }, []);

  useFocusEffect(
      React.useCallback(() => {
        fetchChartData();
        return () => {
          // Cleanup if needed
        };
},[])
  );

  const fetchChartData =  async () => {
    setLoading(true);
        try {
          const response = await axios.post(api_url + "staff/get_patient_logs", {
            patient_id: global.patient_id ? global.patient_id : global.pat_id,
            token:Auth_Token
          });

          setLoading(false);
          setChartData(response.data.result);
          setFirstName(response.data.name);
        } catch (error) {
          setLoading(false);
          console.error(error);
          dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
        }
  };

   const navigateToDetailScreen = (subcategory) => {
      navigation.navigate('DetailScreen', { patient_sub_category_id: subcategory.patient_sub_category_id });
    };

  const handleBack = () => {
    navigation.goBack();
  };


  const handleClose = () => {
    navigation.dismiss();
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.dark_White,

    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.theme_bg,
    },
    headerTitle: {
      fontSize: f_xl,
      fontFamily: bold,
      color: 'white',
      marginLeft: 15,
    },
    container: {
      flex: 1,
      backgroundColor: colors.dark_White,
      paddingTop: 15
    },
    item: {
      padding: 10,
    },
    title: {
      fontFamily: normal,
      fontSize: 20,
      color: colors.theme_fg_two,
      marginBottom:20
    },
    subtitle: {
      fontFamily: normal,
      fontSize: 18,
      color: colors.theme_fg_two,
    },
    savedTime: {
      marginTop: 10,
      fontFamily: normal,
      color: colors.theme_fg_two,
      fontSize: 12
    },
    subCatButton: {
      height: 75,
      width:'100%',
//       backgroundColor: 'rgba(1, 120, 256, 0.1)',
      marginBottom: 25,
      borderRadius: 20,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    comment: {
      marginTop: 10,
      fontStyle: 'italic',
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
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('healthRecords')}</Text>
          </View>
          <ScrollView style={styles.container}>

          {chartData.length == 0 && loading == false ?
          <View style={{ alignItems:'center', justifyContent:'center' }}>
            <LottieView style={{width:250,alignSelf: 'center', height:250}} source={require(".././assets/json/no_favorites.json")} autoPlay loop />
            <Text style={styles.title}>{t('dataUnlogged')}</Text>

          </View>

          :
          <>
            {chartData.map((category) => (
              <View key={category.category_id} style={styles.item}>
                <Text style={styles.title}>{category.category_name}</Text>
                {category.subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory.subcategory_id}
                    style={styles.subCatButton}
                    onPress={() => navigateToDetailScreen(subcategory)}
                  >
                  <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                   <Image source={{ uri: img_url + subcategory.subcategory_icon }}  style={{ height: 60, width: 60 }} />
                    <View style={{ marginLeft: 25 }}>
                      <Text style={styles.subtitle}>{subcategory.subcategory_name}</Text>
                      <Text style={styles.savedTime}>{new Date(subcategory.datetime).toLocaleString()}</Text>
                    </View>
                    </View>
                    <Icon type={Icons.MaterialCommunityIcons} name="chevron-right" color={colors.theme_fg_two} style={{ fontSize: 34  }} />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            </>
            }
          </ScrollView>
          <TouchableOpacity onPress={()=> navigation.navigate('AddRecord')} style={{ height: 45, width: '95%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.medics_blue, marginBottom:10, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontFamily: bold, color: 'white' }}>Add Records</Text>
          </TouchableOpacity>
        </SafeAreaView>
        </>
  );
};

export default Charts;
