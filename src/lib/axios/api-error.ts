import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api.types";

export class ApiError extends Error {
  status: number;
  data?: ApiErrorResponse;

  constructor(message: string, status: number = 500, data?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const status = error.response?.status || 500;

    let message = "An unexpected error occurred.";
    const errorsObj =
      data?.errors && typeof data.errors === "object"
        ? (data.errors as Record<string, unknown>)
        : null;

    if (errorsObj?.detail && typeof errorsObj.detail === "string") {
      message = errorsObj.detail;
    } else if (data?.detail) {
      message = data.detail;
    } else if (data?.message) {
      message = data.message;
    } else if (
      errorsObj?.non_field_errors &&
      Array.isArray(errorsObj.non_field_errors) &&
      errorsObj.non_field_errors.length > 0
    ) {
      message = errorsObj.non_field_errors[0];
    } else if (data?.non_field_errors && data.non_field_errors.length > 0) {
      message = data.non_field_errors[0];
    } else if (errorsObj) {
      const firstKey = Object.keys(errorsObj)[0];
      const val = errorsObj[firstKey];
      if (Array.isArray(val) && typeof val[0] === "string") {
        message = `${firstKey}: ${val[0]}`;
      } else if (typeof val === "string") {
        message = val;
      }
    } else if (data && typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const val = data[firstKey];
      if (Array.isArray(val) && typeof val[0] === "string") {
        message = `${firstKey}: ${val[0]}`;
      }
    }

    return new ApiError(message, status, data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("An unknown network error occurred.", 500);
}
