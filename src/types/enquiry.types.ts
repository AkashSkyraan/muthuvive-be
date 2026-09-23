export interface AddUpdateEnquiry {
  id?: number;
  name: string;
  mobile?: string;
  email?: string;
  messages?: string;
  property_id?: String;
  regarding: string;
  status?: string;
}

export interface getEnquiry {
  id?: number;
  status?: string;
  regarding?: string;
  property_id?: string;
  mobile?: string;
  email?: string;
}
