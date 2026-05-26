const apiKey = process.env.GEMINI_API_KEY

export interface MealAnalysis {
  food_name: string
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface PhysiqueAnalysis {
  bodyFatEstimate: string
  muscleMass: string
  morphType: string
  durationAdjustment: number
  reasoning: string
  suggestions: string[]
}

async function imageToBase64(url: string): Promise<{ data: string; mime: string } | null> {
  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    const blob = await resp.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())
    return { data: buffer.toString("base64"), mime: blob.type || "image/jpeg" }
  } catch {
    return null
  }
}

export async function analyzePhysiqueWithGemini(
  currentImageUrl?: string | null,
  goalImageUrl?: string | null,
  profile?: { gender: string; age: number; weightKg: number; heightCm: number; goal: string },
): Promise<PhysiqueAnalysis | null> {
  if (!apiKey) return null
  if (!currentImageUrl && !goalImageUrl) return null

  const [currentImg, goalImg] = await Promise.all([
    currentImageUrl ? imageToBase64(currentImageUrl) : null,
    goalImageUrl ? imageToBase64(goalImageUrl) : null,
  ])

  const parts: any[] = [
    {
      text: `Tu es un coach sportif expert. Analyse les photos fournies et réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Contexte : ${profile?.gender === "FEMALE" ? "Femme" : "Homme"}, ${profile?.age} ans, ${profile?.weightKg} kg, ${profile?.heightCm} cm, objectif : ${profile?.goal === "LOSE_FAT" ? "perte de poids" : profile?.goal === "GAIN_MUSCLE" ? "prise de muscle" : "remise en forme"}.

Format de réponse attendu (JSON uniquement) :
{
  "bodyFatEstimate": "~XX%",
  "muscleMass": "faible|modéré|élevé",
  "morphType": "endomorphe|mésomorphe|ectomorphe",
  "durationAdjustment": 1.0,
  "reasoning": "explication concise",
  "suggestions": ["conseil 1", "conseil 2", "conseil 3"]
}

Règles :
- bodyFatEstimate : estime le pourcentage de masse grasse visible
- muscleMass : "faible", "modéré" ou "élevé"
- morphType : ectomorphe (mince longiligne), mésomorphe (athlétique charpenté) ou endomorphe (tendance surpoids)
- durationAdjustment : facteur correctif (0.5 = moitié du temps car bon profil, 1.5 = plus long car difficile, base = 1.0)
- reasoning : pourquoi ce facteur
- suggestions : 3 conseils personnalisés pour accélérer les résultats`,
    },
  ]

  if (currentImg) parts.push({ inlineData: currentImg })
  if (goalImg) parts.push({ inlineData: goalImg })

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
        }),
      },
    )

    if (!resp.ok) {
      const err = await resp.text()
      console.error("Gemini API error:", err)
      return null
    }

    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim()
    return JSON.parse(cleaned) as PhysiqueAnalysis
  } catch (e) {
    console.error("Erreur analyse Gemini:", e)
    return null
  }
}

export async function analyzeMealTextWithGemini(description: string): Promise<MealAnalysis | null> {
  if (!apiKey) return null
  if (!description || description.length < 3) return null

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un nutritionniste expert. Analyse ce repas décrit en langage naturel et estime ses valeurs nutritionnelles.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Description du repas: "${description}"

Format attendu:
{
  "food_name": "nom court et descriptif du repas (max 60 caractères)",
  "quantity_g": quantité totale estimée en grammes,
  "calories": kcal total estimé,
  "protein_g": protéines totales en grammes,
  "carbs_g": glucides totaux en grammes,
  "fat_g": lipides totaux en grammes
}

Règles:
- Sois réaliste avec les portions (150-200g viande/poisson, 200-300g féculents, 100-200g légumes)
- Base les valeurs sur les tables nutritionnelles standard
- Si la description est trop vague, estime des portions raisonnables
- Ne retourne QUE le JSON, rien d'autre`,
            }],
          }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
        }),
      },
    )

    if (!resp.ok) {
      const err = await resp.text()
      console.error("Gemini meal API error:", err)
      return null
    }

    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim()
    return JSON.parse(cleaned) as MealAnalysis
  } catch (e) {
    console.error("Erreur analyse repas Gemini:", e)
    return null
  }
}

// ─── COACHING PERSONNALISÉ (Vision + Obstacles) ───────

export interface CoachingMessage {
  greeting: string
  obstacleInsight: string
  todayAdjustment: string
  tone: "encouraging" | "challenging" | "balanced"
}

