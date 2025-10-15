const UserCreateService = async (req, UserModel) => {
    try {
        const { email} = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return { status: "fail", data: "Email already exists" };
        }

        const PostBody = { ...req.body, provider: "local" };
        const data = await UserModel.create(PostBody);

        return { status: "success", data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};
module.exports = UserCreateService;
