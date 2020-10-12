export interface AuthResponse {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}
