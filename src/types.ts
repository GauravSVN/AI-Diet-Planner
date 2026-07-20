/**
 * Shared Type Definitions for AI Diet & Nutrition Planner
 */

export type UserRole = 'user' | 'nutritionist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  role: UserRole;
  createdAt: string;
}

export interface PersonalInfo {
  fullName: string;
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  currentBmi: number;
  bodyFat?: number;
  country: string;
  state: string;
  city: string;
  occupation: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  lifestyle: string;
  dailyRoutine: string;
  sleepHours: number;
  wakeUpTime: string;
  bedTime: string;
  exerciseTime: string;
  walkingStepsPerDay: number;
  workingHours: number;
  stressLevel: 'low' | 'medium' | 'high';
}

export interface MedicalInfo {
  bloodGroup: string;
  bloodPressure: 'normal' | 'low' | 'high';
  diabetes: boolean;
  thyroid: boolean;
  heartDisease: boolean;
  kidneyDisease: boolean;
  liverDisease: boolean;
  cholesterol: boolean;
  foodAllergies: string;
  medication: string;
  digestiveProblems: string;
  pregnant: boolean;
  smoking: boolean;
  alcohol: boolean;
}

export interface FitnessPreferences {
  goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle' | 'fat_loss' | 'healthy_lifestyle' | 'medical_diet';
  dietType: 'vegetarian' | 'vegan' | 'eggetarian' | 'non_vegetarian' | 'jain' | 'keto' | 'low_carb' | 'high_protein' | 'mediterranean' | 'intermittent_fasting';
  favoriteFoods: string;
  dislikedFoods: string;
  dailyBudget: string;
  cookingTime: number; // in minutes
  waterIntakeGoal: number; // calculated standard or input
  mealsPerDay: number;
  snacksAllowed: boolean;
  supplements: string;
}

export interface Assessment {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  medicalInfo: MedicalInfo;
  fitnessPreferences: FitnessPreferences;
  createdAt: string;
}

export interface MealDetail {
  foodName: string;
  quantity: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  vitamins: string[];
  minerals: string[];
  cookingInstructions: string;
  healthyAlternatives: string[];
}

export interface MealsPlan {
  morningDrink: MealDetail;
  breakfast: MealDetail;
  midMorningSnack: MealDetail;
  lunch: MealDetail;
  eveningSnack: MealDetail;
  dinner: MealDetail;
  beforeSleep: MealDetail;
}

export interface Recommendation {
  healthyFoods: string[];
  foodsToAvoid: string[];
  exercises: string[];
  walkingGoalSteps: number;
  sleepImprovementTips: string[];
  stressManagementTips: string[];
  healthyHabits: string[];
}

export interface Recipe {
  id: string;
  name: string;
  dietType: string;
  calories: number;
  protein: number;
  cookingTime: number;
  budget: string;
  ingredients: string[];
  instructions: string[];
}

export interface DietPlan {
  id: string;
  userId: string;
  assessmentId: string;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  waterIntakeLitres: number;
  meals: MealsPlan;
  recommendations: Recommendation;
  recipes: Recipe[];
  createdAt: string;
}

export interface NutritionReport {
  id: string;
  userId: string;
  dietPlanId: string;
  bmi: number;
  idealWeightRange: string;
  weightCategory: string;
  bmr: number;
  tdee: number;
  summaryText: string;
  createdAt: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  weight: number;
  bmi: number;
  caloriesConsumed: number;
  waterIntakeMl: number;
  exerciseMinutes: number;
  sleepHours: number;
  date: string; // YYYY-MM-DD
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'meal' | 'water' | 'exercise' | 'sleep' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}
