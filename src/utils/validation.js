export const validatePassword = (password) => {
  const minLength = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password); // removed space to be more standard, though it was in prompt as (! @#$...)
  
  if (!minLength) return "La contraseña debe tener al menos 12 caracteres.";
  if (!hasUpper) return "Debe incluir al menos una letra mayúscula.";
  if (!hasLower) return "Debe incluir al menos una letra minúscula.";
  if (!hasNumber) return "Debe incluir al menos un número.";
  if (!hasSpecial) return "Debe incluir al menos un carácter especial (!@#$%^&*).";
  
  return null; // Valid
};
