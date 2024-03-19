let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const assignments = await Assignment.paginate({}, { page, limit });
        res.json(assignments);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res) {
    try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    try {
        const assignmentData = req.body;
        const assignment = new Assignment(assignmentData);
        await assignment.save();
        res.status(201).json({ message: `${assignment.titre} saved!` });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    try {
        const assignmentId = req.params.id;
        const updatedAssignment = req.body;
        const assignment = await Assignment.findByIdAndUpdate(assignmentId, updatedAssignment, { new: true });
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json({ message: 'updated' });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Ajout d'un ou plusieurs rendus à un assignment (POST)
async function addRendus(req, res) {
    try {
        const assignmentId = req.params.id;
        const rendus = req.body.rendu;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        assignment.rendu.push(...rendus);
        await assignment.save();
        res.json({ message: 'Rendus added successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Ajout d'un ou plusieurs groupes à un assignment (POST)
async function addGroupes(req, res) {
    try {
        const assignmentId = req.params.id;
        const groupes = req.body.groupe;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        assignment.groupe.push(...groupes);
        await assignment.save();
        res.json({ message: 'Groupes added successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

// suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    try {
        const assignmentId = req.params.id;
        const deletedAssignment = await Assignment.findByIdAndRemove(assignmentId);
        if (!deletedAssignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json({ message: `${deletedAssignment.titre} deleted` });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Obtenir les assignments par l'ID d'un groupe (GET)
async function getAssignmentsByGroupId(req, res) {
    try {
        const groupId = req.params.id;
        const assignments = await Assignment.find({ 'groupe.idGroupe': groupId });
        res.json(assignments);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, addRendus, addGroupes, deleteAssignment,getAssignmentsByGroupId };
