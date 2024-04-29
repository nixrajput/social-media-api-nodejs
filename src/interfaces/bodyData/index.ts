export interface IRegisterBodyData {
  fname: string;
  lname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
  otp?: string;
}

export interface ILoginBodyData {
  email?: string;
  username?: string;
  password?: string;
  otp?: string;
}
