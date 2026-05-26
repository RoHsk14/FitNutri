interface ParsedFood {
  name: string
  quantity_g: number
}

const FOOD_ESTIMATES: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  poulet: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  blanc: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  dinde: { calories: 135, protein: 30, carbs: 0, fat: 1.5 },
  boeuf: { calories: 215, protein: 26, carbs: 0, fat: 12 },
  steak: { calories: 164, protein: 27, carbs: 0, fat: 5.5 },
  viande: { calories: 200, protein: 26, carbs: 0, fat: 10 },
  saumon: { calories: 208, protein: 25, carbs: 0, fat: 13 },
  thon: { calories: 116, protein: 25, carbs: 0, fat: 1 },
  cabillaud: { calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  poisson: { calories: 150, protein: 22, carbs: 0, fat: 6 },
  crevette: { calories: 99, protein: 24, carbs: 0, fat: 0.3 },
  oeuf: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  œuf: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  riz: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  pâte: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  patate: { calories: 87, protein: 2, carbs: 20, fat: 0.1 },
  "patate douce": { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  quinoa: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  pain: { calories: 247, protein: 9, carbs: 47, fat: 3.4 },
  avoine: { calories: 389, protein: 17, carbs: 66, fat: 7 },
  flocon: { calories: 389, protein: 17, carbs: 66, fat: 7 },
  légume: { calories: 35, protein: 2, carbs: 7, fat: 0.4 },
  brocoli: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  épinard: { calories: 23, protein: 2.9, carbs: 3.8, fat: 0.4 },
  salade: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  tomate: { calories: 18, protein: 0.9, carbs: 3, fat: 0.2 },
  concombre: { calories: 15, protein: 0.7, carbs: 2.2, fat: 0.1 },
  carotte: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  courgette: { calories: 17, protein: 1.2, carbs: 3, fat: 0.2 },
  haricot: { calories: 35, protein: 1.8, carbs: 7, fat: 0.1 },
  avocat: { calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  banane: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  pomme: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  "riz complet": { calories: 123, protein: 2.9, carbs: 25, fat: 1 },
  yaourt: { calories: 97, protein: 9, carbs: 4, fat: 5 },
  fromage: { calories: 97, protein: 9, carbs: 4, fat: 5 },
  skyr: { calories: 64, protein: 11, carbs: 4, fat: 0.2 },
  whey: { calories: 400, protein: 80, carbs: 10, fat: 5 },
  protéine: { calories: 400, protein: 80, carbs: 10, fat: 5 },
  amande: { calories: 579, protein: 21, carbs: 22, fat: 50 },
  noix: { calories: 654, protein: 15, carbs: 14, fat: 65 },
  cacahuète: { calories: 588, protein: 25, carbs: 20, fat: 50 },
  huile: { calories: 884, protein: 0, carbs: 0, fat: 100 },
  lait: { calories: 66, protein: 3.2, carbs: 4.8, fat: 3.6 },
  tofu: { calories: 144, protein: 17, carbs: 3, fat: 9 },
  lentille: { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  "pois chiche": { calories: 139, protein: 7.6, carbs: 23, fat: 2.6 },
  maïs: { calories: 96, protein: 3.4, carbs: 19, fat: 1.5 },
  petit: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4 },
  miel: { calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  beurre: { calories: 740, protein: 0.5, carbs: 0.1, fat: 82 },
  tortilla: { calories: 290, protein: 9, carbs: 48, fat: 6 },
  wrap: { calories: 290, protein: 9, carbs: 48, fat: 6 },
}

export function estimateMealLocally(description: string): { food_name: string; quantity_g: number; calories: number; protein_g: number; carbs_g: number; fat_g: number } | null {
  const parts = description.split(/[,;]+/).map(p => p.trim()).filter(Boolean)
  if (parts.length === 0) return null

  const foods: ParsedFood[] = []

  for (const part of parts) {
    // Essayer d'extraire une quantité (nombre + "g" optionnel)
    const qtyMatch = part.match(/(\d+)\s*g/i)
    const quantity_g = qtyMatch ? parseInt(qtyMatch[1]) : 100 // défaut 100g

    // Enlever la quantité pour trouver le nom de l'aliment
    const namePart = part.replace(/(\d+\s*g\s*)/i, "").trim().toLowerCase()

    // Chercher l'aliment dans notre map
    let found = false
    for (const [key, vals] of Object.entries(FOOD_ESTIMATES)) {
      if (namePart.includes(key)) {
        const ratio = quantity_g / 100
        foods.push({
          name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
          quantity_g,
        })
        found = true
        break
      }
    }

    // Si on a trouvé aucun aliment connu, on ajoute quand même avec une estimation générique
    if (!found && namePart) {
      foods.push({
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        quantity_g,
      })
    }
  }

  if (foods.length === 0) return null

  // Agréger les macros
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalGrams = 0
  const names: string[] = []

  for (const food of foods) {
    const lower = food.name.toLowerCase()
    let matched = false
    for (const [key, vals] of Object.entries(FOOD_ESTIMATES)) {
      if (lower.includes(key)) {
        const ratio = food.quantity_g / 100
        totalCalories += Math.round(vals.calories * ratio)
        totalProtein += Math.round(vals.protein * ratio * 10) / 10
        totalCarbs += Math.round(vals.carbs * ratio * 10) / 10
        totalFat += Math.round(vals.fat * ratio * 10) / 10
        totalGrams += food.quantity_g
        matched = true
        break
      }
    }
    if (!matched) {
      // Estimation générique : 150 kcal/100g, 10g protéines, 15g glucides, 6g lipides
      const ratio = food.quantity_g / 100
      totalCalories += Math.round(150 * ratio)
      totalProtein += Math.round(10 * ratio * 10) / 10
      totalCarbs += Math.round(15 * ratio * 10) / 10
      totalFat += Math.round(6 * ratio * 10) / 10
      totalGrams += food.quantity_g
    }
    names.push(food.name)
  }

  return {
    food_name: names.join(" + ").substring(0, 60),
    quantity_g: totalGrams,
    calories: totalCalories,
    protein_g: Math.round(totalProtein * 10) / 10,
    carbs_g: Math.round(totalCarbs * 10) / 10,
    fat_g: Math.round(totalFat * 10) / 10,
  }
}
