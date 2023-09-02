export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            category: {
                Row: {
                    created_at: string;
                    en: string;
                    idx: number;
                    ko: string;
                };
                Insert: {
                    created_at?: string;
                    en: string;
                    idx?: number;
                    ko: string;
                };
                Update: {
                    created_at?: string;
                    en?: string;
                    idx?: number;
                    ko?: string;
                };
                Relationships: [];
            };
            roulette_section: {
                Row: {
                    created_at: string;
                    idx: number;
                    location: number;
                    roulette_set_idx: number;
                    updated_at: string;
                    weight: number;
                };
                Insert: {
                    created_at?: string;
                    idx?: number;
                    location: number;
                    roulette_set_idx: number;
                    updated_at?: string;
                    weight?: number;
                };
                Update: {
                    created_at?: string;
                    idx?: number;
                    location?: number;
                    roulette_set_idx?: number;
                    updated_at?: string;
                    weight?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'roulette_section_roulette_set_idx_fkey';
                        columns: ['roulette_set_idx'];
                        referencedRelation: 'roulette_set';
                        referencedColumns: ['idx'];
                    },
                ];
            };
            roulette_set: {
                Row: {
                    category_idx: number;
                    created_at: string;
                    description: string;
                    idx: number;
                    play_count: number;
                    title: string;
                    updated_at: string;
                    user_idx: number;
                };
                Insert: {
                    category_idx: number;
                    created_at?: string;
                    description: string;
                    idx?: number;
                    play_count?: number;
                    title: string;
                    updated_at?: string;
                    user_idx: number;
                };
                Update: {
                    category_idx?: number;
                    created_at?: string;
                    description?: string;
                    idx?: number;
                    play_count?: number;
                    title?: string;
                    updated_at?: string;
                    user_idx?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'roulette_set_category_idx_fkey';
                        columns: ['category_idx'];
                        referencedRelation: 'category';
                        referencedColumns: ['idx'];
                    },
                    {
                        foreignKeyName: 'roulette_set_user_idx_fkey';
                        columns: ['user_idx'];
                        referencedRelation: 'user';
                        referencedColumns: ['idx'];
                    },
                ];
            };
            user: {
                Row: {
                    created_at: string;
                    idx: number;
                    nick_name: string;
                    updated_at: string;
                    uuid: string;
                };
                Insert: {
                    created_at?: string;
                    idx?: number;
                    nick_name: string;
                    updated_at?: string;
                    uuid: string;
                };
                Update: {
                    created_at?: string;
                    idx?: number;
                    nick_name?: string;
                    updated_at?: string;
                    uuid?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'user_uuid_fkey';
                        columns: ['uuid'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
