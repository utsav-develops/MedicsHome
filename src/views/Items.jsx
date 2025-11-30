import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Alert, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image, LayoutAnimation, UIManager, Platform, TextInput, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { loader, api_url, img_url, regular, normal, bold, f_xl, Auth_Token } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import moment from 'moment';
import DropdownAlert from "react-native-dropdownalert";

const Items = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
	const [subCategories, setSubCategories] = useState([]);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [optionsMap, setOptionsMap] = useState({});
	const { subCategoryIcon, subCategoryId, subCategoryName, categoryId, categoryName } = route.params;
	const { colors } = useCustomTheme();
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
	const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItemsWithOptions, setSelectedItemsWithOptions] = useState(null);
	const [isSaveClicked, setIsSaveClicked] = useState(false);
	const insets = useSafeAreaInsets();
	let dropDownAlertRef = useRef();

	const drop_down_alert = () => {
        return (
          <DropdownAlert
            ref={(ref) => {
              if (ref) {
                dropDownAlertRef = ref;
              }
            }}
          />
        );
      };


	 useEffect(() => {
            if (isSaveClicked && selectedItemsWithOptions) {
                const selectedId = {
                    categoryId: categoryId,
                    subCategoryId: subCategoryId,
                    selectedItems: {}
                };

                for (const itemId in selectedOptionsMap) {
                    const selectedOptionId = selectedOptionsMap[itemId];

                    if (!selectedId.selectedItems[itemId]) {
                        selectedId.selectedItems[itemId] = {
                            itemId: itemId,
                            selectedOptionId: selectedOptionId
                        };
                    }
                }

                console.log('Selected ID:', selectedId);

                // Navigate to Summary screen with required params
//                 navigation.navigate('Summary', {
//
//                     categoryId: categoryId,
//                     categoryName: categoryName,
//                     categoryColor: categoryColor,
//                     subCategoryIcon: subCategoryIcon,
//                     subCategoryId: subCategoryId,
//                     subCategoryName: subCategoryName,
//                     selectedItemsWithOptions: selectedItemsWithOptions,
//                     selectedId: selectedId
//                 });
            }
        }, [isSaveClicked, selectedItemsWithOptions]);


	const fetchItems = async () => {
	setLoading(true);
		try {
			const response = await axios.post(api_url + "subcategories/" + subCategoryId + "/items/"+Auth_Token);
			setItems(response.data.result);
			console.log(response.data.result);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	};

        useEffect(() => {
          if (subCategoryId) {
            fetchItems();
          }
        }, [subCategoryId]);

	const fetchOptions = async (itemId) => {
	setLoading(true);
		try {
			const response = await axios.post(api_url + "items/" + itemId + "/options/"+ Auth_Token);
			setOptionsMap(prevState => ({
				...prevState,
				[itemId]: response.data.result
			}));
			setLoading(false);
		} catch (error) {
			console.error("Error fetching options:", error);
		}
	};

	const toggleFirstDropdown = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setIsOpen(!isOpen);
	};

	const toggleSecondDropdown = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setIsSecondDropdownOpen(!isSecondDropdownOpen);
	};

	const handleItemPress = (item) => {
		setSelectedItem(item);
		if (!optionsMap[item.ItemID]) {
			fetchOptions(item.ItemID);
		}
		if (!isSecondDropdownOpen) {
			toggleSecondDropdown();
		}
	};

	const handleOptionPress = (option, item) => {
		setSelectedOptionsMap(prevState => ({
			...prevState,
			[item.ItemID]: option.OptionID
		}));
	};

	const getDropdownHeight = (itemCount) => {
		const itemHeight = 75;
		return itemCount * itemHeight;
	};

	const renderItems = ({ item }) => (
		<TouchableOpacity
			style={[
				styles.item,
				item.ItemID === selectedItem?.ItemID && styles.selectedItemBox,
			]}
			onPress={() => handleItemPress(item)}
		>
			<Text
				style={[
					styles.itemText,
					item.ItemID === selectedItem?.ItemID && styles.selectedItemText,
				]}
			>
				{item.ItemName}
			</Text>
		</TouchableOpacity>
	);

	const renderOptions = ({ item }) => (
		<TouchableOpacity
			style={[
				styles.optionBox,
				{ backgroundColor: item.OptionID === selectedOptionsMap[selectedItem?.ItemID] ? colors.medics_blue : 'rgba(57, 181, 232, 0.3)' },
			]}
			onPress={() => handleOptionPress(item, selectedItem)}
		>
			<Text
				style={[
					styles.itemText,
					item.OptionID === selectedOptionsMap[selectedItem?.ItemID] && styles.selectedOptionText,
				]}
			>
				{item.OptionText}
			</Text>
		</TouchableOpacity>
	);

	const hexToRgba = (hex, alpha) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	const savePatientLog = async (selectedId) => {
        setLoading(true);
        try {
            const response = await axios.post(api_url + 'staff/patient_record_log', {
                staff_id: global.id,
                patient_id: global.patient_id ? global.patient_id : global.pat_id,
                category_id: selectedId.categoryId,
                subcategory_id: selectedId.subCategoryId,
                items: selectedId.selectedItems, // Use the selectedItems from selectedId
                witness_name: null,
                witness_phone: null,
                images: null,
                saved_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                comment: null,
                is_flagged: 0,
                goals : null,
                token: Auth_Token,
            });

            setLoading(false);
            console.log(response.data);
            if (response.data.status == 1) {
                dropDownAlertRef.alertWithType(
                    "success",
                    "Saved",
                    "Your records saved successfully."
                );
                setTimeout(() => {
                   navigation.goBack();
                }, 1000);
            } else {
                alert('Failed to save patient log');
            }
        } catch (error) {
            setLoading(false);
            console.error('ss  ' + error);
            alert('Sorry, something went wrong');
        }
    };


	const handleButtonPress = () => {
        console.log('Main Category ID:', categoryId);
        console.log('Sub Category ID:', subCategoryId);
        console.log('Sub Category Name:', subCategoryName);

        const updatedSelectedItemsWithOptions = {};

        if (!updatedSelectedItemsWithOptions.categories) {
            updatedSelectedItemsWithOptions.categories = {};
        }

        if (!updatedSelectedItemsWithOptions.categories[categoryId]) {
            updatedSelectedItemsWithOptions.categories[categoryId] = {
                categoryName: categoryName,
                subcategories: {},
            };
        }

        if (!updatedSelectedItemsWithOptions.categories[categoryId].subcategories[subCategoryId]) {
            updatedSelectedItemsWithOptions.categories[categoryId].subcategories[subCategoryId] = {
                subCategoryName: subCategoryName,
                selectedItems: {},
            };
        }

        const selectedId = {
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            selectedItems: {},
        };

        for (const itemId in selectedOptionsMap) {
            const selectedItem = items.find(item => item.ItemID === parseInt(itemId));
            const selectedOptionId = selectedOptionsMap[itemId];
            const itemOptions = optionsMap[itemId] || [];
            const selectedOption = itemOptions.find(option => option.OptionID === selectedOptionId);

            if (!updatedSelectedItemsWithOptions.categories[categoryId].subcategories[subCategoryId].selectedItems[itemId]) {
                updatedSelectedItemsWithOptions.categories[categoryId].subcategories[subCategoryId].selectedItems[itemId] = {
                    itemName: selectedItem?.ItemName,
                    options: {},
                };
            }

            updatedSelectedItemsWithOptions.categories[categoryId].subcategories[subCategoryId].selectedItems[itemId].options[selectedOptionId] = {
                selectedOptionName: selectedOption?.OptionText,
            };

            // Add to selectedId
            selectedId.selectedItems[itemId] = {
                itemId: selectedItem?.ItemID,
                selectedOptionId: selectedOptionId
            };

            console.log('Selected Item ID:', selectedItem?.ItemID);
            console.log('Selected Item:', selectedItem?.ItemName);
            console.log('Selected Option ID:', selectedOptionId);
            console.log('Selected Option:', selectedOption?.OptionText);
        }

        setSelectedItemsWithOptions(updatedSelectedItemsWithOptions);
        setIsSaveClicked(true);
        console.log(JSON.stringify(updatedSelectedItemsWithOptions, null, 2));

        // Pass selectedId to savePatientLog
        savePatientLog(selectedId);
    };



	const styles = StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: colors.theme,
		},
		header: {
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: colors.theme_bg,
              marginBottom:10,
            },
            headerTitle: {
              fontSize: f_xl,
              fontFamily: bold,
              color: 'white',
              marginLeft: 15,
            },
		headerIcon: {
			fontSize: 30,
		},
		head: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: 13,
			borderRadius: 10,
			color: colors.theme_fg_two,
			backgroundColor: colors.dark,
		},
		headerText: {
			fontSize: 16,
			fontFamily: normal,
			color: colors.theme_fg_two,
		},
		categoryIcon: {
			width: 30,
			height: 30,
		},
		dropdown: {
			backgroundColor: colors.dark,
			borderRadius: 10,
			marginTop: 5,
		},
		dropdownSecond: {
			backgroundColor: colors.dark,
			borderRadius: 10,
			marginTop: 5,
		},
		item: {
			padding: 10,
			borderRadius: 10,
			marginTop:8
		},
		itemText: {
			fontSize: 16,
			color: colors.theme_fg_two,
			fontFamily: normal
		},
		optionBox: {
			borderRadius: 10,
			justifyContent: 'center',
			padding: 10,
			marginTop: 15,
		},
		selectedItemBox: {
			backgroundColor: colors.medics_blue,
		},
		selectedItemText: {
			color: colors.lite_grey,
		},
		selectedOptionBox: {
			backgroundColor: colors.medics_blue,
		},
		selectedOptionText: {
			color: colors.lite_grey,
		},
		textinput: {
			width: '95%',
			height: 90,
			alignSelf: 'center',
			padding: 10,
			backgroundColor: colors.text_container_bg,
			borderWidth: 1,
			borderColor: colors.text_grey,
			borderRadius: 10,
			textAlignVertical: 'top',
			color: colors.theme_fg_two,
		},
		buttonContainer: {
			height: 40,
			width: '95%',
			justifyContent: 'center',
			alignSelf: 'center',
			margin: 10,
			borderRadius: 10,
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
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name="arrow-back" color="white" style={styles.headerIcon} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Items</Text>
{/* 				<TouchableOpacity onPress={() => navigation.dismiss()}> */}
{/* 					<Icon name="close" color="white" style={styles.headerIcon} /> */}
{/* 				</TouchableOpacity> */}
			</View>
			<ScrollView>
				<View style={{ width: '95%', alignSelf: 'center', margin: 10 }}>
					<TouchableOpacity style={styles.head} onPress={toggleFirstDropdown}>
						<Image source={{ uri: `${img_url}${subCategoryIcon}` }} style={styles.categoryIcon} />
						<Text style={styles.headerText}>{subCategoryName}</Text>
						<Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
					</TouchableOpacity>

					{!isOpen && (
						<View style={styles.dropdown}>
							<View style={{ padding: 10 }}>
								<ScrollView>
								{loading == true ?
                                     <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                                     	<LottieView source={loader} autoPlay loop />
                                     </View>:
									<FlatList
										data={items}
										renderItem={renderItems}
										keyExtractor={(item) => item.ItemID.toString()}
									/>
									}
								</ScrollView>
							</View>
						</View>
					)}
				</View>

				{selectedItem && (
					<View style={{ width: '95%', alignSelf: 'center' }}>
						<TouchableOpacity style={styles.head} onPress={toggleSecondDropdown}>
							<Text style={styles.headerText}>{selectedItem?.ItemName}</Text>
							<Icon name={isSecondDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
						</TouchableOpacity>

						{isSecondDropdownOpen && (
							<View style={styles.dropdownSecond}>
								<View style={{ padding: 15 }}>
									<ScrollView>
									{loading == true ?
                                         <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                                         	<LottieView source={loader} autoPlay loop />
                                         </View>:
										<FlatList
											data={optionsMap[selectedItem?.ItemID] || []}
											renderItem={renderOptions}
											keyExtractor={(item) => item.OptionID.toString()}
										/>
										}
									</ScrollView>
								</View>
							</View>
						)}
					</View>
				)}
			</ScrollView>

			<TouchableOpacity
				onPress={handleButtonPress}
				>
				<View style={[styles.buttonContainer, { backgroundColor: colors.medics_blue }]}>
					<Text style={{ fontFamily: bold, fontSize: 16, alignSelf: 'center', color: 'white' }}>Save</Text>
				</View>
			</TouchableOpacity>
			{drop_down_alert()}
		</SafeAreaView>
		</>
	);
};

export default Items;
