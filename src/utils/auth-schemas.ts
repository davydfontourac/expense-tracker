import { z } from 'zod';

export const getLoginSchema = (t: any) => z.object({
  email: z.string().email(t.register.errors.emailInvalid),
  password: z.string().min(8, t.register.errors.passwordMin),
});

export const getRegisterSchema = (t: any) => z
  .object({
    fullName: z.string().min(3, t.register.errors.nameMin),
    email: z.string().email(t.register.errors.emailInvalid),
    password: z
      .string()
      .min(8, t.register.errors.passwordMin)
      .regex(/[A-Z]/, t.register.errors.passwordUpper)
      .regex(/[a-z]/, t.register.errors.passwordLower)
      .regex(/\d/, t.register.errors.passwordNum)
      .regex(/[^A-Za-z0-9]/, t.register.errors.passwordSymbol),
    confirmPassword: z.string().min(1, t.register.errors.confirmPassword),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: t.register.termsError,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t.register.errors.passwordsMatch,
    path: ['confirmPassword'],
  });

export const getForgotPasswordSchema = (t: any) => z.object({
  email: z.string().email(t.register.errors.emailInvalid),
});

const schemaForType = getRegisterSchema({ register: { errors: {}, termsError: '' } });
const loginSchemaForType = getLoginSchema({ register: { errors: {} } });
const forgotSchemaForType = getForgotPasswordSchema({ register: { errors: {} } });

export type LoginFormValues = z.infer<typeof loginSchemaForType>;
export type RegisterFormValues = z.infer<typeof schemaForType>;
export type ForgotPasswordFormValues = z.infer<typeof forgotSchemaForType>;
