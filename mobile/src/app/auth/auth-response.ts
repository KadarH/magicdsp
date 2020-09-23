export interface AuthResponse {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      access_token: string;
      expires_in: number;
    };
  };
}