export interface UserInfo {
  id: string;
  role: string;
  username: string;
  jwtId: string;
  iat: number;
  exp: number;
  refreshToken?: string;
}
