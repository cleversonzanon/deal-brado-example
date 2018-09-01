export interface LoginResponse {
  token: string;
  termAccepted: boolean;
  email: string;
  name: string;
  modules: string[];
  authorizations: string[];
}
