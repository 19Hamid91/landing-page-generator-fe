export interface User {
  id: number;
  name: string;
  email: string;
}

export interface FeatureBreakdown {
  feature: string;
  explanation: string;
}

export interface AiOutput {
  headline: string;
  sub_headline: string;
  description: string;
  benefits: string[];
  features_breakdown: FeatureBreakdown[];
  cta_text: string;
}

export interface SalesPage {
  id: number;
  user_id: number;
  product_name: string;
  product_description: string;
  target_audience: string;
  price: string | null;
  features: string[];
  usp: string[];
  ai_output: AiOutput;
  template_name: string;
  images: string[];
  language: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export type TemplateName = 'modern' | 'elegant' | 'dark';
