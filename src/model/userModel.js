const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },

        // Local user
        password: {
            type: String,
            required: function() {
                return this.provider === "local";
            }
        },
        firstName: { type: String, required: true },
        lastName: { type: String },
        photo: { type: String },
        mobile: { type: String },
        // Google user
        googleId: {
            type: String,
            required: function() {
                return this.provider === "google";
            }
        },
        // Meta
        provider: { type: String, enum: ["local", "google"], required: true },
        // 🔑 Role (new)
        role: { type: String, enum: ["user", "admin"], default: "user",required: true },
    },
    { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
