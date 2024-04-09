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

module.exports = { createRendu, getRenduById, updateRendu, deleteRendu };
