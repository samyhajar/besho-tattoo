export type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  is_public: boolean;
  is_feature_image: boolean | null;
  created_at: string;
};

export interface TattooFormData {
  title: string;
  description: string;
  category: string;
  is_public: boolean;
}

export interface FeaturedTattoo {
  id: string;
  category: string;
  tattoo_id: string;
  created_at: string;
  updated_at: string;
}

export interface FeaturedTattooWithTattoo extends FeaturedTattoo {
  tattoo: Tattoo;
}
