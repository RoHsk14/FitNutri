export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      fit_user_profiles: {
        Row: {
          id: string
          clerk_user_id: string
          name: string | null
          is_admin: boolean
          age: number
          gender: "MALE" | "FEMALE"
          current_weight_kg: number
          height_cm: number
          goal: "LOSE_FAT" | "GAIN_MUSCLE" | "MAINTENANCE"
          activity_level: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE"
          dietary_restrictions: string[]
          meals_per_day: number
          target_calories: number | null
          target_protein_g: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_user_profiles"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["fit_user_profiles"]["Insert"]>
      }
      fit_workout_plans: {
        Row: {
          id: string
          title: string
          description: string
          level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
          duration_weeks: number
          goal_type: "LOSE_FAT" | "GAIN_MUSCLE" | "MAINTENANCE"
          user_profile_id: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_workout_plans"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["fit_workout_plans"]["Insert"]>
      }
      fit_exercises: {
        Row: {
          id: string
          name: string
          muscle_group: string
          description: string
          video_url: string | null
          image_url: string | null
          primary_muscle: string | null
          synergist_muscles: string[] | null
          mechanics: string | null
          equipment: string | null
          ms_video_url: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_exercises"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["fit_exercises"]["Insert"]>
      }
      fit_workout_sessions: {
        Row: {
          id: string
          workout_plan_id: string
          exercise_id: string
          day_of_week: number
          sort_order: number
          sets: number
          reps: number
          rest_seconds: number
        }
        Insert: Omit<Database["public"]["Tables"]["fit_workout_sessions"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["fit_workout_sessions"]["Insert"]>
      }
      fit_nutrition_plans: {
        Row: {
          id: string
          user_profile_id: string
          meals_per_day: number
          total_calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_nutrition_plans"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["fit_nutrition_plans"]["Insert"]>
      }
      fit_food_items: {
        Row: {
          id: string
          name: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          category: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_food_items"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["fit_food_items"]["Insert"]>
      }
      fit_meal_food_items: {
        Row: {
          id: string
          nutrition_plan_id: string
          food_item_id: string
          meal_number: number
          quantity_g: number
        }
        Insert: Omit<Database["public"]["Tables"]["fit_meal_food_items"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["fit_meal_food_items"]["Insert"]>
      }
      fit_daily_meals: {
        Row: {
          id: string
          user_profile_id: string
          log_date: string
          meal_number: number
          food_item_id: string
          quantity_g: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_daily_meals"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["fit_daily_meals"]["Insert"]>
      }
      fit_weight_logs: {
        Row: {
          id: string
          user_profile_id: string
          weight_kg: number
          logged_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_weight_logs"]["Row"], "id" | "logged_at">
        Update: Partial<Database["public"]["Tables"]["fit_weight_logs"]["Insert"]>
      }
      fit_water_logs: {
        Row: {
          id: string
          user_profile_id: string
          amount_ml: number
          logged_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["fit_water_logs"]["Row"], "id" | "logged_at">
        Update: Partial<Database["public"]["Tables"]["fit_water_logs"]["Insert"]>
      }
    }
  }
}
