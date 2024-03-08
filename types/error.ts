interface ApiError {
  type: "other" | "validation" | "db";
  error?: string;
  errors?: Array<ApiValidationError>;
}

interface ApiValidationError {
  field?: string;
  tag?: string;
  value?: string;
  message?: string;
}

interface ErrorAlert {
  message: string;
  visible: boolean;
  severity: string;
}
