import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please an email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "I am a new user.",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

// hash the password before saving
// Hash the password before saving
UserSchema.pre("save", async function (next) {
  const user = this as any; // Explicit casting for TypeScript

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

const User = models.User || model("User", UserSchema);

export default User;
