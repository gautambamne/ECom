interface IUpdateUserRequest {
  name?: string;
  email?: string;
}

interface IUpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

interface IGetUserResponse {
  user: IUser;
}

interface IUpdateUserResponse {
  user: IUser;
  message: string;
}