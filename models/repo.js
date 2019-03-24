const mongoose = require("mongoose")

var repoSchema = mongoose.Schema({
	/*all schema details go here*/
	_id: mongoose.Schema.Types.ObjectId,
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	repoUrl: {
		type: String,
		default: "",
	},
	repoName: {
		type: String,
		default: ""
    },
    dirTree: {
        type: Object,
        default: {}
    }
})

module.exports = RepoModel = mongoose.model("Repo",repoSchema)