const Rendu = require('../model/rendu');

async function createRendu(req, res) {
    try {
        const renduData = req.body;
        const rendu = new Rendu(renduData);
        await rendu.save();
        res.status(201).json({ message: 'Rendu created successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getRenduById(req, res) {
    try {
        const renduId = req.params.id;
        const rendu = await Rendu.findById(renduId);
        if (!rendu) {
            return res.status(404).json({ message: "Rendu not found" });
        }
        res.json(rendu);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function updateRendu(req, res) {
    try {
        const renduId = req.params.id;
        const updatedRendu = req.body;
        const rendu = await Rendu.findByIdAndUpdate(renduId, updatedRendu, { new: true });
        if (!rendu) {
            return res.status(404).json({ message: "Rendu not found" });
        }
        res.json({ message: 'Rendu updated successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function deleteRendu(req, res) {
    try {
        const renduId = req.params.id;
        const deletedRendu = await Rendu.findByIdAndRemove(renduId);
        if (!deletedRendu) {
            return res.status(404).json({ message: "Rendu not found" });
        }
        res.json({ message: 'Rendu deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }

    
}


async function getRendus(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = req.query.filter || 'all'; // 'all', 'withNotes', 'withoutNotes'
        const idAssignment = req.query.idAssignment;
        const idEtudiant = req.query.idEtudiant;

        const matchStage = {
            $match: {},
        };

        if (idAssignment) {
            matchStage.$match.idAssignment = idAssignment;
        }

        if (idEtudiant) {
            matchStage.$match.idEtudiant = idEtudiant;
        }

        if (filter === 'withNotes') {
            matchStage.$match.note = { $exists: true, $ne: null };
        } else if (filter === 'withoutNotes') {
            matchStage.$match.note = null;
        }

        const options = {
            page: page,
            limit: limit
        };


        const aggregation = Rendu.aggregate([matchStage]);
        const rendus = await Rendu.aggregatePaginate(aggregation, options);
        console.log(rendus);
        res.json(rendus);
    } catch (error) {
        console.log('Erreur lors de la récupération des rendus :', error);
        res.status(500).send(error);
    }
}


module.exports = { createRendu, getRenduById, updateRendu, deleteRendu, getRendus };