export async function generateDailyCoachingMessage(profile: {
  gender: string
  goal: string
  age: number
  goalDescription?: string | null
  currentPhysiqueImageUrl?: string | null
  hasWorkoutToday: boolean
  weekProgressPercent: number
}): Promise<CoachingMessage | null> {
  if (!apiKey) return null

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un coach sportif expert. Génère un message de coaching personnalisé en français.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Contexte utilisateur :
- Genre : ${profile.gender === "FEMALE" ? "Femme" : "Homme"}
- Objectif : ${profile.goal === "LOSE_FAT" ? "perte de poids" : profile.goal === "GAIN_MUSCLE" ? "prise de muscle" : "remise en forme"}
- Âge : ${profile.age} ans
- Description objectif : ${profile.goalDescription ?? "Non renseigné"}
- A une séance aujourd'hui : ${profile.hasWorkoutToday ? "Oui" : "Non"}
- Progression hebdomadaire : ${profile.weekProgressPercent}%

Adapte le ton selon le profil :
- Si femme + remise en forme : ton bienveillant, axé santé, énergie au quotidien
- Si femme + perte de poids : ton encourageant, axé confiance en soi
- Si homme + prise de muscle : ton challengeant, performance, dépassement
- Si homme + perte de poids : ton direct mais soutenant

Si une description d'objectif est fournie, extrais les obstacles (ex: "assis toute la journée", "mal au dos") et propose un ajustement concret pour aujourd'hui.

Format attendu:
{
  "greeting": "message d'accueil personnalisé avec prénom (max 100 caractères)",
  "obstacleInsight": "analyse de l'obstacle détecté et conseil (max 150 caractères) — vide si aucune info",
  "todayAdjustment": "ajustement concret pour la séance du jour (max 100 caractères)",
  "tone": "encouraging" | "challenging" | "balanced"
}`,
            }],
          }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
        }),
      },
    )

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()) as CoachingMessage
  } catch {
    return null
  }
}

// ─── RECETTES IA ──────────────────────────────────────

export interface GeneratedRecipe {
  name: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface MealSuggestion {
  mealType: "petit-déjeuner" | "déjeuner" | "dîner" | "collation"
  recipe: GeneratedRecipe
}

export async function generateRecipeWithGemini(params: {
  targetCalories: number
  targetProteinG: number
  targetCarbsG: number
  targetFatG: number
  mealType: string
  restrictions?: string[]
  preferences?: string
  availableIngredients?: string
}): Promise<GeneratedRecipe | null> {
  if (!apiKey) return null

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un chef nutritionniste. Génère une recette adaptée aux objectifs macros de l'utilisateur.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Contraintes :
- Type de repas : ${params.mealType}
- Calories cibles : ~${params.targetCalories} kcal
- Protéines cibles : ~${params.targetProteinG}g
- Glucides cibles : ~${params.targetCarbsG}g
- Lipides cibles : ~${params.targetFatG}g
${params.restrictions?.length ? `- Restrictions alimentaires : ${params.restrictions.join(", ")}` : ""}
${params.preferences ? `- Préférences : ${params.preferences}` : ""}
${params.availableIngredients ? `- Ingrédients disponibles : ${params.availableIngredients}` : ""}

Format attendu:
{
  "name": "nom de la recette (max 60 caractères)",
  "ingredients": ["ingrédient 1 avec quantité", "ingrédient 2 avec quantité", ...],
  "instructions": ["étape 1", "étape 2", ...],
  "prepTimeMinutes": temps de préparation en minutes,
  "calories": kcal totaux,
  "protein_g": protéines totales en g,
  "carbs_g": glucides totaux en g,
  "fat_g": lipides totaux en g
}

Règles :
- Les macros TOTAUX de la recette doivent correspondre aux cibles (à 20% près)
- Si ingrédients disponibles sont fournis, utilise PRIORITAIREMENT ceux-ci
- Donne des quantités précises en grammes
- 3 à 6 étapes d'instructions max
- Temps de préparation réaliste (5-45 min)`,
            }],
          }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
        }),
      },
    )

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()) as GeneratedRecipe
  } catch {
    return null
  }
}

