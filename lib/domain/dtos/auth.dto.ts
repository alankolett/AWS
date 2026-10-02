export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  token: string;
}

export interface UserSessionDto {
  userId: string;
  email: string;
  role: 'admin' | 'member' | 'student';
  builderId?: string;
}
