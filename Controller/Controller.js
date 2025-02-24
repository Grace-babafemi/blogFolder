const userModel = require("../Model/schemaFile");
// const bcrypt = require("bcrypt");

const handleError = (res, error) => {
  return res
    .status(500)
    .json({ message: "An error occurred", error: error.message });
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    // const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      userName,
      email,
      password: hashPassword,
      blogs: [],
    });

    if (!email || !password) {
      res.status(400).json({ message: "All fields required" }); 
    } else {
      res.status(201).json({ message: "Created", data: createUser });
    }
  } catch (error) {
    console.log(error);
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
    await findUser.save();
    res.status(200).json({ Message: "Blog Created", data: createBlog });
  } catch (error) {
    handleError(res, error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const findUser = await userModel.findById(req.params.id);
    res.status(200).json({ Message: "Blogs Retrieved", data: findUser.blog });
  } catch (error) {
    handleError(res, error);
  }
};

const updateBlog = async (req, res) => {
  try {
    const {userId, blogId} = req.params;
    const { title, content } = req.body;
    const findUser = await userModel.findById(userId);
    if (!findUser) {
        res.status(404).json({Message: "User Not Found"})
    }
    const updateBlog = await findUser.blogs.id(blogId);
    if (!updateBlog) {
        res.status(404).json({Message: "Blog Not Found"})
    }
    if(title) updateBlog.title = title;
    if(content) updateBlog.content = content;
    await findUser.save();
    return res.status(200).json({Message: "Blogs Updated Successfully", data: updateBlog})
  } catch (error) {
    console.log(error);
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
