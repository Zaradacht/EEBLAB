const router = require("express").Router();

router.get("/", (req, res) => res.render("user/landing"));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("back");
});

module.exports = router;
