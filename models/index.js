var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = Schema({
    google: {
        name: String,
        id: String,
        token: String,
        email: String
    },
    polls: [{ type : ObjectId, ref: 'Poll' }]
});

var pollSchema = Schema({
    title: String,
    options: [String],
    votes: [Number],
    totalVotes: {
        type: Number,
        default: 0
    }
});

var User = mongoose.model('User', userSchema);
var Poll = mongoose.model('Poll', pollSchema);

module.exports = {
    User: User,
    Poll: Poll
};