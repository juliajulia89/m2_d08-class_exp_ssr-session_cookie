const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 5;
const bcrypt = require('bcrypt');

router.route('/signup')
.get((req, res, next) => {
	res.render('signup');
})
.post((req, res)=>{
	const {username, password} = req.body
	if(!username || !password) res.render("signup", {errorMessage: "All filds are required"})

	User.findOne({username})
	.then((user)=>{
		if(user) res.render("signup", {errorMessage: "User already exists"})

		const salt = bcrypt.genSaltSync(saltRound)
		const hashedPwd = bcrypt.hashSync( password , salt )

		User.create({username, password: hashedPwd})
		.then((newUser) => {
			console.log("session: ", req.session)
			res.render("index")
		})
		.catch(error=>res.render("signup", {errorMessage: `WTF the DB broke: ${error}`}))
	})
	.catch(console.log)
});

router.route('/login')
.get((req, res, next) => {
	res.render('login');
})
.post((req, res)=>{
	const {username, password} = req.body
	if(!username || !password) res.render("login", {errorMessage: "All filds are required"})

	User.findOne({username})
	.then((user)=>{
		if(!user) res.render("login", {errorMessage: "User does not exist"})
		const isPwdCorrect = bcrypt.compareSync(password, user.password) // The  first password is the one form the form, the secodn one is the encrypted one form the DB
		if(isPwdCorrect) {
			req.session.loggedInUser = user
			res.render("profile", user)
		}
		else res.render("login", {errorMessage: "Password incorrect"})
	})
	.catch(()=>{})
})

module.exports = router;
