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

async function getMatiere(req, res) {
    Matiere.find((err, matieres) => {
        if (err) {
            res.send(err);
        }
        res.json(matieres);
    });
}

async function getMatieres(req, res) {
    try {
        let nom = req.query.nom; // Filtre par nom de matière
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regexNom = new RegExp(nom, 'i');
        const matchStage = {
            $match: {},
        };

        if (nom && regexNom !== '') {
            matchStage.$match = {
                nom: { $regex: regexNom }
            };
        }

        // Exécuter l'agrégation avec les étapes de filtrage définies
        const aggregation = Matiere.aggregate([matchStage]);
        const liste = await Matiere.aggregatePaginate(aggregation, options);
        console.log(liste);
        res.json(liste);
    } catch (error) {
        console.log('Erreur lors de la récupération des matières:', error);
        res.status(500).send(error);
    }
}


module.exports = { createMatiere, getMatiereById, updateMatiere, deleteMatiere, getMatieres, getMatiere };
