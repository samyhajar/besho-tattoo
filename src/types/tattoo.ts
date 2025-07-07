export type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  is_public: boolean;
  created_at: string;
};

export interface TattooFormData {
  title: string;
  description: string;
  category: string;
  is_public: boolean;
}
