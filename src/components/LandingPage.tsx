import React from "react";
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Apple, 
  Flame, 
  Droplet, 
  ChevronDown, 
  Smile, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  UserCheck2,
  Github,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onStartAssessment: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
  isLoggedIn: boolean;
}

export default function LandingPage({
  onStartAssessment,
  onOpenAuth,
  isLoggedIn,
}: LandingPageProps) {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "95%", label: "Plan Adherence Accuracy" },
    { value: "5,000+", label: "AI Plans Generated" },
    { value: "24/7", label: "Realtime AI Diet Support" },
  ];

  const features = [
    {
      title: "AI Analysis Engine",
      desc: "Our model processes BMR, TDEE, stress, routine, and medical histories to build accurate macronutrient guides.",
      icon: Sparkles,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Interactive Calorie Calculator",
      desc: "Dynamic sliders to track your BMI, weight targets, and optimal daily hydration metrics with real-time updates.",
      icon: Flame,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "Smart Hydration Logger",
      desc: "An intuitive water tracker with custom reminder intervals to help maintain peak clinical metabolic functions.",
      icon: Droplet,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Curated Diet Customizations",
      desc: "From High Protein, Mediterranean, Keto, to Vegan or Jain, customize your dishes exactly to your cultural taste.",
      icon: Apple,
      color: "bg-lime-500/10 text-lime-600",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Complete Your Profile",
      desc: "Input your parameters including weight, height, health markers, food tolerances, and budget limitations.",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "The system computes standard clinical metrics (BMI, BMR, TDEE) integrated with smart allergen screening.",
    },
    {
      num: "03",
      title: "Get Your Custom Plan",
      desc: "Receive structured morning-to-night diet recommendations, grocery lists, lifestyle, and exercise tasks.",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Fitness Athlete",
      quote: "The personalized macro distribution helped me hit my lean-mass gains faster than generic calorie counting.",
      rating: 5,
    },
    {
      name: "Sarah Jenkins",
      role: "Working Mother",
      quote: "Being pre-diabetic, finding a plan that respects both my medical parameters and cooking budget was a game-changer.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "How does the AI determine my calories?",
      a: "The AI calculates your Basal Metabolic Rate (BMR) using scientifically approved standard Mifflin-St Jeor formulas, then multiplies it based on your selected physical activity level to derive your Total Daily Energy Expenditure (TDEE).",
    },
    {
      q: "Can I use it if I have pre-existing medical conditions?",
      a: "Yes! The system takes diabetes, thyroid, heart conditions, and common food allergies into account. However, always consult with a registered medical practitioner before starting any major diet change.",
    },
    {
      q: "Is it suitable for vegan or specialized diets?",
      a: "Absolutely. We support Vegetarian, Vegan, Eggetarian, Jain, Keto, Low-Carb, Mediterranean, and Intermittent Fasting.",
    },
  ];

  return (
    <div id="landing-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      {/* Professional Hero Section */}
      <header className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-green-50/50 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-green-200/50 dark:bg-green-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>Next-Gen AI Clinical Dietetics</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none drop-shadow-sm">
                Your Personal <span className="text-green-600 dark:text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">AI Diet & Nutrition</span> Planner
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get a personalized AI-powered diet plan based on your body, lifestyle, and health goals. Fully integrated with clinical calculations and custom food parameters.
              </p>

              {/* Disclaimer notice */}
              <div className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 rounded-xl max-w-xl mx-auto lg:mx-0 text-left text-xs text-amber-800 dark:text-amber-200/90 shadow-sm hover:shadow-md transition-all duration-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> AI recommendations are informational. Consult a qualified clinical dietitian or doctor if you have special medical conditions.
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onStartAssessment}
                  className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg shadow-green-200 dark:shadow-green-900/50 hover:shadow-xl dark:hover:shadow-green-700/50 hover:-translate-y-1 transition-all text-center cursor-pointer"
                >
                  Start Assessment
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-950/50 dark:backdrop-blur-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-green-700/50 rounded-2xl hover:-translate-y-1 transition-all text-center cursor-pointer"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Image Mockup */}
            <div className="lg:col-span-5 flex justify-center relative group">
              <div className="relative w-full max-w-md p-4 bg-white/70 dark:bg-slate-950/80 backdrop-blur-md border border-slate-100 dark:border-green-900/30 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-green-900/20 group-hover:-translate-y-2 group-hover:border-green-500/50 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600"
                  alt="Healthy organic meal prep"
                  className="rounded-2xl w-full object-cover aspect-[4/3] shadow-inner group-hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Floating widget */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-lg max-w-[200px] border border-slate-800 group-hover:border-green-500/50 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <Apple className="text-green-400 h-5 w-5" />
                    <span className="text-sm font-bold">100% Custom</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Optimized for weight goals, preferences & allergen protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1 hover:-translate-y-1 transition-all duration-300">
                <p className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400 tracking-tight drop-shadow-sm">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
              Clinically Informed <span className="text-green-600 dark:text-green-400">AI Nutrition</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              We compile medical parameters, diet routines, sleeping behaviors, and daily budget constraints to generate the most actionable plates possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white to-green-50/40 dark:from-slate-900/90 dark:to-slate-950/90 dark:backdrop-blur-xl p-6 rounded-3xl border border-green-100/60 dark:border-green-900/40 shadow-sm hover:shadow-xl hover:shadow-green-200/40 dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-2xl w-fit ${feat.color} dark:bg-slate-950/80 dark:border dark:border-slate-800 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
              Simple 3-Step Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Achieving your metabolic target has never been more straightforward or secure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Background line */}
            <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center space-y-4 px-4 group cursor-pointer">
                <div className="mx-auto h-16 w-16 bg-green-500 dark:bg-green-600/20 dark:border dark:border-green-500/30 text-white dark:text-green-400 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-green-100 dark:shadow-green-900/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
              Loved by Thousands Globally
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Real results verified from our clinical compliance surveys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white to-green-50/40 dark:from-slate-900/90 dark:to-slate-950/90 dark:backdrop-blur-xl p-8 rounded-3xl border border-green-100/60 dark:border-green-900/40 shadow-sm hover:shadow-xl hover:shadow-green-200/40 dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between space-y-6 group cursor-pointer">
                <p className="text-slate-600 dark:text-slate-300 italic text-base leading-relaxed">
                  "{test.quote}"
                </p>
                <div className="flex items-center space-x-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{test.name}</h4>
                    <span className="text-xs text-slate-400 font-medium">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Have questions? Find quick clinical and technical answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-900/50 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-bold text-slate-800 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeFaq === idx ? "rotate-185 text-green-600 dark:text-green-400" : "text-slate-400 dark:text-slate-500"}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-green-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950/50 p-8 sm:p-12 text-white flex flex-col justify-between space-y-8 border-r border-transparent dark:border-slate-800">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Get in Touch</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Have inquiries regarding corporate metabolic screening plans or customized clinic partnerships? Contact us directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-sm text-slate-300">gauravraj17062000@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-sm text-slate-300">8400741446</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-sm text-slate-300">Matiyari, Chinhat, Lucknow 226028</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Feedback received!"); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm transition-all focus:outline-none"
                      placeholder="Alex Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm transition-all focus:outline-none"
                      placeholder="alex@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm transition-all focus:outline-none"
                    placeholder="Describe how we can support you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md dark:shadow-green-900/50 hover:shadow-lg dark:hover:shadow-green-700/50 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <img src="/logo.jpg" alt="AI Dietitian Logo" className="h-8 w-auto rounded-full shadow-sm group-hover:scale-110 group-hover:ring-2 group-hover:ring-green-500 transition-all duration-300" />
              <span className="text-lg font-black text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                AI Dietitian
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, link: "#" },
                { icon: Instagram, link: "#" },
                { icon: Linkedin, link: "#" },
                { icon: Github, link: "#" }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.link}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-500/50 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-900/30 transition-all duration-300 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Bottom Copyright */}
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm text-slate-500 dark:text-slate-500">
            <p>© 2026 AI Diet & Nutrition Planner. Crafted with ❤️.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
