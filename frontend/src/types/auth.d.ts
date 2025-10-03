interface IUser {
  id: string;
  name: string;
  email: string;
  role: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface IRegistrationResponse {
  user: IUser;
  message: string;
}

interface IVerifyResponse {
  user: IUser;
  access_token: string;
  message: string;
}
interface ILoginResposne {
  user: IUser;
  access_token: string;
  message: string;
}

interface IRefreshResponse {
  access_token: string;
  message: string;
}
