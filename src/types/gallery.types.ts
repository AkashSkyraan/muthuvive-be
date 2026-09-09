export interface AddUpdateGallery {
  id?: number;
  image: string;
  type: string;
  is_hero?: number;
  status?: "active" | "inactive";
}

export interface GetGallery {
  id?: number;
  status?: string;
  type?: string;
}
