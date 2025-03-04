import * as z from "zod";

const createAccountFormSchema = z
  .object({
    name: z.string().nonempty({
      message: "Name is required.",
    }),
    email: z
      .string()
      .nonempty({
        message: "Email is required.",
      })
      .email({
        message: "Invalid email.",
      }),
    phone: z.string().nonempty({
      message: "Phone number is required.",
    }),
    organization: z.string().nonempty({
      message: "Enter organiztion name",
    }),
    password: z
      .string()
      .nonempty({
        message: "Password is required.",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one numeric digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .nonempty({
        message: "Confirm Password is required.",
      })
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginAccountFormSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email is required.",
    })
    .email({
      message: "Invalid email.",
    }),
  password: z
    .string()
    .nonempty({
      message: "Password is required.",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one numeric digit")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const emailSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email." }),
});

const otpSchema = z.object({
  email: z.string(),
  otp: z
    .string()
    .nonempty({ message: "OTP is required." })
    .length(6, "OTP must be exactly 6 digits"),
});

const resetPasswordSchema = z
  .object({
    email: z.string(),
    newPassword: z
      .string()
      .nonempty({ message: "Please enter your new password" })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one numeric digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(30, "Name must not be longer than 30 characters."),
  organization: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  province: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  tehsil: z.string().nullable().optional(),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .nullable()
    .optional()
    .transform((value) => value ?? ""),
  address: z
    .string()
    .max(255, "Address cannot exceed 255 characters")
    .nullable()
    .optional()
    .transform((value) => value ?? ""),
});

// const projectFormSchema = z
//   .object({
//     title: z.string().nonempty({ message: "Project Title is required." }),
//     trade: z.string().nonempty({ message: "Trade selection is required." }),
//     sector: z.string().nonempty({ message: "Sector is required." }),
//     description: z.string().nonempty({ message: "Description is required." }),
//     requirements: z
//       .string()
//       .nonempty({ message: "Requirements are required." }),
//     location: z.object({
//       lat: z.string().nonempty({ message: "Latitude is required." }),
//       lng: z.string().nonempty({ message: "Longitude is required." }),
//     }),
//     address: z.string().nonempty({ message: "Address is required." }),
//     tehsil: z.string().nonempty({ message: "Tehsil is required." }),
//     district: z.string().nonempty({ message: "District is required." }),
//     province: z.string().nonempty({ message: "Province is required." }),
//     duration: z.string().nonempty({ message: "Duration is required." }),
//     startDate: z.string().nonempty({ message: "Start Date is required." }),
//     endDate: z.string().nonempty({ message: "End Date is required." }),
//     deadline: z
//       .string()
//       .nonempty({ message: "Application Deadline is required." }),
//     totalSlots: z.string().nonempty({ message: "Total Slots are required." }),
//   })
//   .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
//     message: "End date must be greater than start date",
//     path: ["endDate"],
//   });

const projectFormSchema = z
  .object({
    title: z.string().nonempty({ message: "Project Title is required." }),
    trade: z.string().nonempty({ message: "Trade selection is required." }),
    sector: z.string().nonempty({ message: "Sector is required." }),
    description: z.string().nonempty({ message: "Description is required." }),
    requirements: z
      .string()
      .nonempty({ message: "Requirements are required." }),
    location: z
      .array(z.number())
      .length(2, { message: "Location must contain latitude and longitude." }),
    address: z.string().nonempty({ message: "Address is required." }),
    tehsil: z.string().nonempty({ message: "Tehsil is required." }),
    district: z.string().nonempty({ message: "District is required." }),
    province: z.string().nonempty({ message: "Province is required." }),
    duration: z.string().nonempty({ message: "Duration is required." }),
    startDate: z.string().nonempty({ message: "Start Date is required." }),
    endDate: z.string().nonempty({ message: "End Date is required." }),
    deadline: z
      .string()
      .nonempty({ message: "Application Deadline is required." }),
    totalSlots: z.string().nonempty({ message: "Total Slots are required." }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be greater than start date",
    path: ["endDate"],
  });

export {
  createAccountFormSchema,
  loginAccountFormSchema,
  emailSchema,
  otpSchema,
  resetPasswordSchema,
  profileFormSchema,
  projectFormSchema,
};
