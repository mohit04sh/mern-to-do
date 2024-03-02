import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,

    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
    }],
    date: {
        type: Date,
        default: Date.now,
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);