const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
    semesters: [
        {
            sem: {
                type: String,
                required: true
            },
            details: [{
                subName: {
                    type: String,
                    required: true
                },
                link: {
                    type: String,
                    required: true
                }
            }]
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model("notes", notesSchema);
