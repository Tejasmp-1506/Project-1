const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const auth = require("../middleware/auth")

// Phase 1
router.post("/authors", authorController.createAuthor)

// router.post("/blogs", blogController.createBlogs)

// router.get("/blogs", blogController.getBlog)

// router.put("/blogs/:blogId", blogController.updateBlog)

// router.delete("/blogs/:blogId", blogController.deleteBlog)

// router.delete("/blogs", blogController.deleteBlogQuery)


// Phase 2
router.post("/login", authorController.loginAuthor)

router.post("/blogs/:authorId", auth.authenticate, auth.authorise, blogController.createBlogs)

router.get("/blogs/:authorId", auth.authenticate, auth.authorise, blogController.getBlog)

router.put("/blogs/:blogId", auth.authenticate, blogController.updateBlog)

router.delete("/blogs/:blogId", auth.authenticate, blogController.deleteBlog)

router.delete("/blogs", auth.authenticate, blogController.deleteBlogQuery)

module.exports = router;