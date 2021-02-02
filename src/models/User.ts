import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const saultRounds = 10;

const userSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

export interface UserBaseDocumentType extends Document {
  name: string;
  email: string;
  password: string;
  lastname: string;
  role: number;
  art: [];
  history: [];
  image: string;
  token: string;
  tokenExp: string;
  comparePassword(plainPassword: string): Promise<boolean>;
}

userSchema.pre<UserBaseDocumentType>("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saultRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;

        next();
      });
    });
  }
});

//methods//////////////////////////////////////////////////

userSchema.methods.comparePassword = function (plainPassword: string) {
  let user = this as UserBaseDocumentType;
  return bcrypt.compare(plainPassword, user.password);
};

////////////////////////////////////////////////////////

///////////////export this model////////////////////////////
export default mongoose.model<UserBaseDocumentType>("User", userSchema);
///////////////////////////////////////////
