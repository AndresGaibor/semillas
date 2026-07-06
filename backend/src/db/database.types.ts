export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievement: {
        Row: {
          code: string
          created_at: string
          criterion_code: string
          criterion_value: number | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          xp_bonus: number
        }
        Insert: {
          code: string
          created_at?: string
          criterion_code: string
          criterion_value?: number | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          xp_bonus?: number
        }
        Update: {
          code?: string
          created_at?: string
          criterion_code?: string
          criterion_value?: number | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          xp_bonus?: number
        }
        Relationships: []
      }
      activity: {
        Row: {
          activity_type_id: string
          age_group_id: string
          config: Json
          created_at: string
          difficulty: string
          feedback: string | null
          id: string
          is_required: boolean
          prompt: string
          sort_order: number
          step_id: string | null
          theme_id: string
          time_limit_sec: number | null
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          activity_type_id: string
          age_group_id: string
          config?: Json
          created_at?: string
          difficulty?: string
          feedback?: string | null
          id?: string
          is_required?: boolean
          prompt: string
          sort_order: number
          step_id?: string | null
          theme_id: string
          time_limit_sec?: number | null
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          activity_type_id?: string
          age_group_id?: string
          config?: Json
          created_at?: string
          difficulty?: string
          feedback?: string | null
          id?: string
          is_required?: boolean
          prompt?: string
          sort_order?: number
          step_id?: string | null
          theme_id?: string
          time_limit_sec?: number | null
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "theme_step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_option: {
        Row: {
          activity_id: string
          feedback: string | null
          id: string
          is_correct: boolean
          label: string | null
          sort_order: number
          text: string
        }
        Insert: {
          activity_id: string
          feedback?: string | null
          id?: string
          is_correct?: boolean
          label?: string | null
          sort_order: number
          text: string
        }
        Update: {
          activity_id?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean
          label?: string | null
          sort_order?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_option_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_type: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_game: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_game?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_game?: boolean
          name?: string
        }
        Relationships: []
      }
      age_group: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          max_age: number
          min_age: number
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          max_age: number
          min_age: number
          name: string
          sort_order: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          max_age?: number
          min_age?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      app_user: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          external_id: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          provider: Database["public"]["Enums"]["auth_provider"]
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          external_id?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          provider: Database["public"]["Enums"]["auth_provider"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          external_id?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          provider?: Database["public"]["Enums"]["auth_provider"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_log_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bible_book: {
        Row: {
          id: number
          name: string
          sort_order: number
          testament_id: number
        }
        Insert: {
          id?: never
          name: string
          sort_order: number
          testament_id: number
        }
        Update: {
          id?: never
          name?: string
          sort_order?: number
          testament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_book_testament_id_fkey"
            columns: ["testament_id"]
            isOneToOne: false
            referencedRelation: "bible_testament"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_reference: {
        Row: {
          book_id: number
          chapter: number
          id: string
          is_main: boolean
          theme_id: string
          verse_end: number
          verse_start: number
        }
        Insert: {
          book_id: number
          chapter: number
          id?: string
          is_main?: boolean
          theme_id: string
          verse_end: number
          verse_start: number
        }
        Update: {
          book_id?: number
          chapter?: number
          id?: string
          is_main?: boolean
          theme_id?: string
          verse_end?: number
          verse_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_reference_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_book"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_reference_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_reference_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_testament: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: never
          name: string
        }
        Update: {
          code?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      bible_version: {
        Row: {
          code: string
          created_at: string
          id: string
          is_public_domain: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_public_domain?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_public_domain?: boolean
          name?: string
        }
        Relationships: []
      }
      club: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          invite_code: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          invite_code?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_challenge: {
        Row: {
          club_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_on: string
          id: string
          metric_code: string
          name: string
          reward_xp: number
          starts_on: string
          target_value: number
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_on: string
          id?: string
          metric_code: string
          name: string
          reward_xp?: number
          starts_on: string
          target_value: number
        }
        Update: {
          club_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_on?: string
          id?: string
          metric_code?: string
          name?: string
          reward_xp?: number
          starts_on?: string
          target_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_challenge_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_challenge_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_challenge_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_challenge_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_member: {
        Row: {
          club_id: string
          joined_at: string
          member_role: string
          user_id: string
        }
        Insert: {
          club_id: string
          joined_at?: string
          member_role?: string
          user_id: string
        }
        Update: {
          club_id?: string
          joined_at?: string
          member_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_member_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      content_review: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["content_review_status"]
          submitted_by: string | null
          theme_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["content_review_status"]
          submitted_by?: string | null
          theme_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["content_review_status"]
          submitted_by?: string | null
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_review_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_review_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "content_review_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "content_review_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_review_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "content_review_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "content_review_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_review_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      crecer_step_type: {
        Row: {
          code: string
          color_hex: string | null
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          color_hex?: string | null
          description?: string | null
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          code?: string
          color_hex?: string | null
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      guardian_child_link: {
        Row: {
          accepted_at: string | null
          child_id: string
          created_at: string
          guardian_id: string
          id: string
          invite_code: string | null
          relationship: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          child_id: string
          created_at?: string
          guardian_id: string
          id?: string
          invite_code?: string | null
          relationship?: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          child_id?: string
          created_at?: string
          guardian_id?: string
          id?: string
          invite_code?: string | null
          relationship?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_child_link_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_child_link_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "guardian_child_link_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "guardian_child_link_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_child_link_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "guardian_child_link_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      key_verse: {
        Row: {
          book_id: number
          chapter: number
          id: string
          text: string
          theme_id: string
          verse: number
        }
        Insert: {
          book_id: number
          chapter: number
          id?: string
          text: string
          theme_id: string
          verse: number
        }
        Update: {
          book_id?: number
          chapter?: number
          id?: string
          text?: string
          theme_id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "key_verse_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_book"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_verse_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: true
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_verse_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: true
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      level_rule: {
        Row: {
          badge_color: string | null
          id: string
          level_no: number
          min_xp: number
          name: string
        }
        Insert: {
          badge_color?: string | null
          id?: string
          level_no: number
          min_xp: number
          name: string
        }
        Update: {
          badge_color?: string | null
          id?: string
          level_no?: number
          min_xp?: number
          name?: string
        }
        Relationships: []
      }
      media_asset: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string | null
          duration_sec: number | null
          height_px: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_bucket: string | null
          storage_key: string | null
          title: string | null
          width_px: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          duration_sec?: number | null
          height_px?: number | null
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          title?: string | null
          width_px?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          duration_sec?: number | null
          height_px?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_bucket?: string | null
          storage_key?: string | null
          title?: string | null
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_asset_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_asset_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_asset_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      offline_package: {
        Row: {
          content_version: number
          created_at: string
          id: string
          manifest: Json
          size_bytes: number
          theme_id: string
        }
        Insert: {
          content_version: number
          created_at?: string
          id?: string
          manifest?: Json
          size_bytes?: number
          theme_id: string
        }
        Update: {
          content_version?: number
          created_at?: string
          id?: string
          manifest?: Json
          size_bytes?: number
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_package_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_package_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      path: {
        Row: {
          code: string
          color_hex: string
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          color_hex: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order: number
        }
        Update: {
          code?: string
          color_hex?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      profile: {
        Row: {
          age_group_id: string | null
          avatar_key: string | null
          avatar_url: string | null
          created_at: string
          id: string
          nickname: string
          preferred_audio: boolean
          preferred_text_size: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group_id?: string | null
          avatar_key?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          nickname: string
          preferred_audio?: boolean
          preferred_text_size?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group_id?: string | null
          avatar_key?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          nickname?: string
          preferred_audio?: boolean
          preferred_text_size?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      progress_event: {
        Row: {
          activity_id: string | null
          client_event_id: string
          device_id: string | null
          event_type: Database["public"]["Enums"]["progress_event_type"]
          id: string
          is_correct: boolean | null
          occurred_at_client: string
          payload: Json
          received_at_server: string
          score: number | null
          step_id: string | null
          theme_id: string | null
          user_id: string
          xp_awarded: number
        }
        Insert: {
          activity_id?: string | null
          client_event_id: string
          device_id?: string | null
          event_type: Database["public"]["Enums"]["progress_event_type"]
          id?: string
          is_correct?: boolean | null
          occurred_at_client: string
          payload?: Json
          received_at_server?: string
          score?: number | null
          step_id?: string | null
          theme_id?: string | null
          user_id: string
          xp_awarded?: number
        }
        Update: {
          activity_id?: string | null
          client_event_id?: string
          device_id?: string | null
          event_type?: Database["public"]["Enums"]["progress_event_type"]
          id?: string
          is_correct?: boolean | null
          occurred_at_client?: string
          payload?: Json
          received_at_server?: string
          score?: number | null
          step_id?: string | null
          theme_id?: string | null
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_event_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_event_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "theme_step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_event_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_event_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_event_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_event_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "progress_event_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reflection_question: {
        Row: {
          age_group_id: string
          id: string
          question: string
          sort_order: number
          step_id: string
        }
        Insert: {
          age_group_id: string
          id?: string
          question: string
          sort_order: number
          step_id: string
        }
        Update: {
          age_group_id?: string
          id?: string
          question?: string
          sort_order?: number
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflection_question_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflection_question_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "theme_step"
            referencedColumns: ["id"]
          },
        ]
      }
      share_card: {
        Row: {
          achievement_id: string | null
          created_at: string
          id: string
          image_url: string
          theme_id: string | null
          user_id: string
        }
        Insert: {
          achievement_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          theme_id?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          theme_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_card_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_card_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_card_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_card_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_card_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "share_card_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      theme: {
        Row: {
          bible_version_id: string | null
          content_version: number
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          estimated_minutes: number
          id: string
          objective: string
          path_id: string
          published_at: string | null
          published_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          status: Database["public"]["Enums"]["publication_status"]
          summary: string | null
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          bible_version_id?: string | null
          content_version?: number
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          id?: string
          objective: string
          path_id: string
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          status?: Database["public"]["Enums"]["publication_status"]
          summary?: string | null
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          bible_version_id?: string | null
          content_version?: number
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          id?: string
          objective?: string
          path_id?: string
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["publication_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_bible_version_id_fkey"
            columns: ["bible_version_id"]
            isOneToOne: false
            referencedRelation: "bible_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "theme_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "theme_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "path"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "theme_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "theme_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "theme_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      theme_age_group: {
        Row: {
          age_group_id: string
          theme_id: string
        }
        Insert: {
          age_group_id: string
          theme_id: string
        }
        Update: {
          age_group_id?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_age_group_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_age_group_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_age_group_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_step: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          sort_order: number
          step_type_id: string
          theme_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          sort_order: number
          step_type_id: string
          theme_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          sort_order?: number
          step_type_id?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_step_step_type_id_fkey"
            columns: ["step_type_id"]
            isOneToOne: false
            referencedRelation: "crecer_step_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_step_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_step_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_step_content: {
        Row: {
          age_group_id: string
          audio_media_id: string | null
          body: string
          extra: Json
          id: string
          media_id: string | null
          short_instruction: string | null
          step_id: string
          title: string
        }
        Insert: {
          age_group_id: string
          audio_media_id?: string | null
          body: string
          extra?: Json
          id?: string
          media_id?: string | null
          short_instruction?: string | null
          step_id: string
          title: string
        }
        Update: {
          age_group_id?: string
          audio_media_id?: string | null
          body?: string
          extra?: Json
          id?: string
          media_id?: string | null
          short_instruction?: string | null
          step_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_step_content_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "age_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_step_content_audio_media_id_fkey"
            columns: ["audio_media_id"]
            isOneToOne: false
            referencedRelation: "media_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_step_content_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_step_content_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "theme_step"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievement: {
        Row: {
          achievement_id: string
          earned_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_activity_progress: {
        Row: {
          activity_id: string
          attempts: number
          best_score: number
          completed_at: string | null
          is_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          attempts?: number
          best_score?: number
          completed_at?: string | null
          is_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          attempts?: number
          best_score?: number
          completed_at?: string | null
          is_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_progress_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_activity_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_offline_download: {
        Row: {
          downloaded_at: string
          last_opened_at: string | null
          package_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          last_opened_at?: string | null
          package_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          last_opened_at?: string | null
          package_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_offline_download_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "offline_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_offline_download_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_offline_download_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_offline_download_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_theme_progress: {
        Row: {
          completed_at: string | null
          last_step_id: string | null
          percent: number
          started_at: string | null
          status: string
          theme_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          last_step_id?: string | null
          percent?: number
          started_at?: string | null
          status?: string
          theme_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          last_step_id?: string | null
          percent?: number
          started_at?: string | null
          status?: string
          theme_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_theme_progress_last_step_id_fkey"
            columns: ["last_step_id"]
            isOneToOne: false
            referencedRelation: "theme_step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_theme_progress_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_theme_progress_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "v_theme_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_theme_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_theme_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_theme_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_club_ranking: {
        Row: {
          club_id: string | null
          nickname: string | null
          rank_no: number | null
          user_id: string | null
          xp_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "club_member_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_level"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_xp"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_theme_public: {
        Row: {
          content_version: number | null
          cover_media_id: string | null
          estimated_minutes: number | null
          id: string | null
          objective: string | null
          path_code: string | null
          path_color_hex: string | null
          path_id: string | null
          path_name: string | null
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["publication_status"] | null
          summary: string | null
          title: string | null
          xp_reward: number | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "path"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_level: {
        Row: {
          level_name: string | null
          level_no: number | null
          user_id: string | null
          xp_total: number | null
        }
        Relationships: []
      }
      v_user_xp: {
        Row: {
          user_id: string | null
          xp_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auth_provider: "google" | "facebook" | "guest" | "email"
      content_review_status:
        | "draft"
        | "submitted"
        | "changes_requested"
        | "approved"
        | "published"
        | "rejected"
      media_kind: "image" | "audio" | "video" | "document" | "icon"
      progress_event_type:
        | "theme_started"
        | "theme_completed"
        | "block_started"
        | "block_completed"
        | "activity_started"
        | "activity_answered"
        | "activity_completed"
        | "reward_claimed"
        | "theme_downloaded"
        | "sync_marker"
      publication_status:
        | "draft"
        | "review"
        | "approved"
        | "published"
        | "archived"
      user_role: "admin" | "user" | "guest" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auth_provider: ["google", "facebook", "guest", "email"],
      content_review_status: [
        "draft",
        "submitted",
        "changes_requested",
        "approved",
        "published",
        "rejected",
      ],
      media_kind: ["image", "audio", "video", "document", "icon"],
      progress_event_type: [
        "theme_started",
        "theme_completed",
        "block_started",
        "block_completed",
        "activity_started",
        "activity_answered",
        "activity_completed",
        "reward_claimed",
        "theme_downloaded",
        "sync_marker",
      ],
      publication_status: [
        "draft",
        "review",
        "approved",
        "published",
        "archived",
      ],
      user_role: ["admin", "user", "guest", "parent"],
    },
  },
} as const
