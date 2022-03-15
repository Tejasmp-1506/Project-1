const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const auth = require("../middleware/auth")

// Phase 1
router.post("/authors", authorController.createAuthor)

// router.post("/blogs", blogController.createBlog)

// router.get("/blogs", blogController.getBlogs)

// router.put("/blogs/:blogId", blogController.updateBlog)

// router.delete("/blogs/:blogId", blogController.deleteBlog)

// router.delete("/blogs", blogController.deleteBlogQuery)


// Phase 2
router.post("/login", authorController.loginAuthor)

router.post("/blogs/:authorId", auth.authenticate, auth.authorise, blogController.createBlog)

router.get("/blogs", auth.authenticate, auth.authorise, blogController.getBlogs)

router.put("/blogs/:blogId", auth.authenticate, blogController.updateBlog)

router.delete("/blogs/:blogsId", auth.authenticate, blogController.deleteBlog)

router.delete("/blogs", auth.authorise, blogController.deleteBlogQuery)

module.exports = router;