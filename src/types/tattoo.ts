import type {
  PortfolioMediaType,
  PortfolioSection,
} from "@/lib/portfolio-media";

export interface PortfolioMedia {
  id: string;
  tattoo_id: string;
  storage_path: string;
  media_type: PortfolioMediaType;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  display_url?: string | null;
}

export type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  is_public: boolean;
  is_feature_image: boolean | null;
  created_at: string;
  media?: PortfolioMedia[];
  primaryMedia?: PortfolioMedia | null;
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

export interface PendingPortfolioMediaUpload {
  clientId: string;
  file: File;
  mediaType: PortfolioMediaType;
  sortOrder: number;
}

export type PrimaryMediaSelection =
  | { kind: "existing"; mediaId: string }
  | { kind: "pending"; clientId: string };

export interface PortfolioMediaChangeSet {
  pendingMedia: PendingPortfolioMediaUpload[];
  removedMediaIds: string[];
  primarySelection: PrimaryMediaSelection | null;
}

export interface TattooMutationInput {
  id?: string;
  title: string;
  description: string | null;
  category: string | null;
  is_public: boolean;
  media: PortfolioMediaChangeSet;
}

export type FixedPortfolioCategory = Extract<
  PortfolioSection,
  "art" | "designs"
>;
