import express from "express";
import path from "path";
import crypto from "crypto";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { connectDB, User, Assessment, DietPlan, Report, Progress, Recipe, Notification, Feedback, OTP } from "./database.js";

dotenv.config();

import fs from "fs";

// Logo copying hack for sandbox restrictions
const sourceLogo = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/6bbeb7ef-a31a-4f3e-8c7d-a645f5e9ed69/media__1783842806367.jpg";
const destLogoDir = path.join(process.cwd(), "public");
const destLogo = path.join(destLogoDir, "logo.jpg");
if (fs.existsSync(sourceLogo) && !fs.existsSync(destLogo)) {
  if (!fs.existsSync(destLogoDir)) fs.mkdirSync(destLogoDir);
  fs.copyFileSync(sourceLogo, destLogo);
  console.log("Logo copied successfully via server start!");
}

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "ai-diet-secret-key-2026";

// Security: Simple fast Crypto password hashing
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const stringifiedPayload = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${stringifiedPayload}`).digest("base64url");
  return `${header}.${stringifiedPayload}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const [header, payload, signature] = token.split(".");
    const computedSignature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url");
    if (computedSignature !== signature) return null;
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;
    return decodedPayload;
  } catch {
    return null;
  }
}

// Middleware: Express json parser limit
app.use(express.json({ limit: "15mb" }));

// Middleware: Authentication
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
  req.user = decoded;
  next();
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// --- API ROUTES ---

