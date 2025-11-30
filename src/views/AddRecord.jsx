import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, loader, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import { normal, regular, f_xl, bold, api_url, img_url, Auth_Token} from '../config/Constants';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import DropShadow from 'react-native-drop-shadow';

const AddRecord = (props) => {
      const navigation = useNavigation();
      const route = useRoute();
      const [loading, setLoading] = useState(false);
      const { t } = useLocalization();
      const insets = useSafeAreaInsets();
      const { isDarkMode, toggleTheme, colors } = useCustomTheme();
      const [subCategories, setSubCategories] = useState([]);
      const [CategoryID, setCategoryID] = useState([]);

        const [items, setItems] = useState([]);


    const handleBack = () => {
        navigation.goBack();
      };

    const handleClose = () => {
      navigation.dismiss();
    };


    useFocusEffect(
      React.useCallback(() => {
        fetchSubCategories();
        return () => {
          // Cleanup if needed
        };
      }, [])
    );


    const fetchSubCategories = async () => {
      setLoading(true);
        try {
          const response = await axios.post(api_url + 'get_specific_SubCategories/' + Auth_Token);
          console.log(response.data.result);
          setSubCategories(response.data.result);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching subcategories:", error.response);
        }
      };

      const renderSubCategoryItem = ({ item }) => (
          <View>
            <TouchableOpacity
              style={[styles.categoryItem, { backgroundColor: 'rgba(57, 181, 232, 0.3)' }]}
              onPress={() => navigation.navigate('Items', {
                categoryId: item.CategoryID,
                subCategoryIcon: item.SubCategoryIcon,
                subCategoryId: item.SubCategoryID,
                subCategoryName: item.SubCategoryName,
              })}
            >


              {item.SubCategoryIcon ? (
                <Image source={{ uri: img_url + item.SubCategoryIcon }} style={styles.categoryIcon} />
              ) : (
                <Icon name="play-circle" size={60} color="#fff" /> // default icon
              )}
              <View style={styles.categoryLabelContainer}>
                <Text style={styles.categoryLabel} numberOfLines={3}>
                  {item.SubCategoryName}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );


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
          categoryItem: {
            width: 110,
            height: 110,
            padding: 15,
            borderRadius: 10,
            alignSelf: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            margin: 10,
            alignItems: 'center', // Center content within the item
          },
          categoryIcon: {
            width: 50,
            height: 50,
            padding: 10,
            alignSelf: 'center',
          },
          categoryLabelContainer: {
            width: '100%', // Ensure the container takes full width of the parent
            alignItems: 'center', // Center the text within the container
          },
          categoryLabel: {
             fontSize: 11,
             textAlign: 'center',
             color: 'white',
             fontFamily: regular,
             marginTop: 10,
             flexShrink: 1,
             flexGrow: 1,
             width: '100%',
             textAlignVertical: 'center',
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
                <Text style={styles.headerTitle}>Add Records</Text>
              </View>
              <ScrollView style={styles.container}>

              <DropShadow
                      style={{
                        width: '100%',
                        marginBottom: 5,
                        marginTop: 5,
                        shadowColor: colors.shadow_color,
                        shadowOffset: {
                          width: 1,
                          height: 1,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                      }}
                    >
                    {loading == true &&
                    <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                    	<LottieView source={loader} autoPlay loop />
                    </View>
                    }
                      <FlatList
                        data={subCategories}
                        renderItem={renderSubCategoryItem}
                        keyExtractor={(item) => item.SubCategoryID.toString()} // Ensure unique keys
                        numColumns={3}
                        columnWrapperStyle={styles.listContentContainer}
                        contentContainerStyle={styles.listContentContainer}
                      />
                    </DropShadow>

              </ScrollView>
          </SafeAreaView>
      </>
      )
};

export default AddRecord;