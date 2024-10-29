const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/validation");
const Note = require("../models/notesSchems");


router.post("/create", async (req, res) => {
    try {
        const { semesters } = req.body;
        const notes = await Note.create({
            semesters
        });
        return res.status(201).json(notes);
    } catch (error) {
        return res.status(400).json(error);
    }
})


router.get("/read", authenticate, async (req, res) => {
    try {
        const notes = await Note.find();
        if (notes.length === 0) {
            return res.status(400).json({ message: "No records available" })
        }
        res.status(200).json(notes);
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/addNotes/:id", async (req, res) => {
    const { subName, link } = req.body;
    const semId = req.params.id;

    try {
        const notes = await Note.findOne();
        if (!notes) {
            return res.status(404).json({ message: "No notes found" });
        }

        const semester = notes.semesters.find(sem => sem._id.toString() === semId);
        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        const newSubject = { subName, link };
        semester.details.push(newSubject);

       
        await notes.save();

        
        return res.status(201).json(newSubject); 
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "An error occurred while adding the subject", error: error.message });
    }
});


router.put("/update/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;
        const { subName, link } = req.body;
        const updatedNote = await Note.updateOne(
            { "semesters.details._id": subjectId },
            {
                $set: {
                    "semesters.$[sem].details.$[sub].subName": subName,
                    "semesters.$[sem].details.$[sub].link": link
                }
            },
            {
                arrayFilters: [
                    { "sem.details._id": subjectId },
                    { "sub._id": subjectId }
                ]
            }
        );
        if (updatedNote.nModified === 0) {
            return res.status(404).json({ message: "Subject not found or no changes made." });
        }
        const updatedNoteData = await Note.findOne({ "semesters.details._id": subjectId });
        return res.status(200).json(updatedNoteData);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


module.exports = router;