// services/GoogleUserService.js
const { OAuth2Client } = require("google-auth-library");
const CreateToken = require("../../utility/CreateToken");
const GoogleUserModel=require("../../model/googleUserModel")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GoogleUserService = async (req) => {
    try {
        // Extract token from request body
        const token = req.body.token || req.body.credential; // support both
        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user exists
        let user = await GoogleUserModel.findOne({ email: payload.email });
        if (!user) {
            user = await GoogleUserModel.create({
                email: payload.email,
                name: payload.name,
                avatar: payload.picture,
                googleId: payload.sub,
                provider: "google",
            });
        }

        // Generate app JWT using your CreateToken function
        const appToken = CreateToken({ id: user._id, email: user.email });

        return { status: "success", token: appToken, user };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

module.exports = GoogleUserService;
