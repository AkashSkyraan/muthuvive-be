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

export interface AddUpdatePropertyAreaInput {
  id?: number;
  image?: string | null;
  name: string;
  property_count: number;
  status?: string;
}

export interface GetPropertyAreaInput {
  id?: number;
  status?: string;
}

export interface AddUpdateSubCategoryInput {
  id?: number;
  prop_id: number;
  sub_name: string;
  status?: string;
}
