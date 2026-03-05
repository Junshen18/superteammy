export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  photo_url: string;
  twitter_url: string;
  skill_tags: string[];
  achievements: {
    hackathon_wins?: number;
    projects_built?: number;
    grants_received?: number;
    dao_contributions?: number;
    bounties_completed?: number;
  };
  is_featured: boolean;
  is_core_team: boolean;
  display_order: number;
  created_at: string;
}

export interface Event {
  id: string;
  luma_event_id?: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location: string;
  luma_url: string;
  image_url: string;
  is_upcoming: boolean;
  is_archived?: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  category: 'solana_project' | 'malaysian_partner' | 'sponsor';
  display_order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  content: string;
  tweet_url: string;
  is_featured: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
}
