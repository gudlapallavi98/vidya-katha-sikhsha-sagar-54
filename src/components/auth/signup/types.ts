
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
  role: "student" | "teacher";
}

export interface CaptchaValue {
  num1: number;
  num2: number;
}
