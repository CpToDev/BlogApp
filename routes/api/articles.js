const express = require('express');
const router = express.Router();

//model
const Article = require('../../model/Article');

/////////////////// ALL Article ///////////////////////////////

// get

router.get('/', (req, res) => {
	Article.find((err, result) => {
		if (err) {
			res.json({
				message: err
			});
		} else {
			res.json(result);
		}
	});
});
//post

router.post('/', (req, res) => {
	const newArticle = new Article({
		title: req.body.title,
		description: req.body.description
	});

	newArticle.save((err, result) => {
		if (err) {
			res.status(500).json({
				message: err
			});
		} else {
			res.status(200).json({
				message: 'Success'
			});
		}
	});
});

router.delete('/', (req, res) => {
	Article.deleteMany((err) => {
		if (err) {
			res.status(500).json({
				message: err
			});
		} else {
			res.status(200).json({
				message: 'Success'
			});
		}
	});
});

///////////////////////// Individual Article /////////////////////////////////

router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, result) => {
		if (err) {
			res.status(404).json({
				message: 'Unable to find'
			});
		} else {
			res.status(200).json(result);
		}
	});
});

router.put('/:id', (req, res) => {
	Article.updateOne(
		{ _id: req.params.id },
		{ title: req.body.title, description: req.body.description },
		(err, result) => {
			if (err) {
				res.status(500).json({
					message: 'Unable to update'
				});
			} else {
				res.status(200).json({
					message: 'Success'
				});
			}
		}
	);
});

router.delete('/:id', (req, res) => {
	Article.findByIdAndDelete(req.params.id, (err, result) => {
		if (err) {
			res.status(500).json({
				message: 'Unable to delete'
			});
		} else {
			res.status(200).json({ message: 'Success' });
		}
	});
});
module.exports = router;
