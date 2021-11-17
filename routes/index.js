const router = require("express").Router();

function isLoggedIn(req, res, next){
  if(req.session.loggedInUser) next()
  else res.redirect("/auth/login")
}

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index");
});




module.exports = router;