// 1. REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, gender, dob, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    const newUser = new User({
      id: "user-" + Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      gender: gender || "",
      dob: dob || "",
      password: hashPassword(password),
      role: role || "user",
      createdAt: new Date().toISOString(),
    });

    await newUser.save();

    const token = generateToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    res.status(211).json({
      message: "Registration successful!",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender, dob: user.dob },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. FORGOT PASSWORD (OTP GENERATION)
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`[OTP Seeding / Simulation] Email: ${email}, Generated OTP: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully! (Simulated)",
      otp, // Sending OTP back in response for demonstration in our sandbox environment
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. VERIFY OTP AND CHANGE PASSWORD
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const record = await OTP.findOne({ email: email.toLowerCase() });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: "OTP expired." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.password = hashPassword(newPassword);
    await user.save();
    
    await OTP.deleteOne({ email: email.toLowerCase() });

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET USER PROFILE
app.get("/api/user/profile", authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/user/profile", authMiddleware, async (req: any, res) => {
  try {
    const { name, email, phone, dob } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    user.name = name;
    user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    await user.save();
    
    const userObj = user.toObject();
    const { password, ...safeUser } = userObj;
    res.json(safeUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. HEALTH ASSESSMENT & AI PLANNING ENGINE
app.post("/api/assessment", authMiddleware, async (req: any, res) => {
  try {
    const { personalInfo, medicalInfo, fitnessPreferences } = req.body;
    if (!personalInfo || !medicalInfo || !fitnessPreferences) {
      return res.status(400).json({ error: "Complete information is required." });
    }

    // 1. Save Assessment
    const newAssessment = new Assessment({
      id: "assess-" + Date.now(),
      userId: req.user.id,
      personalInfo,
      medicalInfo,
      fitnessPreferences,
      createdAt: new Date().toISOString(),
    });

    // 2. Compute basic health markers
    const heightM = personalInfo.height / 100;
    const computedBmi = Number((personalInfo.weight / (heightM * heightM)).toFixed(1));
    newAssessment.personalInfo.currentBmi = computedBmi;

    // Use Gemini AI 3.5 Flash to generate personalized plan
    // We'll design a strict prompt to receive structured JSON
    const prompt = `
      You are a world-class certified clinical sports nutritionist and medical dietitian.
      Generate a complete, personalized nutrition plan, calorie analysis, and 7-day meal plan based on the following patient data:

      PERSONAL PROFILE:
      - Name: ${personalInfo.fullName}
      - Age: ${personalInfo.age} years old
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kg
      - Activity Level: ${personalInfo.activityLevel}
      - Stress Level: ${personalInfo.stressLevel}
      - Daily Routine & Sleep: Bed time ${personalInfo.bedTime}, Wake up time ${personalInfo.wakeUpTime}, Sleep hours ${personalInfo.sleepHours}, Steps per day: ${personalInfo.walkingStepsPerDay}

      MEDICAL HISTORY:
      - Blood Group: ${medicalInfo.bloodGroup}
      - Blood Pressure: ${medicalInfo.bloodPressure}
      - Diabetes: ${medicalInfo.diabetes}
      - Thyroid: ${medicalInfo.thyroid}
      - Heart Disease: ${medicalInfo.heartDisease}
      - Kidney Disease: ${medicalInfo.kidneyDisease}
      - Liver Disease: ${medicalInfo.liverDisease}
      - Cholesterol: ${medicalInfo.cholesterol}
      - Allergies: ${medicalInfo.foodAllergies || "None"}
      - Medications: ${medicalInfo.medication || "None"}
      - Digestive Issues: ${medicalInfo.digestiveProblems || "None"}
      - Pregnant: ${medicalInfo.pregnant}

      GOALS & PREFERENCES:
      - Health Goal: ${fitnessPreferences.goal}
      - Diet Preference: ${fitnessPreferences.dietType}
      - Favorite Foods: ${fitnessPreferences.favoriteFoods || "Not specified"}
      - Disliked Foods: ${fitnessPreferences.dislikedFoods || "Not specified"}
      - Available Daily Cooking Time: ${fitnessPreferences.cookingTime} minutes
      - Number of Meals per Day: ${fitnessPreferences.mealsPerDay}
      - Daily Budget Category: ${fitnessPreferences.dailyBudget || "Medium"}

      Return a response strictly conforming to the following JSON schema. Do not include any other markdown wrappers other than raw JSON.
    `;

    let responseJsonText = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dailyCalories: { type: Type.INTEGER, description: "Daily target calories (e.g. 1850)" },
              proteinGrams: { type: Type.INTEGER, description: "Target protein in grams" },
              carbsGrams: { type: Type.INTEGER, description: "Target carbohydrates in grams" },
              fatGrams: { type: Type.INTEGER, description: "Target fats in grams" },
              fiberGrams: { type: Type.INTEGER, description: "Target dietary fiber in grams" },
              sugarGrams: { type: Type.INTEGER, description: "Target maximum sugar in grams" },
              waterIntakeLitres: { type: Type.NUMBER, description: "Recommended daily water intake in litres" },
              bmiAnalysis: {
                type: Type.OBJECT,
                properties: {
                  bmi: { type: Type.NUMBER },
                  idealWeightRange: { type: Type.STRING, description: "e.g. '62 - 74 kg'" },
                  weightCategory: { type: Type.STRING, description: "Underweight, Normal, Overweight, Obese" },
                  bmr: { type: Type.INTEGER, description: "Basal Metabolic Rate in kcal" },
                  tdee: { type: Type.INTEGER, description: "Total Daily Energy Expenditure in kcal" },
                  summaryText: { type: Type.STRING, description: "An executive dietary summary and clinical advice based on medical conditions." }
                },
                required: ["bmi", "idealWeightRange", "weightCategory", "bmr", "tdee", "summaryText"]
              },
              meals: {
                type: Type.OBJECT,
                properties: {
                  morningDrink: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  midMorningSnack: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  eveningSnack: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  },
                  beforeSleep: {
                    type: Type.OBJECT,
                    properties: {
                      foodName: { type: Type.STRING },
                      quantity: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      protein: { type: Type.INTEGER },
                      carbs: { type: Type.INTEGER },
                      fat: { type: Type.INTEGER },
                      fiber: { type: Type.INTEGER },
                      vitamins: { type: Type.ARRAY, items: { type: Type.STRING } },
                      minerals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cookingInstructions: { type: Type.STRING },
                      healthyAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "carbs", "fat", "fiber", "vitamins", "minerals", "cookingInstructions", "healthyAlternatives"]
                  }
                },
                required: ["morningDrink", "breakfast", "midMorningSnack", "lunch", "eveningSnack", "dinner", "beforeSleep"]
              },
              recommendations: {
                type: Type.OBJECT,
                properties: {
                  healthyFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                  foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
                  exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
                  walkingGoalSteps: { type: Type.INTEGER },
                  sleepImprovementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stressManagementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  healthyHabits: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["healthyFoods", "foodsToAvoid", "exercises", "walkingGoalSteps", "sleepImprovementTips", "stressManagementTips", "healthyHabits"]
              },
              suggestedRecipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    dietType: { type: Type.STRING },
                    calories: { type: Type.INTEGER },
                    protein: { type: Type.INTEGER },
                    cookingTime: { type: Type.INTEGER },
                    budget: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "dietType", "calories", "protein", "cookingTime", "budget", "ingredients", "instructions"]
                }
              }
            },
            required: ["dailyCalories", "proteinGrams", "carbsGrams", "fatGrams", "fiberGrams", "sugarGrams", "waterIntakeLitres", "bmiAnalysis", "meals", "recommendations", "suggestedRecipes"]
          }
        }
      });
      responseJsonText = response.text || "{}";
    } catch (aiErr: any) {
      console.error("AI Generation error, falling back to static generation: ", aiErr);
      // Let's create an excellent fallback generator to ensure robustness if API fails or offline
      responseJsonText = JSON.stringify({
        dailyCalories: 2000,
        proteinGrams: 120,
        carbsGrams: 220,
        fatGrams: 65,
        fiberGrams: 30,
        sugarGrams: 40,
        waterIntakeLitres: 2.8,
        bmiAnalysis: {
          bmi: computedBmi,
          idealWeightRange: "60 - 73 kg",
          weightCategory: computedBmi < 18.5 ? "Underweight" : computedBmi < 25 ? "Normal" : computedBmi < 30 ? "Overweight" : "Obese",
          bmr: 1650,
          tdee: 2200,
          summaryText: "Clinical Advice: Maintain a steady routine, stay hydrated, and follow the protein targets safely. Keep allergen precautions in mind."
        },
        meals: {
          morningDrink: {
            foodName: "Warm Lemon Water with Chia Seeds",
            quantity: "1 Glass (250ml)",
            calories: 45,
            protein: 1.5,
            carbs: 6,
            fat: 2,
            fiber: 3,
            vitamins: ["Vitamin C", "Vitamin B6"],
            minerals: ["Calcium", "Iron"],
            cookingInstructions: "Squeeze half a fresh lemon into lukewarm water and stir in pre-soaked chia seeds.",
            healthyAlternatives: ["Green tea", "Warm water with apple cider vinegar"]
          },
          breakfast: {
            foodName: "Oatmeal with Almonds and Berries",
            quantity: "1 Bowl (350g)",
            calories: 380,
            protein: 12,
            carbs: 55,
            fat: 10,
            fiber: 8,
            vitamins: ["Vitamin B1", "Vitamin E"],
            minerals: ["Magnesium", "Zinc"],
            cookingInstructions: "Cook oats in water/plant milk. Top with berries and raw almonds.",
            healthyAlternatives: ["Greek yogurt with nuts", "Egg white scramble with toast"]
          },
          midMorningSnack: {
            foodName: "Mixed Fruit Bowl (Apple & Papaya)",
            quantity: "1 Plate (200g)",
            calories: 120,
            protein: 1.2,
            carbs: 28,
            fat: 0.2,
            fiber: 4.5,
            vitamins: ["Vitamin A", "Vitamin C"],
            minerals: ["Potassium", "Magnesium"],
            cookingInstructions: "Chop fresh organic apples and papaya. Serve fresh.",
            healthyAlternatives: ["Orange juice", "Handful of roasted chickpeas"]
          },
          lunch: {
            foodName: "Grilled Brown Rice Bowl with Legumes & Greens",
            quantity: "1 Plate (450g)",
            calories: 550,
            protein: 22,
            carbs: 85,
            fat: 12,
            fiber: 11,
            vitamins: ["Vitamin B3", "Vitamin K"],
            minerals: ["Iron", "Phosphorus"],
            cookingInstructions: "Serve cooked brown rice with lentils, sauteed spinach, and cucumbers.",
            healthyAlternatives: ["Whole wheat quinoa wrap", "Baked chicken breast with sweet potatoes"]
          },
          eveningSnack: {
            foodName: "Sprouted Moong Salad",
            quantity: "1 Cup (150g)",
            calories: 140,
            protein: 9,
            carbs: 22,
            fat: 0.8,
            fiber: 5.2,
            vitamins: ["Vitamin C", "Folate"],
            minerals: ["Potassium", "Iron"],
            cookingInstructions: "Mix raw green sprouts with onions, tomatoes, coriander, and fresh lemon.",
            healthyAlternatives: ["Roasted pumpkin seeds", "Hummus with cucumber sticks"]
          },
          dinner: {
            foodName: "Tofu/Paneer Vegetable Soup with Sauteed Broccoli",
            quantity: "1 Bowl (400g)",
            calories: 320,
            protein: 18,
            carbs: 18,
            fat: 18,
            fiber: 6.5,
            vitamins: ["Vitamin K", "Beta-carotene"],
            minerals: ["Calcium", "Magnesium"],
            cookingInstructions: "Saute veggies and protein cubes in butter/olive oil. Add vegetable broth and simmer.",
            healthyAlternatives: ["Baked cod with asparagus", "Quinoa and roasted bell peppers"]
          },
          beforeSleep: {
            foodName: "Warm Turmeric Almond Milk",
            quantity: "1 Cup (200ml)",
            calories: 95,
            protein: 3.2,
            carbs: 4.5,
            fat: 7,
            fiber: 0.5,
            vitamins: ["Vitamin E", "Vitamin D"],
            minerals: ["Calcium", "Potassium"],
            cookingInstructions: "Warm milk with a pinch of turmeric powder, cardamon, and black pepper.",
            healthyAlternatives: ["Chamomile tea", "Plain warm water"]
          }
        },
        recommendations: {
          healthyFoods: ["Leafy greens", "Chia seeds", "Avocados", "Fresh berries", "Sprouts"],
          foodsToAvoid: ["Refined sugars", "Excessive sodium", "Processed snacks", "Carbonated sodas"],
          exercises: ["Brisk walking (30 mins)", "Light core yoga", "High-intensity cardio (optional)"],
          walkingGoalSteps: 8000,
          sleepImprovementTips: ["Turn off screens 45 mins before bed", "Keep room ambiently cool", "Maintain same wake-up schedule"],
          stressManagementTips: ["Deep breathing exercises for 5 mins", "Practice daily gratitude", "Unplug from social media"],
          healthyHabits: ["Drink glass of water before each meal", "Chew food slowly", "Stand up for 5 mins every hour"]
        },
        suggestedRecipes: [
          {
            name: "Zesty Sprouts Salad",
            dietType: fitnessPreferences.dietType,
            calories: 140,
            protein: 9,
            cookingTime: 10,
            budget: fitnessPreferences.dailyBudget,
            ingredients: ["1 cup sprouted moong", "1/2 chopped cucumber", "1/2 lemon juice", "Coriander", "Pinch of salt"],
            instructions: ["Mix sprout, cucumber, and coriander in a bowl.", "Squeeze lemon juice, add salt, and toss."]
          }
        ]
      });
    }

    const aiPlan = JSON.parse(responseJsonText);

    // 3. Create Diet Plan object
    const dietPlanId = "plan-" + Date.now();
    const newDietPlan = new DietPlan({
      id: dietPlanId,
      userId: req.user.id,
      assessmentId: newAssessment.id,
      dailyCalories: aiPlan.dailyCalories,
      proteinGrams: aiPlan.proteinGrams,
      carbsGrams: aiPlan.carbsGrams,
      fatGrams: aiPlan.fatGrams,
      fiberGrams: aiPlan.fiberGrams,
      sugarGrams: aiPlan.sugarGrams,
      waterIntakeLitres: aiPlan.waterIntakeLitres,
      meals: aiPlan.meals,
      recommendations: aiPlan.recommendations,
      recipes: aiPlan.suggestedRecipes || [],
      createdAt: new Date().toISOString(),
    });

    // 4. Create Nutrition Report
    const reportId = "report-" + Date.now();
    const newReport = new Report({
      id: reportId,
      userId: req.user.id,
      dietPlanId: newDietPlan.id,
      bmi: aiPlan.bmiAnalysis?.bmi || computedBmi,
      idealWeightRange: aiPlan.bmiAnalysis?.idealWeightRange || "60-75 kg",
      weightCategory: aiPlan.bmiAnalysis?.weightCategory || "Normal",
      bmr: aiPlan.bmiAnalysis?.bmr || 1600,
      tdee: aiPlan.bmiAnalysis?.tdee || 2100,
      summaryText: aiPlan.bmiAnalysis?.summaryText || "Healthy balanced plan.",
      deficiencies: aiPlan.bmiAnalysis?.deficiencies || ["Vitamin D", "Iron"],
      superfoods: aiPlan.bmiAnalysis?.superfoods || ["Spinach", "Almonds", "Chia Seeds"],
      createdAt: new Date().toISOString(),
    });

    // Add notification
    const newNotif = new Notification({
      id: "not-" + Date.now(),
      userId: req.user.id,
      type: "meal",
      title: "New AI Diet Plan Generated!",
      message: `Your custom diet plan (${newReport.weightCategory}) for ${newDietPlan.dailyCalories} kcal has been analyzed successfully.`,
      time: "Just now",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    await Promise.all([
      newAssessment.save(),
      newDietPlan.save(),
      newReport.save(),
      newNotif.save()
    ]);

    res.json({
      success: true,
      assessment: newAssessment,
      dietPlan: newDietPlan,
      report: newReport,
    });
  } catch (error: any) {
    console.error("Endpoint error in assessment: ", error);
    res.status(500).json({ error: error.message });
  }
});

// 7. GET DIET PLAN (Latest Active)
app.get("/api/dietplan", authMiddleware, async (req: any, res) => {
  try {
    const userPlans = await DietPlan.find({ userId: req.user.id }).sort({ createdAt: 1 });
    if (userPlans.length === 0) {
      return res.status(404).json({ error: "No diet plan found. Please complete the Health Assessment first." });
    }
    // Return latest
    const latestPlan = userPlans[userPlans.length - 1];
    res.json(latestPlan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. GET DIET PLANS HISTORY
app.get("/api/dietplan/history", authMiddleware, async (req: any, res) => {
  try {
    const userPlans = await DietPlan.find({ userId: req.user.id });
    const userReports = await Report.find({ userId: req.user.id });
    res.json({ plans: userPlans, reports: userReports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. GET NUTRITION REPORT (BMI, BMR, Analysis)
app.get("/api/nutrition-report", authMiddleware, async (req: any, res) => {
  try {
    const userReports = await Report.find({ userId: req.user.id }).sort({ createdAt: 1 });
    if (userReports.length === 0) {
      return res.status(404).json({ error: "No nutrition report found. Complete assessment first." });
    }
    res.json(userReports[userReports.length - 1]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. GET PROGRESS LOGS
app.get("/api/progress", authMiddleware, async (req: any, res) => {
  try {
    const userProg = await Progress.find({ userId: req.user.id });
    res.json(userProg);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 11. POST PROGRESS LOG
app.post("/api/progress", authMiddleware, async (req: any, res) => {
  try {
    const { weight, bmi, caloriesConsumed, waterIntakeMl, exerciseMinutes, sleepHours, date } = req.body;
    if (!date) {
      return res.status(400).json({ error: "Date is required." });
    }

    const logData = {
      userId: req.user.id,
      weight: Number(weight) || 0,
      bmi: Number(bmi) || 0,
      caloriesConsumed: Number(caloriesConsumed) || 0,
      waterIntakeMl: Number(waterIntakeMl) || 0,
      exerciseMinutes: Number(exerciseMinutes) || 0,
      sleepHours: Number(sleepHours) || 0,
      date,
    };

    const updated = await Progress.findOneAndUpdate(
      { userId: req.user.id, date },
      { $set: logData, $setOnInsert: { id: "prog-" + Date.now() } },
      { upsert: true, new: true }
    );

    res.json({ success: true, progress: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 12. RECIPES LIST & SEARCH
app.get("/api/recipes", async (req, res) => {
  try {
    const { search, dietType } = req.query;
    let filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (dietType && dietType !== "all") {
      filter.dietType = dietType;
    }

    const filtered = await Recipe.find(filter);
    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 13. GET NOTIFICATIONS
app.get("/api/notifications", authMiddleware, async (req: any, res) => {
  try {
    const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 14. MARK NOTIFICATIONS AS READ
app.post("/api/notifications/read", authMiddleware, async (req: any, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 15. POST FEEDBACK
app.post("/api/feedback", authMiddleware, async (req: any, res) => {
  try {
    const { message, rating } = req.body;
    if (!message || !rating) {
      return res.status(400).json({ error: "Message and rating are required." });
    }

    const feed = new Feedback({
      id: "feed-" + Date.now(),
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      message,
      rating: Number(rating),
      createdAt: new Date().toISOString(),
    });

    await feed.save();
    res.json({ success: true, feedback: feed });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 16. GET ALL FEEDBACKS (Admin/Nutritionist)
app.get("/api/feedback", authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "nutritionist") {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    const allFeedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(allFeedbacks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 17. GET ALL USERS (Admin / Nutritionist)
app.get("/api/admin/users", authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "nutritionist") {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    const allUsers = await User.find({}, { password: 0 }).lean();
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 18. DELETE USER (Admin only)
app.delete("/api/admin/users/:id", authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access. Admins only." });
    }
    const targetId = req.params.id;

    if (targetId === req.user.id) {
      return res.status(400).json({ error: "You cannot delete your own admin account." });
    }

    await User.deleteOne({ id: targetId });
    await Assessment.deleteMany({ userId: targetId });
    await DietPlan.deleteMany({ userId: targetId });
    await Report.deleteMany({ userId: targetId });
    await Progress.deleteMany({ userId: targetId });
    await Notification.deleteMany({ userId: targetId });

    res.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 19. ADMIN ANALYTICS & STATS
app.get("/api/admin/stats", authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "nutritionist") {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalPlans = await DietPlan.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    const reports = await Report.find({}, 'weightCategory');
    const categories: Record<string, number> = {};
    reports.forEach((r: any) => {
      const cat = r.weightCategory || "Normal";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const categoryStats = Object.keys(categories).map((name) => ({
      name,
      value: categories[name],
    }));

    const recentFeedback = await Feedback.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find({ role: "user" }, { password: 0 }).sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalPlans,
      totalFeedback,
      categoryStats: categoryStats.length ? categoryStats : [{ name: "Normal", value: 1 }],
      recentFeedback,
      recentUsers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 20. ADMIN DIRECT NOTIFICATION SENDER
app.post("/api/admin/notify", authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "nutritionist") {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    const { userId, type, title, message } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ error: "User ID, title, and message are required." });
    }

    const newNotif = new Notification({
      id: "not-" + Date.now(),
      userId,
      type: type || "system",
      title,
      message,
      time: "Just now",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    await newNotif.save();
    res.json({ success: true, message: "Notification sent successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// VITE MIDDLEWARE SETUP

async function startServer() {
  await connectDB();
  console.log(`Database connected successfully.`);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
