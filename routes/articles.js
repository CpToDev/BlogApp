const express = require('express');
const router = express.Router();
const Article = require('../model/Article');
const url = require('url');

//create

router.get('/new', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('articles/new', { article: new Article() });
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

router.post('/', (req, res) => {
	if (req.isAuthenticated()) {
		let newArticle = new Article({
			title: req.body.title,
			description: req.body.description,
			author: req.user.name
		});
		newArticle.save((err, article) => {
			if (err) {
				console.log(err);
				res.render('articles/new', { article: article });
			} else {
				console.log('Successfully saved');
				res.redirect(`/articles/${article.id}`);
			}
		});
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

//read

router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		Article.find((err, result) => {
			if (!err) {
				result.sort((a, b) => b.createdAt - a.createdAt);
				res.render('articles/index', { articles: result });
			}
		});
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

router.get('/:id', (req, res) => {
	if (req.isAuthenticated()) {
		const article = Article.findById(req.params.id, (err, result) => {
			if (err) {
				res.redirect('/');
			} else {
				console.log(req.user.name);
				console.log(result.author);
				const isAutherized = req.user.name === result.author;

				res.render('articles/show', { article: result, isAutherized: isAutherized });
			}
		});
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

//Update
router.get('/edit/:id', (req, res) => {
	if (req.isAuthenticated()) {
		Article.findById(req.params.id, (err, result) => {
			if (err || result === null) {
				res.redirect('/');
			} else {
				res.render('articles/edit', { article: result });
			}
		});
	} else res.render('login', { message: 'You must be logged In ' });
});
router.post('/edit/:id', (req, res) => {
	if (req.isAuthenticated()) {
		Article.findById(req.params.id, (err, result) => {
			if (err) {
				res.redirect('/');
			} else {
				result.title = req.body.title;
				result.description = req.body.description;
				result.save((err) => {
					if (err) {
						console.log('Unable to save after edit ');
						res.redirect(`/edit/${result.id}`);
					} else {
						console.log('Edited Successfully');
						res.redirect(`/articles/${result.id}`);
					}
				});
			}
		});
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

//delete

router.get('/delete/:id', (req, res) => {
	if (req.isAuthenticated()) {
		Article.findByIdAndDelete(req.params.id, (err, result) => {
			if (err) {
				console.log('error deleting the article ');
			} else {
				console.log('Success');
				res.redirect('/');
			}
		});
	} else {
		res.render('login', { message: 'You must be logged In ' });
	}
});

module.exports = router;
