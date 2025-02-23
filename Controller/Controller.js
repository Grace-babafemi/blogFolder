const userModel = require("../Model/schemaFile");
const bcrypt = require("bcrypt");

const handleError = (res, error) => {
  return res
    .status(500)
    .json({ message: "An error occurred", error: error.message });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      username,
      email,
      password: hashPassword,
      blog: [],
    });

    if (!email || !password) {
      res.status(400).json({ message: "All fields required" });
    } else {
      res.status(201).json({ message: "Created", data: createUser });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      res.status(404).json({ message: "Invalid email or password" });
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ success: true, data: findUser });
  } catch (error) {
    handleError(res, error);
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, createdAt } = req.body;

    const findUser = await userModel.findById(req.params.id);
    const createBlog = await findUser.blogs.push({
      title,
      content,
      createdAt,
    });
    await createBlog.save();
    res.status(200).json({ alert: "Blog Created", data: createBlog });
  } catch (error) {
    handleError(res, error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const findUser = await userModel.findById(req.params.id);
    res.status(200).json({ alert: "Blogs Retrieved", data: findUser.blogs });
  } catch (error) {
    handleError(res, error);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const findUser = await userModel.findById(req.params.id);
    const update = await findUser.blogs.id(title, content);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const findUser = await userModel.findById(req.params.id);

    if (!findUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      findUser.blogs = [];
      res
        .status(200)
        .json({ message: "All blogs deleted", data: findUser.blogs });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};
