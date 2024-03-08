// Used for parsing errors from backend to frontend types
enum Tag {
  REQUIRED = "required",
  EMAIL = "email",
  MIN = "min",
  UNIQUE = "23505",
}

type ErrorTag = {
  type: Tag;
  message: string;
};

type FormValidationError = {
  backend_field: string;
  form_field: string;
  tags: Array<ErrorTag>;
};

type VeeFormValidationError = {
  field: string;
  message: string;
};

export const useParseFormErrors = (err: ApiValidationError) => {
  if (!err.field || !err.tag) return { field: "", message: "" };

  const { t } = useNuxtApp().$i18n;

  const mappedErrors: Array<FormValidationError> = [
    {
      backend_field: "Username",
      form_field: "username",
      tags: [
        {
          type: Tag.REQUIRED,
          message: t("validation-required", { field: "username" }),
        },
        {
          type: Tag.UNIQUE,
          message: t("validation-username-unique"),
        },
      ],
    },
    {
      backend_field: "Email",
      form_field: "email",
      tags: [
        {
          type: Tag.REQUIRED,
          message: t("validation-required", { field: "email" }),
        },
        {
          type: Tag.EMAIL,
          message: t("validation-email-invalid"),
        },
        {
          type: Tag.UNIQUE,
          message: t("validation-email-unique"),
        },
      ],
    },
    {
      backend_field: "Password",
      form_field: "password",
      tags: [
        {
          type: Tag.REQUIRED,
          message: t("validation-required", { field: "password" }),
        },
        {
          type: Tag.MIN,
          message: t("validation-min-length", {
            field: "Password",
            min: 3,
          }),
        },
      ],
    },
    {
      backend_field: "File",
      form_field: "file",
      tags: [
        {
          type: Tag.REQUIRED,
          message: t("validation-required", { field: "file" }),
        },
      ],
    },
  ];

  for (const mappedErr of mappedErrors) {
    if (mappedErr.backend_field != err.field) continue;

    const tag = mappedErr.tags.find((tag) => {
      return tag.type == err.tag;
    });

    if (!tag) continue;

    return { field: mappedErr.form_field, message: tag.message };
  }

  return { field: "", message: "" };
};
