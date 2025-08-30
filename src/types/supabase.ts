export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string;
          date: string;
          email: string;
          full_name: string;
          google_meet_created_at: string | null;
          google_meet_event_id: string | null;
          google_meet_link: string | null;
          google_meet_space_id: string | null;
          id: string;
          image_url: string | null;
          notes: string | null;
          phone: string | null;
          status: string;
          time_end: string;
          time_start: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          date: string;
          email: string;
          full_name: string;
          google_meet_created_at?: string | null;
          google_meet_event_id?: string | null;
          google_meet_link?: string | null;
          google_meet_space_id?: string | null;
          id?: string;
          image_url?: string | null;
          notes?: string | null;
          phone?: string | null;
          status?: string;
          time_end: string;
          time_start: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          email?: string;
          full_name?: string;
          google_meet_created_at?: string | null;
          google_meet_event_id?: string | null;
          google_meet_link?: string | null;
          google_meet_space_id?: string | null;
          id?: string;
          image_url?: string | null;
          notes?: string | null;
          phone?: string | null;
          status?: string;
          time_end?: string;
          time_start?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      availabilities: {
        Row: {
          date: string;
          id: string;
          is_booked: boolean;
          time_end: string;
          time_start: string;
        };
        Insert: {
          date: string;
          id?: string;
          is_booked?: boolean;
          time_end: string;
          time_start: string;
        };
        Update: {
          date?: string;
          id?: string;
          is_booked?: boolean;
          time_end?: string;
          time_start?: string;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          admin_notes: string | null;
          appointment_date: string;
          appointment_id: string | null;
          appointment_time_end: string;
          appointment_time_start: string;
          client_email: string;
          client_name: string;
          client_phone: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          reference_image_url: string | null;
          result_images: string[] | null;
          session_notes: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          appointment_date: string;
          appointment_id?: string | null;
          appointment_time_end: string;
          appointment_time_start: string;
          client_email: string;
          client_name: string;
          client_phone?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reference_image_url?: string | null;
          result_images?: string[] | null;
          session_notes?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          appointment_date?: string;
          appointment_id?: string | null;
          appointment_time_end?: string;
          appointment_time_start?: string;
          client_email?: string;
          client_name?: string;
          client_phone?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reference_image_url?: string | null;
          result_images?: string[] | null;
          session_notes?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'logs_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          price_cents: number;
          product_id: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          price_cents: number;
          product_id: string;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          price_cents?: number;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          id: string;
          status: string;
          total_cents: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          status?: string;
          total_cents: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          status?: string;
          total_cents?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string;
          is_active: boolean;
          name: string;
          price_cents: number;
          stock_quantity: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url: string;
          is_active?: boolean;
          name: string;
          price_cents: number;
          stock_quantity?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string;
          is_active?: boolean;
          name?: string;
          price_cents?: number;
          stock_quantity?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_admin: boolean;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          is_admin?: boolean;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          content: string;
          field_name: string;
          id: string;
          page: string;
          section: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content: string;
          field_name: string;
          id?: string;
          page: string;
          section: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content?: string;
          field_name?: string;
          id?: string;
          page?: string;
          section?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      tattoos: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string;
          is_public: boolean;
          title: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url: string;
          is_public?: boolean;
          title: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string;
          is_public?: boolean;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cleanup_past_availability_slots: {
        Args: Record<PropertyKey, never>;
        Returns: {
          deleted_count: number;
        }[];
      };
      update_site_content: {
        Args: {
          p_content: string;
          p_field_name: string;
          p_page: string;
          p_section: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
