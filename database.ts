import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-diet-planner";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// 1. User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  gender: { type: String, default: "" },
  dob: { type: String, default: "" },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  subscription: { type: String, default: "free" },
  createdAt: { type: String, required: true },
});
export const User = mongoose.model("User", userSchema);

// 2. Assessment Schema
const assessmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  personalInfo: { type: Object, required: true },
  medicalInfo: { type: Object, required: true },
  fitnessPreferences: { type: Object, required: true },
  createdAt: { type: String, required: true },
});
export const Assessment = mongoose.model("Assessment", assessmentSchema);

// 3. Diet Plan Schema
const dietPlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  assessmentId: { type: String, required: true },
  dailyCalories: { type: Number, required: true },
  proteinGrams: { type: Number, required: true },
  carbsGrams: { type: Number, required: true },
  fatGrams: { type: Number, required: true },
  fiberGrams: { type: Number, required: true },
  sugarGrams: { type: Number, required: true },
  waterIntakeLitres: { type: Number, required: true },
  meals: { type: Object, required: true },
  recommendations: { type: Object, required: true },
  recipes: { type: Array, default: [] },
  createdAt: { type: String, required: true },
});
export const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

// 4. Report Schema
const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  dietPlanId: { type: String, required: true },
  bmi: { type: Number, required: true },
  idealWeightRange: { type: String, required: true },
  weightCategory: { type: String, required: true },
  bmr: { type: Number, required: true },
  tdee: { type: Number, required: true },
  summaryText: { type: String, required: true },
  deficiencies: { type: Array, default: [] },
  superfoods: { type: Array, default: [] },
  createdAt: { type: String, required: true },
});
export const Report = mongoose.model("Report", reportSchema);

// 5. Progress Log Schema
const progressSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  weight: { type: Number, default: 0 },
  bmi: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  waterIntakeMl: { type: Number, default: 0 },
  exerciseMinutes: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  date: { type: String, required: true },
});
export const Progress = mongoose.model("Progress", progressSchema);

// 6. Recipe Schema
const recipeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dietType: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  budget: { type: String, required: true },
  ingredients: { type: Array, required: true },
  instructions: { type: Array, required: true },
});
export const Recipe = mongoose.model("Recipe", recipeSchema);

// 7. Notification Schema
const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
});
export const Notification = mongoose.model("Notification", notificationSchema);

// 8. Feedback Schema
const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: String, required: true },
});
export const Feedback = mongoose.model("Feedback", feedbackSchema);

// 9. OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Number, required: true },
});
export const OTP = mongoose.model("OTP", otpSchema);

// 10. System Config Schema
const systemConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});
export const SystemConfig = mongoose.model("SystemConfig", systemConfigSchema);

// 11. Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  details: { type: String, default: "" },
  timestamp: { type: String, required: true },
});
export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

// 12. Message Schema
const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: String, required: true },
});
export const Message = mongoose.model("Message", messageSchema);
