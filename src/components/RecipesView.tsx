import React from "react";
import { Search, Sparkles, Clock, Flame, Award, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Recipe } from "../types";

interface RecipesViewProps {
  planRecipes: Recipe[];
}

export default function RecipesView({ planRecipes }: RecipesViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeDiet, setActiveDiet] = React.useState<string>("all");
  const [expandedRecipeId, setExpandedRecipeId] = React.useState<string | null>(null);

  // Combine pre-seeded recipes with AI generated ones
  const baseRecipes: Recipe[] = [
    {
      id: "base-1",
      name: "Quinoa Avocado Salad",
      dietType: "vegetarian",
      calories: 380,
      protein: 12,
      cookingTime: 15,
      budget: "medium",
      ingredients: [
        "1 cup cooked quinoa",
        "1/2 ripe avocado, diced",
        "1/2 cup cherry tomatoes, halved",
        "1/2 cup cucumber, diced",
        "1 tbsp olive oil",
        "1 tbsp lemon juice",
        "Salt & black pepper to taste"
      ],
      instructions: [
        "In a large bowl, combine the cooked quinoa, diced avocado, cherry tomatoes, and cucumber.",
        "Drizzle with olive oil and fresh lemon juice.",
        "Toss gently and season with salt and black pepper.",
        "Serve chilled or at room temperature."
      ]
    },
    {
      id: "base-2",
      name: "High-Protein Tofu Stir Fry",
      dietType: "vegan",
      calories: 320,
      protein: 18,
      cookingTime: 20,
      budget: "low",
      ingredients: [
        "200g firm tofu, pressed and cubed",
        "1 cup broccoli florets",
        "1/2 red bell pepper, sliced",
        "1 tbsp soy sauce (low sodium)",
        "1 tsp sesame oil",
        "1 clove garlic, minced",
        "1 tsp sesame seeds"
      ],
      instructions: [
        "Heat sesame oil in a non-stick pan over medium heat.",
        "Add tofu cubes and stir fry until lightly golden on all sides.",
        "Add minced garlic, broccoli, and red bell peppers, sauteing for 5 minutes.",
        "Drizzle with soy sauce and stir to coat.",
        "Top with sesame seeds and serve warm."
      ]
    },
    {
      id: "base-3",
      name: "Keto Spinach Egg Scramble",
      dietType: "keto",
      calories: 290,
      protein: 19,
      cookingTime: 10,
      budget: "low",
      ingredients: [
        "3 large eggs",
        "1 cup fresh baby spinach",
        "1 tbsp butter",
        "2 tbsp shredded cheddar cheese",
        "Pinch of salt and red pepper flakes"
      ],
      instructions: [
        "Whisk eggs in a bowl with a pinch of salt.",
        "Melt butter in a skillet over medium heat.",
        "Add spinach and cook until wilted.",
        "Pour in whisked eggs and scramble gently until fully cooked.",
        "Sprinkle with cheddar cheese and red pepper flakes before serving."
      ]
    }
  ];

  const allRecipes = [...baseRecipes, ...planRecipes];

  // Filtering
  const filtered = allRecipes.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiet = activeDiet === "all" || r.dietType.toLowerCase() === activeDiet.toLowerCase();
    return matchSearch && matchDiet;
  });

  const toggleExpand = (id: string) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const dietTabs = [
    { code: "all", label: "All Recipes" },
    { code: "vegetarian", label: "Vegetarian" },
    { code: "vegan", label: "Vegan" },
    { code: "keto", label: "Keto" },
    { code: "non_vegetarian", label: "Non-Veg" },
  ];

  return (
    <div id="recipes-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span>AI Recipe Suggestions Explorer</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5 font-medium">Explore dishes matching your calorie limits and diet preferences.</p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search healthy recipes..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Diet selection tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        {dietTabs.map((tab) => (
          <button
            key={tab.code}
            onClick={() => {
              setActiveDiet(tab.code);
              setExpandedRecipeId(null);
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeDiet === tab.code
                ? "bg-green-600 text-white border-green-600 shadow-sm shadow-green-100/10"
                : "bg-white dark:bg-black/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recipes listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;
            return (
              <div
                key={recipe.id}
                className="bg-white dark:bg-slate-950/80 border border-slate-100 dark:border-green-900/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                        {recipe.dietType}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mt-1.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{recipe.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleExpand(recipe.id)}
                      className="p-1.5 hover:bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-green-400 cursor-pointer shrink-0 hover:border-green-500 transition-all"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-slate-50 dark:bg-black/40 border border-transparent dark:border-slate-800/50 rounded-xl text-xs group-hover:border-green-500/30 transition-all">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase">Time</span>
                      <span className="font-extrabold text-slate-700 dark:text-white block mt-0.5">{recipe.cookingTime} min</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-black/40 border border-transparent dark:border-slate-800/50 rounded-xl text-xs group-hover:border-orange-500/30 transition-all">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase">Calories</span>
                      <span className="font-extrabold text-orange-600 dark:text-orange-400 block mt-0.5">{recipe.calories} kcal</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-black/40 border border-transparent dark:border-slate-800/50 rounded-xl text-xs group-hover:border-green-500/30 transition-all">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase">Protein</span>
                      <span className="font-extrabold text-green-700 dark:text-green-400 block mt-0.5">{recipe.protein}g</span>
                    </div>
                  </div>

                  {/* Expandable recipe info */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-slate-100/60 animate-in fade-in duration-200">
                      {/* Ingredients */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ingredients list</span>
                        <ul className="list-disc list-inside text-xs text-slate-600 dark:text-emerald-100/90 space-y-1 pl-1">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Instructions Steps</span>
                        <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-emerald-100/90 space-y-1 pl-1">
                          {recipe.instructions.map((inst, idx) => (
                            <li key={idx} className="leading-relaxed">{inst}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 py-12 text-center text-slate-400 text-sm">
            No recipes matching the search filters. Try clearing the search.
          </div>
        )}
      </div>
    </div>
  );
}
