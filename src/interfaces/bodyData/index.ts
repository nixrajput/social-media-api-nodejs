export interface IRegisterBodyData {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  countryCode?: string;
  otp?: string;
}

export interface ILoginBodyData {
  email?: string;
  username?: string;
  password?: string;
  otp?: string;
}
