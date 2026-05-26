export interface WarmUpExercise {
  name: string
  duration: string
  muscle_group: string
  description: string
}

const WARM_UPS: Record<string, WarmUpExercise[]> = {
  PUSH: [
    { name: "Rotations d'épaules", duration: "30s", muscle_group: "Shoulders", description: "Cercles avant/arrière pour mobiliser les articulations" },
    { name: "Pompes inclinées", duration: "15 reps", muscle_group: "Pectoraux", description: "Pompes sur banc ou surface surélevée en rythme modéré" },
    { name: "Pec fly élastique", duration: "15 reps", muscle_group: "Pectoraux", description: "Écartés avec élastique ou à vide pour activer les pectoraux" },
  ],
  PULL: [
    { name: "Rétractions scapulaires", duration: "15 reps", muscle_group: "Dos", description: "Tirage des épaules en arrière pour activer les trapèzes" },
    { name: "Rotations des poignets", duration: "30s", muscle_group: "Forearms", description: "Cercles des poignets pour préparer les avant-bras" },
    { name: "Band pull-apart", duration: "15 reps", muscle_group: "Shoulders", description: "Traction élastique devant la poitrine pour ouvrir les épaules" },
  ],
  LEGS: [
    { name: "Balancements de jambes", duration: "30s", muscle_group: "Quadriceps", description: "Balancements avant/arrière et latéraux pour les hanches" },
    { name: "Squats au poids du corps", duration: "15 reps", muscle_group: "Quadriceps", description: "Squats lents et contrôlés pour activer les jambes" },
    { name: "Mobilisation des chevilles", duration: "30s", muscle_group: "Calves", description: "Rotation des chevilles pour préparer les réceptions" },
  ],
  FULL_BODY: [
    { name: "Jumping jacks", duration: "30s", muscle_group: "Cardio", description: "Sauts d'extension pour élever le rythme cardiaque" },
    { name: "Rotations du torse", duration: "30s", muscle_group: "Abdominaux", description: "Torsion du buste pour mobiliser la colonne" },
    { name: "Squats sautés légers", duration: "10 reps", muscle_group: "Quadriceps", description: "Petits squats dynamiques pour activer tout le corps" },
  ],
  SHOULDERS: [
    { name: "Cercles de bras", duration: "30s", muscle_group: "Shoulders", description: "Grands cercles avant/arrière pour les épaules" },
    { name: "YTW à vide", duration: "10 reps", muscle_group: "Shoulders", description: "Mouvements en Y, T et W pour activer la coiffe des rotateurs" },
    { name: "Band pull-apart", duration: "15 reps", muscle_group: "Shoulders", description: "Traction élastique pour ouvrir les épaules" },
  ],
  GLUTES: [
    { name: "Pont fessiers au sol", duration: "15 reps", muscle_group: "Glutes", description: "Soulèvement du bassin pour activer les fessiers" },
    { name: "Balancements de jambes", duration: "30s", muscle_group: "Glutes", description: "Balancements latéraux pour réveiller les fessiers" },
    { name: "Genoux hauts", duration: "30s", muscle_group: "Cardio", description: "Montée de genoux dynamique pour l'activation générale" },
  ],
  CORE: [
    { name: "Bird dog", duration: "10 reps", muscle_group: "Abdominaux", description: "Extension bras/jambe opposés au sol pour le gainage" },
    { name: "Dead bug", duration: "10 reps", muscle_group: "Abdominaux", description: "Bras et jambes opposés au sol pour la stabilité du core" },
    { name: "Planche", duration: "30s", muscle_group: "Abdominaux", description: "Gainage ventral pour activer la sangle abdominale" },
  ],
}

export type WarmUpType = "PUSH" | "PULL" | "LEGS" | "FULL_BODY" | "SHOULDERS" | "GLUTES" | "CORE"

export function getWarmUpType(label: string): WarmUpType {
  const l = label.toLowerCase()
  if (l.includes("push") || l.includes("pectoraux") || l.includes("triceps") || l.includes("pousser")) return "PUSH"
  if (l.includes("pull") || l.includes("dos") || l.includes("biceps") || l.includes("tirer")) return "PULL"
  if (l.includes("leg") || l.includes("jambes") || l.includes("quad") || l.includes("lower") || l.includes("fessier")) return "LEGS"
  if (l.includes("épaules") || l.includes("shoulder") || l.includes("militaire")) return "SHOULDERS"
  if (l.includes("cardio") || l.includes("full body")) return "FULL_BODY"
  if (l.includes("abdos") || l.includes("abdo") || l.includes("core")) return "CORE"
  if (l.includes("glute") || l.includes("fessier")) return "GLUTES"
  return "FULL_BODY"
}

export function getWarmUp(label: string): WarmUpExercise[] {
  return WARM_UPS[getWarmUpType(label)] || WARM_UPS.FULL_BODY
}