export async function suggestMealFromIngredients(params: {
  ingredients: string
  targetCalories?: number
  targetProteinG?: number
  targetCarbsG?: number
  targetFatG?: number
}): Promise<GeneratedRecipe | null> {
  if (!apiKey) return null

  try {
    let macroContext = ""
    if (params.targetCalories) {
      macroContext = `\nObjectifs macros (optionnels) :
- Calories : ~${params.targetCalories} kcal
- Protéines : ~${params.targetProteinG}g
- Glucides : ~${params.targetCarbsG}g
- Lipides : ~${params.targetFatG}g`
    }

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un chef nutritionniste. L'utilisateur a ces ingrédients sous la main et veut savoir quoi cuisiner.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Ingrédients disponibles : "${params.ingredients}"
${macroContext}

Format attendu:
{
  "name": "nom de la recette (max 60 caractères)",
  "ingredients": ["ingrédient 1 avec quantité", ...],
  "instructions": ["étape 1", "étape 2", ...],
  "prepTimeMinutes": temps en minutes,
  "calories": kcal totaux,
  "protein_g": protéines totales en g,
  "carbs_g": glucides totaux en g,
  "fat_g": lipides totaux en g
}

Règles :
- Utilise UNIQUEMENT les ingrédients listés (ou leurs substituts évidents)
- Si des macros cibles sont données, essaye de t'en approcher
- 3-6 étapes max
- Temps réaliste 5-45 min`,
            }],
          }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
        }),
      },
    )

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()) as GeneratedRecipe
  } catch {
    return null
  }
}

export interface NutritionalGap {
  nutrient: string
  current: number
  target: number
  deficit: number
  suggestion: string
}

export async function analyzeNutritionalGapsWithGemini(meals: {
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}[], targets: {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}): Promise<NutritionalGap[] | null> {
  if (!apiKey) return null

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un nutritionniste. Analyse les repas déjà consommés aujourd'hui et identifie les carences nutritionnelles.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Repas du jour : ${JSON.stringify(meals)}
Objectifs journaliers : ${JSON.stringify(targets)}

Format attendu (tableau JSON) :
[
  {
    "nutrient": "Calories" | "Protéines" | "Glucides" | "Lipides",
    "current": valeur actuelle,
    "target": valeur cible,
    "deficit": valeur manquante (négatif si en excès),
    "suggestion": "conseil repas/aliment pour combler ce manque (max 100 caractères)"
  }
]

Règles :
- N'inclus que les nutriments avec un déficit > 0
- Suggestion doit être concrète (ex: "Ajoute 150g de poulet au dîner")
- Maximum 4 entrées`,
            }],
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
        }),
      },
    )

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()) as NutritionalGap[]
  } catch {
    return null
  }
}

// ─── SÉANCE PERSONNALISÉE ─────────────────────────────

export interface CustomWorkoutSession {
  title: string
  exercises: {
    name: string
    muscleGroup: string
    sets: number
    reps: number
    restSeconds: number
    notes?: string
  }[]
  warmUp: string[]
  durationMinutes: number
}

export async function generateCustomWorkoutWithGemini(params: {
  targetMuscles: string[]
  goal: string
  gender: string
  availableEquipment?: string[]
  durationMinutes?: number
}): Promise<CustomWorkoutSession | null> {
  if (!apiKey) return null

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `Tu es un coach sportif expert. Crée une séance d'entraînement personnalisée.
Réponds UNIQUEMENT au format JSON brut (sans markdown, sans \`\`\`).

Paramètres :
- Muscles ciblés : ${params.targetMuscles.join(", ")}
- Objectif : ${params.goal === "LOSE_FAT" ? "perte de poids" : params.goal === "GAIN_MUSCLE" ? "prise de muscle" : "remise en forme"}
- Genre : ${params.gender === "FEMALE" ? "Femme" : "Homme"}
${params.availableEquipment?.length ? `- Équipement disponible : ${params.availableEquipment.join(", ")}` : "- Équipement : poids du corps uniquement"}
${params.durationMinutes ? `- Durée souhaitée : ~${params.durationMinutes} min` : ""}

Format attendu:
{
  "title": "nom de la séance (max 60 car.)",
  "exercises": [
    {
      "name": "nom exercice en français",
      "muscleGroup": "groupe musculaire",
      "sets": 3,
      "reps": 12,
      "restSeconds": 60,
      "notes": "variante ou conseil (optionnel)"
    }
  ],
  "warmUp": ["exercice échauffement 1", "exercice échauffement 2"],
  "durationMinutes": durée totale estimée
}

Règles :
- 5-8 exercices max
- Si femme : priorise fessiers, cuisses, bas du corps
- Si homme + prise de muscle : priorise exercices composés lourds
- Si perte de poids : inclus 1-2 exercices cardio/brûle-graisse, repos courts
- Durée réaliste (30-60 min)`,
            }],
          }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
        }),
      },
    )

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()) as CustomWorkoutSession
  } catch {
    return null
  }
}
