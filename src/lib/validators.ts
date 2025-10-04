
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
// минимум 6 символов, хотя бы одна заглавная и одна цифра

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
