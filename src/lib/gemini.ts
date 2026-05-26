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
