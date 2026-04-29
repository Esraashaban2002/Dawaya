const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            let password = new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$"
            );
            if (!password.test(value)) {
                throw new Error(
                    "Password must include uppercase , lowercase , numbers , speacial characters"
                );
            }
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is INVALID");
            }
        },
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    role: {
        type: String,
        enum: ["admin", "user", "pharmacist"],
        default: "user",
        trim: true,
    }
}, { timestamps: true })


// hash password 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// compare password 
userSchema.method.comparePassword = async function (password){
    return await bcryptjs.compare(password , this.password)
}

//  hide sensetive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;