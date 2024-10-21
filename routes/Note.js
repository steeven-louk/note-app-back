const express = require("express");
const Note = require("../models/Note");
const middleware = require("../middleware/middleware");
const router = express.Router();


router.post('/add',middleware, async(req,res)=>{
    try {
        const {title, description} = await req.body;
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
        res.status(500).json({error:error, message:"Error in Adding Note"});
    }
})

module.exports = router