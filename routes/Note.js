const express = require("express");
const Note = require("../models/Note");
const middleware = require("../middleware/middleware");
const router = express.Router();


router.post('/add', middleware, async (req, res) => {
    try {
        const { title, description } = await req.body;
        
        // Vérification que les champs nécessaires sont présents
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }
        const newNote = new Note({
            title,
            description,
            userId: req.user.id
        });

        // Sauvegarde de la note dans la base de données
        const savedNote = await newNote.save();

        // Réponse avec succès
        return res.status(201).json({
            success: true,
            note: savedNote,
            message: "Note Created Successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error, message: "Error in Adding Note" });
    }
})


router.get('/getAll', middleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await Note.find({ userId });

        // Vérifier si des notes ont été trouvées
        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found for this user" });
        }

        // Retourner les notes de l'utilisateur
        return res.status(200).json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ error: error, message: "Error Fetching Note" })
    }
})

router.delete('/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id;

        const notes = await Note.findById(id, {
            userId
        });

        if (!notes) {
            return res.status(404).json({ message: "note not found" });
        }

        const deleteNote = await Note.findOneAndDelete(notes);
        return res.status(200).json({ success: true, deleteNote });

    } catch (error) {
        res.status(500).json({ error: error, message: "Error Fetching Note" })
    }
})

router.put("/:id", middleware, async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    const { title, description } = await req.body
    const notes = await Note.findById(id, {
        userId
    });

    const updatedNote = await Note.findOneAndUpdate(notes,
        {
            title,
            description,
         }, { new: true });

    return res.status(200).json({ updatedNote })
})
module.exports = router