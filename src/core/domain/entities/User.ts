export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  businessName: string;
  businessType: BusinessType;
  plan: Plan;
  createdAt: Date;
  lastLoginAt: Date;
}

export enum BusinessType {
  PANADERIA = 'panaderia',
  CAFETERIA = 'cafeteria',
  DARK_KITCHEN = 'dark_kitchen',
  FOOD_TRUCK = 'food_truck',
  OTRO = 'otro',
}

export enum Plan {
  BASICO = 'basico',
  PRO = 'pro',
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: Date;
}
