const router = require("express").Router();

function isLoggedIn(req, res, next){
  if(req.session.loggedInUser) next()
  else res.redirect("/auth/login")
}

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index");
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) res.redirect('/');
		else res.redirect('/auth/login');
	});
});


module.exports = router;
