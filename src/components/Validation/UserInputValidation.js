// RegEx for input validation
export function UserInputValidation(input) {
  // Defining Regex as follow: character set From A-Z and a-z and digits which from 0-9 and chars "-", "_", " " from 1 to 255 characters long
  const reg = /^[A-Za-z\d-_ ]{1,255}$/i;
  const error = "Only allowed these characters (A-z, 0-9, _ -) range [1 - 255]";
  console.log("Regex: ", input, reg.test(input));
  return { check: reg.test(input), error: error };
}
export function PasswordValidation(input) {
  // Defining Regex as follow: allow everything from 8 to 64 characters long
  const reg = /^[\S]{8,64}$/i;
  const error = "Password must be between [8 - 64] characters long";
  console.log("Regex: ", input, reg.test(input));
  return { check: reg.test(input), error: error };
}
