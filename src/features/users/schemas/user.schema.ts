import { isValidEmail } from "@/lib/validations";
import { UserFormData } from "../types/user.types";

export function validateUserForm(data: UserFormData, isEdit: boolean = false): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Please provide a valid email address.";
  }

  if (!data.username || data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters long.";
  }

  if (!data.first_name || data.first_name.trim() === "") {
    errors.first_name = "First name is required.";
  }

  if (!data.last_name || data.last_name.trim() === "") {
    errors.last_name = "Last name is required.";
  }

  if (!isEdit && (!data.password || data.password.length < 6)) {
    errors.password = "Initial password must be at least 6 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
