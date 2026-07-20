import React from "react";
import { FileText, Plus, Edit2, Trash2, X, Activity } from "lucide-react";

export default function CmsTab() {
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRecipe, setEditingRecipe] = React.useState<any>(null);
  
  // Form state
  const [name, setName] = React.useState("");
  const [dietType, setDietType] = React.useState("Weight Loss");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [ingredients, setIngredients] = React.useState("");
  
  const fetchRecipes = () => {
    setLoading(true);
    fetch("/api/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchRecipes();
  }, []);

  const openModal = (recipe: any = null) => {
    if (recipe) {
      setEditingRecipe(recipe);
      setName(recipe.name);
      setDietType(recipe.dietType);
      setCalories(recipe.calories.toString());
      setProtein(recipe.proteinGrams.toString());
      setIngredients(recipe.ingredients.join(", "));
    } else {
      setEditingRecipe(null);
      setName("");
      setDietType("Weight Loss");
      setCalories("");
      setProtein("");
      setIngredients("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    const payload = {
      name,
      dietType,
      calories: Number(calories),
      proteinGrams: Number(protein),
      ingredients: ingredients.split(",").map(i => i.trim()).filter(Boolean)
    };

    const url = editingRecipe ? `/api/admin/recipes/${editingRecipe.id}` : "/api/admin/recipes";
    const method = editingRecipe ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    setIsModalOpen(false);
    fetchRecipes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    const token = localStorage.getItem("auth_token");
    await fetch(`/api/admin/recipes/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchRecipes();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Recipes CMS</h3>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Recipe</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950/80 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="p-4">Recipe Name</th>
              <th className="p-4">Diet Type</th>
              <th className="p-4">Nutrition</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading recipes...</td></tr>
            ) : recipes.length > 0 ? (
              recipes.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{r.name}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">{r.dietType}</span></td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                    {r.calories} kcal • {r.proteinGrams}g protein
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openModal(r)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No recipes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{editingRecipe ? "Edit Recipe" : "Add Recipe"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipe Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-green-500 text-slate-800 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diet Type</label>
                  <select value={dietType} onChange={e => setDietType(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-green-500 text-slate-800 dark:text-white">
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Calories</label>
                  <input required type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-green-500 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Protein (g)</label>
                  <input required type="number" value={protein} onChange={e => setProtein(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-green-500 text-slate-800 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingredients (comma separated)</label>
                <textarea required value={ingredients} onChange={e => setIngredients(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-green-500 text-slate-800 dark:text-white resize-none" />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">Save Recipe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
