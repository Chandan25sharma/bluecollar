import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          email: string
          phone: string | null
          password: string
          role: 'CLIENT' | 'PROVIDER' | 'ADMIN'
          verified: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          password: string
          role?: 'CLIENT' | 'PROVIDER' | 'ADMIN'
          verified?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          password?: string
          role?: 'CLIENT' | 'PROVIDER' | 'ADMIN'
          verified?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      services: {
        Row: {
          id: number
          title: string
          description: string | null
          price: number
          category: 'ELECTRICAL' | 'PLUMBING' | 'CARPENTRY' | 'PAINTING' | 'CLEANING' | 'HVAC' | 'LANDSCAPING' | 'HANDYMAN' | 'OTHER'
          location: string | null
          isActive: boolean
          providerId: number
          createdAt: string
          updatedAt: string
        }
      }
      bookings: {
        Row: {
          id: number
          scheduledAt: string
          completedAt: string | null
          totalAmount: number
          status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
          notes: string | null
          serviceId: number
          clientId: number
          providerId: number
          createdAt: string
          updatedAt: string
        }
      }
      reviews: {
        Row: {
          id: number
          rating: number
          comment: string | null
          bookingId: number
          serviceId: number
          reviewerId: number
          revieweeId: number
          createdAt: string
          updatedAt: string
        }
      }
    }
  }
}
