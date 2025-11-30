import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar, LayoutAnimation, UIManager, Platform } from 'react-native';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons'; // Ensure this is correctly imported
import { loader, api_url, bold, normal, regular, img_url, btnLoaderWhite, get_specific_emar, update_emar, Auth_Token } from '../config/Constants';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import * as colors from '../assets/css/Colors';
import LottieView from 'lottie-react-native';
import DropdownAlert from "react-native-dropdownalert";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import moment from 'moment';

const EditMedication = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const inputRef = useRef();
    let dropDownAlertRef = useRef();
    const { isDarkMode, colors } = useCustomTheme();
    const [loading, setLoading] = useState(false);
    const [fetchCategory, setFetchCategory] = useState('');
    const [fetchSubCategory, setFetchSubCategory] = useState('');
    const [fetchData, setFetchData] = useState('');
    const [meal, setMeal] = useState('');
    const MedicationID = route.params.MedicationID;
    const [medications, setMedications] = useState([]);
    const [medicineName, setMedicineName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [medicineFormulation, setMedicineFormulation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartDatePicker, setIsStartDatePicker] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [timeInputs, setTimeInputs] = useState([]);
    const [timeToAdd, setTimeToAdd] = useState(null);
    const [currentDatePicker, setCurrentDatePicker] = useState('');
    const [medicationRoute, setMedicationRoute] = useState('');
    const [dose, setDose] = useState('');
    const [indications, setIndications] = useState('');
    const [contraindications, setContraindications] = useState('');
    const [sideEffect, setSideEffect] = useState('');
    const [interactions, setInteractions] = useState('');
    const [instruction, setInstruction] = useState('');
    const [save, setSave] = useState(false);
    const [saveTime, setSaveTime] = useState("");
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory_id, setSelectedCategory_id] = useState('');
    const [selectedSubcategory_id, setSelectedSubcategory_id] = useState('');
    const [selectedInstructions, setSelectedInstructions] = useState('');

    useEffect(() => {
        fetchSpecificEmar();
    }, []);

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

    const fetchSpecificEmar = async () => {
        try {
            const response = await axios.post(api_url + 'staff/get_specific_emar', {
                MedicationID: MedicationID,
                token: Auth_Token,
            });
            setFetchData(response.data.result);
            console.log(response.data.result);
            setFetchCategory(response.data.category_name);
            setFetchSubCategory(response.data.sub_category_name);
            setSelectedCategory_id(response.data.result.CategoryID);
            setSelectedSubcategory_id(response.data.result.SubCategoryID);
            fetchSubCategories(response.data.result.CategoryID);
            handleFrequency(response.data.result.Frequency);
            setMedicineName(response.data.result.MedicationName);
            setStartDate(response.data.result.StartDate);
            setEndDate(response.data.result.EndDate);
            setIndications(response.data.result.Indications);
            setDose(response.data.result.Dosage);
            selected["MedicationName"] = response.data.result.Formulation;
            setMedicationRoute(response.data.result.Route);
            setContraindications(response.data.result.Contraindications);
            setSideEffect(response.data.result.SideEffects);
            setInteractions(response.data.result.Interactions);

            const validTimes = response.data.result.AdministrationTime
              ? JSON.parse(response.data.result.AdministrationTime)
              : [];

            // Step 2: Convert times from HH:mm to hh:mm a format
            const timeInputs = validTimes.map(time => {
              const formattedTime = moment(time, "HH:mm", true);
              return formattedTime.isValid() ? formattedTime.format("hh:mm a") : null;
            });

            // Step 3: Filter out null values
            const filteredTimes = timeInputs.filter(time => time !== null);

            setTimeInputs(filteredTimes);
        } catch (error) {
            console.error("Error fetching:", error.response);
        }
    };



    const fetchCategories = async () => {
      try {
        const response = await axios.post(api_url + "categories/"+ Auth_Token);
        setCategories(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubCategories = async (CategoryID) => {
      try {
        const response = await axios.post(api_url + "categories/" + CategoryID + "/subcategories/"+ Auth_Token);
        setSubcategories(response.data.result);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    const fetchMedications = async () => {
        try {
            const response = await axios.post(api_url + 'medications/' + Auth_Token);
            setMedications(response.data.result);
            console.log(response.data.result)
            setMeal(response.data.meal);
        } catch (error) {
            console.error("Error fetching medications:", error);
        }
    };

    const onSave =() => {
    const currentTime = new Date().toLocaleTimeString();
                setSaveTime(currentTime);
    setSave(true);
    }

    const handleSave = () => {
console.log(selected);
    if (!medicineName || !selected || !dose || !startDate || !endDate || !route || !contraindications || !selectedCategory_id || !selectedSubcategory_id) {
           dropDownAlertRef.alertWithType('error', 'Error','Please fill the missing fields.');
           return;
    }else{
            onSave();
        call_update_emar();
    }
    }

    const call_update_emar = async() => {
    setLoading(true);
        const timeInputsJSON = timeInputs.map(time => {
          const formattedTime = moment(time, "hh:mm a", true);
          return formattedTime.isValid() ? formattedTime.format("HH:mm") : null;
        });

        const validTimes = timeInputsJSON.filter(time => time !== null);
        const administrationTimeString = validTimes.length === 0 ? null : JSON.stringify(validTimes);

    const formattedEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid()
        ? moment(endDate).format('YYYY-MM-DD')
        : null;
        try{
            const response = await axios.post(api_url + 'staff/update_emar', {
                MedicationID: MedicationID,
                MedicationName:  medicineName,
                Formulation: selected["MedicationName"],
                Dosage:  dose,
                Frequency:  selectedFrequency,
                StartDate:  moment(startDate).format('YYYY-MM-DD'),
                EndDate:  formattedEndDate,
                AdministrationTime:  administrationTimeString,
                Route:  medicationRoute,
                AdministeredBy:  global.id,
                CategoryID: selectedCategory_id,
                SubCategoryID: selectedSubcategory_id,
                Indications:  indications,
                Contraindications:  contraindications,
                SideEffects:  sideEffect,
                Interactions:  interactions,
                meal: selectedInstructions && selectedInstructions['name'] ? selectedInstructions['name'] : "N/A",
                token: Auth_Token,
            })
            setLoading(false);
              if (response.data.status == 1) {
                    dropDownAlertRef.alertWithType(
                            "success",
                            "Saved",
                            "Medication edited successfully."
                          );
                          setTimeout(() => {
                       handleBack();
                                  }, 1000);
                  } else {
                    alert('Failed to edit medication.');
                  }
        }catch(error){
            setLoading(false);
            console.error(error.response.data);
            if(error.response.data.status == 0){
            dropDownAlertRef.alertWithType('info', 'Not Saved', 'No changes Made');
            }else{
             dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
            }
            setSave(false);
        }
    };

    const handlePress = (formulation) => {
        setSelected(formulation);
        setMedicationRoute(formulation.Route);
        setDose(formulation.Dose);
        setIndications(formulation.Indications);
        setIsOpen(false);
    };

    const handleInstructionPress =(meal) => {
        setSelectedInstructions(meal);
        setIsInstructionsOpen(false);
    }

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
        setIsCategoryOpen(false);
        fetchSubCategories(category.CategoryID);
        setSelectedCategory_id(category.CategoryID);
    }

    const handleSubcategoryPress = (subcategory) => {
          setSelectedSubcategory(subcategory);
          setIsSubcategoryOpen(false);
          setSelectedSubcategory_id(subcategory.SubCategoryID);
    }

    const handleFrequency = (level) => {
        setSelectedFrequency(level);
    };

    const renderFormulation = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
            <Text style={styles.formulationText}>{item.MedicationName}</Text>
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item, index }) => (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item)}
      >
        <Text style={styles.formulationText}>{item.CategoryName}</Text>
      </TouchableOpacity>
    );

    const renderSubcategoryItem = ({ item }) => (
          <TouchableOpacity
            style={styles.subcategoryItem}
            onPress={() => handleSubcategoryPress(item)}
          >
            <Text style={styles.formulationText}>{item.SubCategoryName}</Text>
          </TouchableOpacity>
        );

    const renderInstructionItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => handleInstructionPress(item)}
      >
        <Text style={styles.formulationText}>{item.name}</Text>
      </TouchableOpacity>
    );

    const showDatePicker = (isStart, type) => {
        setIsStartDatePicker(isStart);
        setCurrentDatePicker(type);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        if (currentDatePicker === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
        hideDatePicker();
    };

    const handleTimeConfirm = (time) => {
        const formattedTime = moment(time).format('hh:mm a');
        setTimeToAdd(formattedTime);
        setTimePickerVisibility(false);
    };

    const handleAddTime = () => {
        if (timeToAdd) {
            setTimeInputs([...timeInputs, timeToAdd]);
            setTimeToAdd(null);
        }
    };

    const removeTime = (index) => {
        const updatedTimes = timeInputs.filter((_, i) => i !== index);
        setTimeInputs(updatedTimes);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const toggleDropdown = () => {
       fetchMedications();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    const toggleCategoryDropdown = () => {
        fetchCategories();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleSubcategoryDropdown = () => {
         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
         setIsSubcategoryOpen(!isSubcategoryOpen);
    };

    const toggleDropdownInstruction = () => {
         fetchMedications();
         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
         setIsInstructionsOpen(!isInstructionsOpen);
    };

    const filteredMedications = medications.filter(medication =>
        medication.MedicationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.dark_White,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: colors.theme_bg,
        },
        headerTitle: {
            fontSize: 18,
            fontFamily: bold,
            color: 'white',
            marginLeft: 10,
        },
        form: {
            padding: 15,
        },
        boxTitle: {
            fontFamily: bold,
            marginBottom: 10,
            fontSize: 14,
            color: colors.theme_fg_two,
        },
        textinput: {
            fontSize: 16,
            color: 'black',
            fontFamily: normal,
            height: 45,
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 10,
            width: '100%',
            paddingHorizontal: 10,
            justifyContent: 'center',
        },
        dropdown: {
            backgroundColor: colors.lite_bg,
            borderRadius: 10,
            marginTop: 5,
            maxHeight: 200,
            padding: 10,
        },
        searchInput: {
            fontSize: 14,
            color: colors.grey,
            fontFamily: regular,
            height: 35,
            backgroundColor: colors.dark,
            borderRadius: 20,
            alignSelf: 'center',
            width: '95%',
            paddingHorizontal: 10,
            marginBottom: 10,
        },
        buttonContainer: {
            height: 50,
            width: '95%',
            backgroundColor: colors.medics_blue,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 10,
            margin: 10,
            marginBottom: Platform.OS == 'ios' ? insets.bottom: null,
        },
        formulationText: {
            fontSize: 14,
            padding: 10,
            color: 'black',
            fontFamily: regular,
        },
        levelButton: {
            width: 100,
            height: 35,
            borderWidth: 1,
            borderRadius: 40,
            borderColor: colors.medics_blue,
            justifyContent: 'center',
            alignItems: 'center'
        },
        levelButtonText: {
            fontSize: 16,
            fontFamily: normal,
            color: colors.theme_fg_two
        },
        timeInputContainer: {
            marginVertical: 5,
            width: '100%', // Adjust this value to control the width of each time input
            marginHorizontal: '1.5%', // Add horizontal margin to space out the items
        },
        timeInput: {
            fontSize: 16,
            color: colors.grey,
            fontFamily: regular,
            height: 40,
            backgroundColor: colors.dark,
            borderWidth: 1,
            borderRadius: 10,
            width: '100%',
            paddingHorizontal: 10,
            textAlign: 'center',
        },
        timeList: {
            marginTop: 5,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        buttonText: {
            fontFamily: regular,
            fontSize: 18,
            alignSelf: "center",
            color: "white",
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack}>
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Medication</Text>
                </View>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>

                <View style={styles.form}>
                    <Text style={styles.boxTitle}>Category*</Text>
                    <TouchableOpacity style={styles.textinput} onPress={toggleCategoryDropdown}>
                        <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: normal, marginTop: '2%' }}>
                            {selectedCategory ? selectedCategory.CategoryName : fetchCategory}
                        </Text>
                        <Icon name={isCategoryOpen? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
                    </TouchableOpacity>
                    {isCategoryOpen && (
                        <View style={styles.dropdown}>
                         {loading == true ?
                            <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                            	<LottieView source={loader} autoPlay loop />
                            </View>
                            :
                            <FlatList
                                data={categories}
                                renderItem={renderCategoryItem}
                                keyExtractor={(item, index) => `${item.CategoryID}-${index}`}
                            />
                            }
                        </View>
                    )}
                </View>
                <View style={styles.form}>
                <Text style={styles.boxTitle}>Sub Category*</Text>
                   <TouchableOpacity style={styles.textinput} onPress={toggleSubcategoryDropdown}>
                       <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: normal, marginTop: '2%' }}>
                           {selectedSubcategory  ? selectedSubcategory.SubCategoryName : fetchSubCategory}
                       </Text>
                       <Icon name={isCategoryOpen? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
                   </TouchableOpacity>
                   {isSubcategoryOpen && (
                       <View style={styles.subcategoryDropdown}>
                        {loading == true ?
                           <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                           	<LottieView source={loader} autoPlay loop />
                           </View>
                           :
                           <FlatList
                               data={subcategories}
                               renderItem={renderSubcategoryItem}
                               keyExtractor={(item) => item.SubCategoryID.toString()}
                           />
                           }
                       </View>
                   )}
                  </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Medication Name*</Text>
                        <TextInput
                            value={medicineName}
                            placeholder="Medicine Name"
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            onChangeText={setMedicineName}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Formulation*</Text>
                        <TouchableOpacity style={styles.textinput} onPress={toggleDropdown}>
                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: normal, marginTop: '2%' }}>
                                {selected ? selected.MedicationName : 'Select Formulation'}
                            </Text>
                            <Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
                        </TouchableOpacity>
                        {isOpen && (
                            <View style={styles.dropdown}>
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search..."
                                    placeholderTextColor={colors.grey}
                                    style={styles.searchInput}
                                />
                                 {loading == true ?
                                  <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                                  	<LottieView source={loader} autoPlay loop />
                                  </View>
                                  :
                                <FlatList
                                    data={filteredMedications}
                                    renderItem={renderFormulation}
                                    keyExtractor={item => item.MedicationID.toString()}
                                />
                                }
                            </View>
                        )}
                    </View>
                    <View style={[styles.form, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={{ width: '48%' }}>
                            <Text style={styles.boxTitle}>Start Date*</Text>
                            <TouchableOpacity onPress={() => showDatePicker(true, 'start')}>
                            <View pointerEvents='none' >

                                <TextInput
                                    ref={inputRef}
                                    secureTextEntry={false}
                                    placeholder="Start Date"
                                    value={startDate ? moment(startDate).format('YYYY-MM-DD') : ""}
                                    editable={false}
                                    placeholderTextColor={colors.grey}
                                    style={styles.textinput}
                                />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '48%' }}>
                            <Text style={styles.boxTitle}>End Date*</Text>
                            <TouchableOpacity onPress={() => showDatePicker(false, 'end')}>
                            <View pointerEvents='none' >

                                <TextInput
                                    ref={inputRef}
                                    secureTextEntry={false}
                                    placeholder="End Date"
                                    value={endDate ? moment(endDate).format('YYYY-MM-DD') : ""}
                                    editable={false}
                                    placeholderTextColor={colors.grey}
                                    style={styles.textinput}
                                />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Frequency</Text>
                        <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 5 }}>
                            <TouchableOpacity
                                style={[
                                    styles.levelButton,
                                    {
                                        backgroundColor: selectedFrequency === 'Daily' ? colors.medics_blue : 'transparent',
                                    }
                                ]}
                                onPress={() => handleFrequency('Daily')}
                            >
                                <Text style={[
                                    styles.levelButtonText,
                                    {
                                        color: selectedFrequency === 'Daily' ? 'white' : colors.theme_fg_two,
                                    }
                                ]}>Daily</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.levelButton,
                                    {
                                        backgroundColor: selectedFrequency === 'Weekly' ? colors.medics_blue : 'transparent',
                                    }
                                ]}
                                onPress={() => handleFrequency('Weekly')}
                            >
                                <Text style={[
                                    styles.levelButtonText,
                                    {
                                        color: selectedFrequency === 'Weekly' ? 'white' : colors.theme_fg_two,
                                    }
                                ]}>Weekly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.levelButton,
                                    {
                                        backgroundColor: selectedFrequency === 'Monthly' ? colors.medics_blue : 'transparent',
                                    }
                                ]}
                                onPress={() => handleFrequency('Monthly')}
                            >
                                <Text style={[
                                    styles.levelButtonText,
                                    {
                                        color: selectedFrequency === 'Monthly' ? 'white' : colors.theme_fg_two,
                                    }
                                ]}>Monthly</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Meal Instructions</Text>
                        <TouchableOpacity style={styles.textinput} onPress={toggleDropdownInstruction}>
                            <Text style={{ flex: 1, fontSize: 16, color: colors.theme_fg_two, fontFamily: normal, marginTop: '2%' }}>
                                {selectedInstructions ? selectedInstructions.name : fetchData.meal}
                            </Text>
                            <Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.theme_fg_two} />
                        </TouchableOpacity>
                        {isInstructionsOpen && (
                            <View style={styles.dropdown}>
                             {loading == true ?
                                <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                                	<LottieView source={loader} autoPlay loop />
                                </View>
                                :
                                <FlatList
                                    data={meal}
                                    renderItem={renderInstructionItem}
                                    keyExtractor={item => item.id.toString()}
                                />
                                }
                            </View>
                        )}
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Set Time</Text>
                        <View style={styles.timeInputContainer}>
                            <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
                                <Text style={{ padding: 8, borderWidth: 1, borderRadius: 10, fontFamily: normal, fontSize: 16, color: colors.theme_fg_two }}>
                                    {timeToAdd || 'Select Time'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddTime} style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 16, color: colors.medics_blue, alignSelf: 'center' }}>Add Time</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={timeInputs}
                            renderItem={({ item, index }) => (
                                <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center',marginRight: 10, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 10, marginBottom: 5 }}>
                                    <Text style={{ fontSize: 16, color: colors.theme_fg_two }}>
                                        {item}
                                    </Text>
                                    <TouchableOpacity onPress={() => removeTime(index)} style={styles.removeButton}>
                                        <Icon type={Icons.Ionicons} name="close-outline" style={{ fontSize: 24, color: colors.theme_fg_two }} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.timeList}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Indications</Text>
                        <TextInput
                            value={indications}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Dose</Text>
                        <TextInput
                            value={dose}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Route</Text>
                        <TextInput
                            value={medicationRoute}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Contraindications*</Text>
                        <TextInput
                            value={contraindications}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            onChangeText={setContraindications}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>SideEffects</Text>
                        <TextInput
                            value={sideEffect}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            onChangeText={setSideEffect}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.boxTitle}>Interactions</Text>
                        <TextInput
                            value={interactions}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                            onChangeText={setInteractions}
                        />
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    {loading === false ? (
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.button, save && styles.buttonDisabled]}
                            disabled={save}
                        >
                            <Text style={styles.buttonText}>
                                {save ? `${t('savedAt')} ${saveTime}` : t('save')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView source={btnLoaderWhite} autoPlay loop />
                        </View>
                    )}
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible && !isTimePickerVisible}
                    mode={currentDatePicker === 'start' || currentDatePicker === 'end' ? 'date' : 'time'}
                    onConfirm={currentDatePicker === 'start' || currentDatePicker === 'end' ? handleDateConfirm : handleTimeConfirm}
                    onCancel={hideDatePicker}
                />
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode='time'
                    onConfirm={handleTimeConfirm}
                    onCancel={() => setTimePickerVisibility(false)}
                />
            </View>
            {drop_down_alert()}
        </>
    );
};

export default EditMedication;
