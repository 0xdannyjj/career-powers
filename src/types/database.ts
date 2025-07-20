export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          responses: Json
          mbti_type: string
          confidence_score: number
          superpower_title: string
          superpower_data: Json
          ai_analysis: Json
          completed_at: string
          created_at: string
          updated_at: string
          shared_count: number
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          responses: Json
          mbti_type: string
          confidence_score: number
          superpower_title: string
          superpower_data: Json
          ai_analysis: Json
          completed_at?: string
          created_at?: string
          updated_at?: string
          shared_count?: number
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          responses?: Json
          mbti_type?: string
          confidence_score?: number
          superpower_title?: string
          superpower_data?: Json
          ai_analysis?: Json
          completed_at?: string
          created_at?: string
          updated_at?: string
          shared_count?: number
          ip_address?: string | null
        }
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          assessment_id: string | null
          subscribed_at: string
          status: 'active' | 'unsubscribed'
          source: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          email: string
          assessment_id?: string | null
          subscribed_at?: string
          status?: 'active' | 'unsubscribed'
          source?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          email?: string
          assessment_id?: string | null
          subscribed_at?: string
          status?: 'active' | 'unsubscribed'
          source?: string
          metadata?: Json | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          assessment_id: string | null
          event_type: string
          event_data: Json
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id?: string | null
          event_type: string
          event_data: Json
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string | null
          event_type?: string
          event_data?: Json
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}