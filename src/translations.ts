export const translations = {
  en: {
    // Sidebar
    nav_home: "Dashboard Home",
    nav_profile: "My Profile",
    nav_diet: "AI Diet Plan",
    nav_meal: "Meal Planner",
    nav_water: "Water Tracker",
    nav_bmi: "BMI Calculator",
    nav_progress: "Progress Log",
    nav_feedback: "Feedback",
    nav_recipes: "Recipes & Guide",
    nav_settings: "Settings",
    
    // Dashboard Home
    dash_welcome: "Welcome back",
    dash_subtitle: "Here's your nutritional summary for today",
    dash_daily_summary: "Daily Nutrition Summary",
    dash_calories: "Calories",
    dash_protein: "Protein",
    dash_carbs: "Carbs",
    dash_fats: "Fats",
    dash_water: "Water Intake",
    dash_weight: "Current Weight",
    dash_target_weight: "Target Weight",
    dash_quick_actions: "Quick Actions",
    dash_log_meal: "Log a Meal",
    dash_log_water: "Log Water",
    dash_update_weight: "Update Weight",
    dash_view_plan: "View AI Plan",
    dash_today_meals: "Today's Meals",
    dash_recent_progress: "Recent Progress",
  },
  hi: {
    // Sidebar
    nav_home: "डैशबोर्ड होम",
    nav_profile: "मेरी प्रोफ़ाइल",
    nav_diet: "एआई आहार योजना",
    nav_meal: "भोजन योजनाकार",
    nav_water: "जल ट्रैकर",
    nav_bmi: "बीएमआई कैलकुलेटर",
    nav_progress: "प्रगति लॉग",
    nav_feedback: "प्रतिक्रिया (Feedback)",
    nav_recipes: "व्यंजन विधि (Recipes)",
    nav_settings: "सेटिंग्स",

    // Dashboard Home
    dash_welcome: "वापसी पर स्वागत है",
    dash_subtitle: "यहाँ आज के लिए आपका पोषण सारांश है",
    dash_daily_summary: "दैनिक पोषण सारांश",
    dash_calories: "कैलोरी",
    dash_protein: "प्रोटीन",
    dash_carbs: "कार्ब्स",
    dash_fats: "वसा (Fats)",
    dash_water: "जल सेवन",
    dash_weight: "वर्तमान वजन",
    dash_target_weight: "लक्षित वजन",
    dash_quick_actions: "त्वरित कार्रवाई",
    dash_log_meal: "भोजन दर्ज करें",
    dash_log_water: "पानी दर्ज करें",
    dash_update_weight: "वजन अपडेट करें",
    dash_view_plan: "एआई योजना देखें",
    dash_today_meals: "आज का भोजन",
    dash_recent_progress: "हाल की प्रगति",
  }
};

export type Language = "en" | "hi";
export type TranslationKey = keyof typeof translations.en;
