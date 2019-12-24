const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String,
    },
    location: {
        type: String,
    },
    skills: {
        type: [String],
    },
    status: {
        type: String,
        required: true
    },
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
            },
            location: {
                type: String                
            },
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            location: {
                type: String                
            },
        }
    ],
    social: [
        {
            youtube: {
                type: String
            },
            facebook: {
                type: String
            }
        }
    ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);