const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String
	}
});

const Article = mongoose.model('Article', schema);

module.exports = Article;
