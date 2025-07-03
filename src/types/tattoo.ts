export type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  created_at: string;
};

export interface TattooFormData {
  title: string;
  description: string;
  category: string;
}
