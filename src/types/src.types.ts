export interface addUpdateAminities {
  id?: number;
  name: string;
  status?: string;
}

export interface getAmenities {
  id?: number;
  status?: string;
}
export interface getPropertyHighlights {
  id?: number;
  status?: string;
}



export interface PincodeResult {
  pincode: string;
  postcode_localities: string[];
  city: string;
  district: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  formatted_address: string;
}

export interface PincodeDB {
  pincode: string;
  postcode_localities: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  formatted_address: string | null;
  created_at: string;
}
