const express = require("express");
const { registerUser, loginUser, createBlog, updateBlog, getAllBlogs, deleteBlog } = require("../Controller/Controller");


const router = express.Router();
router.post("/register", registerUser)
router.post("/Login", loginUser)
router.post("/createBlog", createBlog)
router.put("/updateBlog/:id", updateBlog)
router.get("/users/:id", getAllBlogs)
router.patch("/users/:id/userBlog/:id", updateBlog)
router.delete("/users/:id/blogs", deleteBlog)



module.exports = router;