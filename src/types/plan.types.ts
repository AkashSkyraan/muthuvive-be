export interface AddUpdatePlanInput {
  id?: number;
  duration: string;
  old_amount?: number;
  new_amount: number;
  features?: string[];
  status?: string;
}

export interface GetPlanInput {
  id?: number;
  status?: string;
}
