export interface AddUpdateCategoryInput {
  id?: number;
  image?: string | null;
  name: string;
  status?: string;
}

export interface GetPropertyInput {
  id?: number;
  status?: string;
}
