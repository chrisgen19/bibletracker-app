export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  profilePicture?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  status: UserStatus;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
