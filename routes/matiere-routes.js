const Matiere = require('../model/matiere');

async function createMatiere(req, res) {
    try {
        const matiereData = req.body;
        const matiere = new Matiere(matiereData);
        await matiere.save();
        res.status(201).json({ message: 'Matiere created successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getMatiereById(req, res) {
    try {
        const matiereId = req.params.id;
        const matiere = await Matiere.findById(matiereId);
        if (!matiere) {
            return res.status(404).json({ message: "Matiere not found" });
        }
        res.json(matiere);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function updateMatiere(req, res) {
    try {
        const matiereId = req.body._id;
        const updatedMatiere = req.body;
        const matiere = await Matiere.findByIdAndUpdate(matiereId, updatedMatiere, { new: true });
        if (!matiere) {
            return res.status(404).json({ message: "Matiere not found" });
        }
        res.json({ message: 'Matiere updated successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function deleteMatiere(req, res) {
    try {
        const matiereId = req.params.id;
        const deletedMatiere = await Matiere.findByIdAndRemove(matiereId);
        if (!deletedMatiere) {
            return res.status(404).json({ message: "Matiere not found" });
        }
        res.json({ message: 'Matiere deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getMatieres(req, res) {
    try {
        const matieres = await Matiere.find();
        res.json(matieres);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { createMatiere, getMatiereById, updateMatiere, deleteMatiere, getMatieres };
