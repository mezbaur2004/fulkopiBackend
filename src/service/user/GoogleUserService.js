const { OAuth2Client } = require("google-auth-library");
const CreateToken = require("../../utility/CreateToken");
const UserModel = require("../../model/userModel");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GoogleUserService = async (req) => {
    try {
        const token = req.body.token;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        let user = await UserModel.findOne({ email: payload.email });

        if (!user) {
            // if no user, create new
            user = await UserModel.create({
                email: payload.email,
                firstName: payload.given_name || "",
                lastName: payload.family_name || "",
                photo: payload.picture,
                googleId: payload.sub,
                provider: "google",
            });
        } else {
            // if user already exists but doesn't have googleId -> upgrade account
            if (!user.googleId) {
                user.googleId = payload.sub;
                user.photo = payload.picture;
                user.provider = "google"; // upgrade provider
                await user.save();
            }
        }


        const appToken = CreateToken({ user_id: user._id, email: user.email, role:user.role });

        return { status: "success", token: appToken, user };
    } catch (error) {
        return { status: "error", error: error.toString() };
    }
};

module.exports = GoogleUserService;
