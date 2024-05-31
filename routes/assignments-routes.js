let Assignment = require('../model/assignment');
let mongoose = require('mongoose');
const moment = require('moment');
const Matiere = require('../model/matiere');
let User = require('../model/user');


async function getAssignments(req, res) {
    try {
        let titre = req.query.titre; 
        let matiere = req.query.matiere; 
        let groupe = req.query.groupe; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortField || 'dateCreation'; // Field to sort by, default is 'dateCreation'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Sort order, default is descending

        const options = {
            page: page,
            limit: limit
        };

        const regexTitre = new RegExp(titre, 'i');
        const regexMatiere = new RegExp(matiere, 'i');
        const matchStage = {
            $match: {},
          };
          
        if (titre && titre !== '') {
            matchStage.$match = {
                $or: [
                    { titre: { $regex: regexTitre } },
                    { description: { $regex: regexTitre } },
                    { matiere: { $regex: regexTitre } }
                ],
            };
        }
        
        if (matiere && matiere !== '') {
            if (!matchStage.$match) {
                matchStage.$match = {};
            }
            if (!matchStage.$match.$and) {
                matchStage.$match.$and = [];
            }
            matchStage.$match.$and.push({ matiere: { $regex: regexMatiere } });
        }
        
        if (groupe && groupe !== '') {
            if (!matchStage.$match) {
                matchStage.$match = {};
            }
            if (!matchStage.$match.$and) {
                matchStage.$match.$and = [];
            }
            matchStage.$match.$and.push({ "groupe.idGroupe": groupe });
        }
        
        const sortStage = {
            $sort: { [sortField]: sortOrder } 
        };

        console.log('trieee'+sortStage);

        const aggregation = [
            matchStage,
            sortStage,
            {
                $lookup: {
                    from: 'matieres', // Nom de la collection des matières
                    localField: 'matiere',
                    foreignField: 'nom',
                    as: 'matiereDetails'
                }
            },
            {
                $unwind: {
                    path: '$matiereDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    'matierePhoto': '$matiereDetails.photo'
                }
            },
            {
                $project: {
                    'matiereDetails': 0 
                }
            }
        ];

        const liste = await Assignment.aggregatePaginate(Assignment.aggregate(aggregation), options);
        // console.log(liste);
        res.json(liste);
    } catch (error) {
        console.log('Erreur lors de la récupération des groupes:', error);
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

async function getPercentageAssignmentsBySubject(req, res) {
    try {
        // Utilisation de l'agrégation MongoDB pour compter le nombre d'Assignments par matière
        const assignmentsBySubject = await Assignment.aggregate([
            {
                $match: {
                    matiere: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$matiere',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calcul du total des Assignments
        const totalAssignments = assignmentsBySubject.reduce((total, subject) => total + subject.count, 0);

        // Calcul du pourcentage d'Assignments par matière
        const percentageAssignmentsBySubject = assignmentsBySubject.map(subject => ({
            matiere: subject._id,
            pourcentage: (subject.count / totalAssignments) * 100
        }));

        res.json(percentageAssignmentsBySubject);
    } catch (error) {
        console.error("Erreur lors de la récupération du pourcentage d'Assignments par matière", error);
        res.status(500).json({ error: "Une erreur est survenue lors du traitement de la requête" });
    }
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    try {
        const assignmentData = req.body;
        // Ajout de la date de création
        assignmentData.dateCreation = Date.now();
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
        const assignmentId = req.body._id;
        const updatedAssignment = req.body;
        const assignment = await Assignment.findByIdAndUpdate(assignmentId, updatedAssignment, { new: true });
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found on update" });
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
        assignment.rendu.push(rendus);
        await assignment.save();
        res.json({ message: 'Rendus added successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}


async function getAssignmentCountBetweenDates(req, res) {
    try {
        const startDate = moment.utc(req.query.date1, 'YYYY-MM-DD').startOf('day').toDate();
        const endDate = moment.utc(req.query.date2, 'YYYY-MM-DD').endOf('day').toDate();

        console.log("startdate: ", startDate);
        console.log("endDate: ", endDate);

        const assignmentCounts = await Assignment.aggregate([
            {
                $match: {
                    dateCreation: {
                        $gte: startDate,
                        $lte: endDate,
                        $exists: true // Vérifier l'existence du champ dateCreation
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%d-%m-%Y",
                            date: "$dateCreation"
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(assignmentCounts);
    } catch (error) {
        console.error("Error fetching assignment count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

  

// Mettre à jour la note et la remarque pour un rendu (PUT)
async function updateRendu(req, res) {
    try {
        const assignmentId = req.params.assignmentId;
        const renduId = req.params.renduId;
        const { note, remarque } = req.body;       
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const renduToUpdate = assignment.rendu.id(renduId);
        if (!renduToUpdate) {
            return res.status(404).json({ message: "Rendu not found" });
        }

        renduToUpdate.note = note;
        renduToUpdate.remarque = remarque;

        await assignment.save();

        res.json({ message: 'Rendu updated successfully' });
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
        assignment.groupe.push(groupes);
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

async function updateAssignementsMatiere(req, res) {
    try {
        // Obtenez tous les assignements
        const assignments = await Assignment.find();

        var i = 0
        for(let assignment of assignments) {

            console.log("ato");
            // Obtenez une matière aléatoire
            const randomMatiere = await Matiere.aggregate([{ $sample: { size: 1 } }]);

            console.log("matiere"+randomMatiere[0].nom);

                // Mettez à jour l'assignement avec le nom de matière aléatoire
                assignment.matiere = randomMatiere[0].nom;
                console.log(i);
                i+=1
                await assignment.save();
        }

        res.json({ message: 'Assignments updated successfully'+i });
    } catch (error) {
        console.error("Error updating assignments:", error);
        res.status(500).send(error);
    }
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


async function updateAssignementsDate(req, res) {
    try {
        // Obtenez tous les assignements
        const assignments = await Assignment.find();

        var i = 0;
        for (let assignment of assignments) {
            // Obtenez une date aléatoire pour dateCreation
            const randomDateCreation = getRandomDate(new Date("2024-01-01"), new Date("2024-05-28"));
            console.log("dateCreation: " + randomDateCreation);

            // Obtenez une date aléatoire pour dateLimite après la date de création
            const randomDateLimite = getRandomDate(randomDateCreation, new Date("2024-12-31"));
            console.log("dateLimite: " + randomDateLimite);

            // Mettez à jour l'assignement avec les dates aléatoires
            assignment.dateCreation = randomDateCreation;
            assignment.dateLimite = randomDateLimite;
            console.log(i);
            i += 1;
            await assignment.save();
        }

        res.json({ message: 'Assignments updated successfully' + i });
    } catch (error) {
        console.error("Error updating assignments:", error);
        res.status(500).send(error);
    }
}


async function updateUsernamesWithEmails(req, res) {
    try {
        // Liste des emails à assigner
        const emails = ["dofaway973@crodity.com", "xonomeg143@jzexport.com", "heyoy73276@acuxi.com"];
        
        // Obtenez tous les utilisateurs
        const users = await User.find();
        
        // Mélanger les emails pour les assigner aléatoirement
        const shuffledEmails = emails.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < users.length; i++) {
            // Assigner un email aléatoire à chaque utilisateur
            users[i].username = shuffledEmails[i % shuffledEmails.length];
            await users[i].save();
        }

        res.json({ message: 'Usernames updated successfully' });
    } catch (error) {
        console.error("Error updating usernames:", error);
        res.status(500).send(error);
    }
}



module.exports = { updateUsernamesWithEmails,updateAssignementsDate,updateAssignementsMatiere,getAssignmentCountBetweenDates,getPercentageAssignmentsBySubject,getAssignments, postAssignment, getAssignment, updateAssignment, addRendus, addGroupes, deleteAssignment,getAssignmentsByGroupId,updateRendu };
