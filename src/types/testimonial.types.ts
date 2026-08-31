export interface AddUpdateTestimonialInput {
  id?: number;
  name: string;
  image?: string | null;
  content: string;
  rating?: number;
  status?: string;
  location: string;
}

export interface GetTestimonialInput {
  id?: number;
  status?: string;
}
