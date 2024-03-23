import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import * as msg from "~/constants/form-errors";

export const useFormSchema = () => {
  const { t } = useI18n();

  const RegisterSchema = toTypedSchema(
    zod.object({
      username: zod
        .string({
          required_error: t("validation-required", { field: "username" }),
        })
        .min(3, {
          message: t("validation-min-length", { field: "Username", min: 3 }),
        }),
      email: zod
        .string({
          required_error: t("validation-required", { field: "email" }),
        })
        .regex(msg.EMAIL_REGEX, { message: t("validation-email-invalid") }),
      password: zod
        .string({
          required_error: t("validation-required", { field: "password" }),
        })
        .min(8, {
          message: t("validation-min-length", { field: "Password", min: 8 }),
        })
        .regex(msg.PASSWORD_REGEX, {
          message: t("validation-password-invalid"),
        }),
    })
  );

  const LoginSchema = toTypedSchema(
    zod.object({
      email: zod
        .string({
          required_error: t("validation-required", { field: "email" }),
        })
        .regex(msg.EMAIL_REGEX, { message: t("validation-email-invalid") }),
      password: zod.string({
        required_error: t("validation-required", { field: "password" }),
      }),
    })
  );

  const MAX_FILE_SIZE = 500000;
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const AlbumCreateSchema = toTypedSchema(
    zod.object({
      title: zod
        .string({
          required_error: t("validation-required", { field: "title" }),
        })
        .min(3, t("validation-min-length", { field: "Title", min: 3 })),
      dateFrom: zod.date({
        required_error: t("validation-required", { field: "date from" }),
      }),
      dateTo: zod.date({
        required_error: t("validation-required", { field: "date to" }),
      }),
      featured: zod.boolean().default(false),
      file: zod
        .any()
        .refine((file) => {
          if (!file || file.size <= MAX_FILE_SIZE) return true;
        }, t("validation-file-max-size"))
        .refine((file) => {
          if (!file || ACCEPTED_IMAGE_TYPES.includes(file?.type)) return true;
        }, t("validation-file-accepted-types")),
    })
  );

  const PageCreateSchema = toTypedSchema(
    zod.object({
      file: zod
        .any()
        .refine((file) => {
          if (!file || file.size <= MAX_FILE_SIZE) return true;
        }, t("validation-file-max-size"))
        .refine((file) => {
          if (!file || ACCEPTED_IMAGE_TYPES.includes(file?.type)) return true;
        }, t("validation-file-accepted-types")),
    })
  );

  const StickerCreateSchema = toTypedSchema(
    zod.object({
      file: zod
        .any()
        .refine((file) => {
          if (!file || file.size <= MAX_FILE_SIZE) return true;
        }, t("validation-file-max-size"))
        .refine((file) => {
          if (!file || ACCEPTED_IMAGE_TYPES.includes(file?.type)) return true;
        }, t("validation-file-accepted-types")),
      title: zod
        .string({
          required_error: t("validation-required", { field: "title" }),
        })
        .min(3, t("validation-min-length", { field: "Title", min: 3 })),
      type: zod.string({
        required_error: t("validation-required", { field: "type" }),
      }),
      rarity: zod.string({
        required_error: t("validation-required", { field: "rarity" }),
      }),
    })
  );

  const RarityCreateSchema = toTypedSchema(
    zod.object({
      title: zod
        .string({
          required_error: t("validation-required", { field: "title" }),
        })
        .min(3, t("validation-min-length", { field: "Title", min: 3 })),
    })
  );

  return {
    RegisterSchema,
    LoginSchema,
    AlbumCreateSchema,
    PageCreateSchema,
    StickerCreateSchema,
    RarityCreateSchema,
  };
};
