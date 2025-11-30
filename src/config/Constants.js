import { Dimensions } from "react-native";

export const app_name = "EasyNurse";
export const base_url = "http://localhost:8000/";
export const api_url = "http://localhost:8000/api/";
export const img_url = "http://localhost:8000/public/uploads/";
export const prefix = "workplace/";
export const failed_url = base_url+"paypal_failed";
export const success_url = base_url+"paypal_success";

export const Auth_Token = "PdPwFQ1SUSGQmwmYfoXJoL5J1GDp2ts7g9RqBvp8JXLAVGgALdtKwWZ0gdG4QhKD"; // random access token, match between backend & frontend


export const esewa_failed_url = base_url + "esewa_failed";
export const esewa_success_url = base_url + "esewa_success";

export const get_home = prefix+"get_home";
export const get_estimation_rate = prefix+"get_estimation_rate";
export const add_favourite = prefix+"add_favourite";
export const get_about = prefix+"get_about";
export const referrals = prefix+"referrals";

export const privacy_policies = prefix+"privacy_policies";
export const faq = prefix+"faq";
export const app_settings = prefix+"app_settings";
export const check_phone = prefix+"check_phone";
export const login = prefix+"login";
export const register = prefix+"register";
export const forgot_password = prefix+"forgot_password";
export const reset_password = prefix+"reset_password";
export const get_profile = prefix+"get_profile";
export const get_zone = prefix+"get_zone";
export const profile_update = prefix+"profile_update";
export const profile_picture_upload = prefix+"profile_picture_upload";
export const profile_picture_update = prefix+"profile_picture_update";
export const accept_policies = "accept_policies";
export const check_policies = prefix +"check_policies";
export const update_phone = prefix+ "update_phone";
export const staff_hiring_request = prefix + "staff_hiring_request";
export const get_hire_bookings = prefix +"get_hire_bookings";
export const hiring_cancel = prefix + "hiring_cancel";
export const get_remind_emar = prefix + "get_remind_emar";
export const pay_payment_methods = prefix + "pay_payment_methods";





export const my_bookings = prefix+"my_bookings";
export const work_details = prefix+"work_details";
export const booking_confirm = prefix+"booking_confirm";
export const get_bill = prefix+"get_bill";
export const get_tips = prefix+"get_tips";
export const add_tip = prefix+"add_tip";
export const get_notification_messages = prefix+"get_notification_messages";
export const add_rating = prefix+"add_rating";
export const work_cancel = prefix+"work_cancel";
export const change_phone = prefix+"change_phone";

export const add_wallet = prefix+"add_wallet";
export const payment_methods = prefix+"payment_methods";
export const wallet = prefix+"get_wallet";
export const complaint_categories = prefix+"get_complaint_category";
export const complaint_sub_categories = prefix+"get_complaint_sub_category";
export const add_complaint = prefix+"add_complaint";
export const promo_codes = prefix+"promo_codes";
export const work_request_cancel = prefix+"work_request_cancel";
export const update_document = prefix+"update_document";
export const get_documents = prefix+"get_documents";
export const image_upload = "image_upload";
export const favourites_status= prefix+"favourites_status";

//Header configuration for animated view
export const maxHeaderHeight = 200;
export const minHeaderHeight = 60;

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

export const GOOGLE_KEY = "YOUR KEY HERE";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA = 0.0152;
export const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

//Image Path
export const logo = require(".././assets/img/logo.png");
export const money_icon = require(".././assets/img/money.png");
export const discount_icon = require(".././assets/img/discount.png");
export const check_icon = require(".././assets/img/check.png");
export const money_receive_icon = require(".././assets/img/money_receive.png");
export const money_send_icon = require(".././assets/img/money_send.png");
export const success_icon = require(".././assets/img/success.png");
export const gift_icon = require(".././assets/img/gift.png");
export const medicineTime = require(".././assets/img/medicine_time.png");
export const unsuccess_icon = require(".././assets/img/unsuccessful.png");
export const target_goal = require(".././assets/img/target_goal.png");


export const cancel = require(".././assets/img/cancel.png");
export const notification_bell = require(".././assets/img/notification-bell.png");
export const add_contact = require(".././assets/img/add_contact.png");
export const chat_bg = require(".././assets/img/chat_bg.png");
export const income_icon = require(".././assets/img/income.png");
export const expense_icon = require(".././assets/img/expense.png");
export const home_icon = require(".././assets/img/home.png");
export const faq_icon = require(".././assets/img/faq.png");
export const call_icon = require(".././assets/img/call.png");
export const policies_icon = require(".././assets/img/policies.png");
export const about_us_icon = require(".././assets/img/about_us.png");
export const logout_icon = require(".././assets/img/logout.png");
export const admin_icon = require(".././assets/img/admin.png");
export const language_icon = require(".././assets/img/language.png");
//export const settings_icon = require(".././assets/img/setting.png");
export const NEA_bill = require(".././assets/img/nea_bill.jpg");
export const Fonepay_QR = require(".././assets/img/Fonepay_QR.png");
export const user_icon = require(".././assets/img/avatar.png");




//json path
export const profile_background = require(".././assets/json/profile_background.json");
export const pin_marker = require(".././assets/json/pin_marker.json");
export const no_favourites = require(".././assets/json/no_favorites.json");

export const btn_loader = require(".././assets/json/btn_loader.json");
export const search_loader = require(".././assets/json/search.json");
export const searching_loader = require(".././assets/json/searching.json");
export const location_enable = require(".././assets/json/location_enable.json"); 
export const loader = require(".././assets/json/loader.json");
export const no_data_loader = require(".././assets/json/no_data_loader.json");
export const app_update = require(".././assets/json/app_update.json");
export const gift = require(".././assets/json/gift.json");
export const gift5 = require(".././assets/json/gift5.json");
export const alarm = require(".././assets/json/alarm.json");



//Font Family
export const regular = "ProductSans-Regular";
export const normal = "Montreal-Regular";
export const bold = "Montreal-Bold";

//Font Sized
export const f_tiny = 10;
export const f_xs = 12;
export const f_s = 14;
export const f_m = 16;
export const f_l = 18;
export const f_xl = 20;
export const f_xxl = 22;
export const f_25 = 25;
export const f_30 = 30;
export const f_35 = 35;

export const month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
