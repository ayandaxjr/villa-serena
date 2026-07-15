// Re-export types from the main project to keep them in sync
export type BookingStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
export type ActivityEventType =
  | 'page_view'
  | 'booking_request'
  | 'contact_inquiry'
  | 'booking_approved'
  | 'booking_declined'
  | 'booking_cancelled'

type EmptyRelationships = []

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          nationality: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          nationality?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['guests']['Insert']>
        Relationships: EmptyRelationships
      }
      bookings: {
        Row: {
          id: string
          guest_id: string
          check_in: string
          check_out: string
          nights: number
          guests_count: number
          status: BookingStatus
          message: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          check_in: string
          check_out: string
          guests_count?: number
          status?: BookingStatus
          message?: string | null
          internal_notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
        Relationships: EmptyRelationships
      }
      blocked_dates: {
        Row: {
          id: string
          start_date: string
          end_date: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          start_date: string
          end_date: string
          label?: string
        }
        Update: Partial<Database['public']['Tables']['blocked_dates']['Insert']>
        Relationships: EmptyRelationships
      }
      activity_log: {
        Row: {
          id: string
          event_type: ActivityEventType
          booking_id: string | null
          guest_id: string | null
          metadata: Record<string, unknown>
          ip_country: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: ActivityEventType
          booking_id?: string | null
          guest_id?: string | null
          metadata?: Record<string, unknown>
          ip_country?: string | null
          user_agent?: string | null
        }
        Update: Partial<Database['public']['Tables']['activity_log']['Insert']>
        Relationships: EmptyRelationships
      }
      inquiries: {
        Row: {
          id: string
          guest_id: string | null
          name: string
          email: string
          phone: string | null
          guests: string | null
          preferred_date: string | null
          message: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          guest_id?: string | null
          name: string
          email: string
          phone?: string | null
          guests?: string | null
          preferred_date?: string | null
          message?: string | null
          source?: string
        }
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
        Relationships: EmptyRelationships
      }
      site_content: {
        Row: {
          key: string
          value: string | null
          type: string
          label: string
          section: string
          updated_at: string
        }
        Insert: {
          key: string
          value?: string | null
          type?: string
          label?: string
          section?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['site_content']['Insert']>
        Relationships: EmptyRelationships
      }
    }
    Views: {
      bookings_with_guests: {
        Row: {
          id: string
          check_in: string
          check_out: string
          nights: number
          guests_count: number
          status: BookingStatus
          message: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
          guest_id: string
          guest_name: string
          guest_email: string
          guest_phone: string | null
          guest_nationality: string | null
        }
        Relationships: EmptyRelationships
      }
    }
    Functions: Record<string, never>
    Enums: {
      booking_status: BookingStatus
      activity_event_type: ActivityEventType
    }
    CompositeTypes: Record<string, never>
  }
}

export type Guest = Database['public']['Tables']['guests']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BlockedDate = Database['public']['Tables']['blocked_dates']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type BookingWithGuest = Database['public']['Views']['bookings_with_guests']['Row']
