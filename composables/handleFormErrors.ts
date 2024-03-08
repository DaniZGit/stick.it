import type { FetchError } from "ofetch";

interface HandledError {
  type: "other" | "validation" | "db"; // error type
  error?: string; // just text
  errors?: { [key: string]: string }; // array of per field errors
}

export const useHandleFormErrors = (
  error: FetchError<ApiError>
): HandledError | undefined => {
  const { t } = useNuxtApp().$i18n;
  const context = error.data;

  if (context?.error) {
    // some api internal error
    return {
      type: context.type,
      error: t("unexpected-error"),
    };
  } else if (context?.errors) {
    // form errors
    const errors: Array<ApiValidationError> = context.errors;

    // map errors to VeeForm error fields
    const mappedErrors = errors.reduce((map, err) => {
      const parsedErr = useParseFormErrors(err);
      map[parsedErr.field] = parsedErr.message;

      return map;
    }, {} as { [key: string]: string });

    return {
      type: context.type,
      errors: mappedErrors,
    };
  }

  // something unexpected happened
  return {
    type: "other",
    error: t("unexpected-error"),
  };
};
