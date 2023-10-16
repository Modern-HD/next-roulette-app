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
            play_data: {
                Row: {
                    created_at: string;
                    en: string;
                    idx: number;
                    ko: string;
                    roulette_set_idx: number;
                    user_idx: number;
                };
                Insert: {
                    created_at?: string;
                    en: string;
                    idx?: number;
                    ko: string;
                    roulette_set_idx: number;
                    user_idx: number;
                };
                Update: {
                    created_at?: string;
                    en?: string;
                    idx?: number;
                    ko?: string;
                    roulette_set_idx?: number;
                    user_idx?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'play_data_roulette_set_idx_roulette_set_idx_fk';
                        columns: ['roulette_set_idx'];
                        referencedRelation: 'roulette_set';
                        referencedColumns: ['idx'];
                    },
                    {
                        foreignKeyName: 'play_data_user_idx_user_idx_fk';
                        columns: ['user_idx'];
                        referencedRelation: 'user';
                        referencedColumns: ['idx'];
                    },
                ];
            };
            roulette_section: {
                Row: {
                    content: string;
                    created_at: string;
                    idx: number;
                    location: number;
                    roulette_set_idx: number;
                    updated_at: string;
                    weight: number;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    idx?: number;
                    location: number;
                    roulette_set_idx: number;
                    updated_at?: string;
                    weight?: number;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    idx?: number;
                    location?: number;
                    roulette_set_idx?: number;
                    updated_at?: string;
                    weight?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'roulette_section_roulette_set_idx_roulette_set_idx_fk';
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
                    public: boolean;
                    title: string;
                    updated_at: string;
                    user_idx: number;
                };
                Insert: {
                    category_idx: number;
                    created_at?: string;
                    description: string;
                    idx?: number;
                    play_count: number;
                    public?: boolean;
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
                    public?: boolean;
                    title?: string;
                    updated_at?: string;
                    user_idx?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'roulette_set_category_idx_category_idx_fk';
                        columns: ['category_idx'];
                        referencedRelation: 'category';
                        referencedColumns: ['idx'];
                    },
                    {
                        foreignKeyName: 'roulette_set_user_idx_user_idx_fk';
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
