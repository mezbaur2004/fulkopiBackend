const mongoose=require('mongoose');

const DataSchema=mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        avatar: { type: String },
        googleId: { type: String, required: true },
        provider: { type: String, default: "google" }
    },{ timestamps: true,versionKey: false }
);

const googleUserModel=mongoose.model('googleusers',DataSchema);
module.exports=googleUserModel;