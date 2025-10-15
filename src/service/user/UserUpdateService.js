const userUpdateService = async (req, userModel) => {
    try {
        const data = await userModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );

        return { status: "success", data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = userUpdateService;
