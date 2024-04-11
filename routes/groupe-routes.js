const Group = require('../model/groupe');
let mongoose = require('mongoose');

async function getGroupes(req, res) {
    try {
        let nom = req.query.nom; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regex = new RegExp(nom, 'i');
        const matchStage = {
            $match: {
                nom: { $regex: regex } 
            }
        };

        const aggregation = Group.aggregate([matchStage ]);
        const grp = await Group.aggregatePaginate(aggregation, options);
        console.log('groupe', grp);
        res.json(grp);
    } catch (error) {
        console.log('Erreur lors de la récupération des groupes:', error);
        res.status(500).send(error);
    }
}

async function getGroupesByStudent(req, res) {
    try {
        let studentId = req.params.id;
        let nom = req.query.nom; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const options = {
            page: page,
            limit: limit
        };

        const regex = new RegExp(nom, 'i');
        const matchStage = {
            $match: {
                utilisateurs: mongoose.Types.ObjectId(studentId),
                nom: { $regex: regex } 
            }
        };

        const aggregation = Group.aggregate([matchStage ]);

        // Paginer les résultats de l'agrégation
        const result = await Group.aggregatePaginate(aggregation, options);

        res.json(result); 
    } catch (error) {
        console.log('Erreur lors de la récupération des groupes par étudiant:', error);
        res.status(500).send(error);
    }
}

// Récupérer tous les groupes (GET)
function getGroups(req, res){
    Group.find((err, groups) => {
        if(err){
            res.send(err);
        }
        res.json(groups);
    });
}

// Récupérer un groupe par son id (GET)
function getGroup(req, res){
    let groupId = req.params.id;
    Group.findById(groupId, (err, group) => {
        if(err){
            res.send(err);
        }
        res.json(group);
    });
}

// Ajout d'un groupe (POST)
function createGroup(req, res){
    let group = new Group();
    group.nom = req.body.nom;
    group.utilisateurs = req.body.utilisateurs; // Vous devrez passer une liste d'utilisateurs

    group.save((err) => {
        if(err){
            res.send(err);
        }
        res.json({ message: `${group.nom} saved!` });
    });
}

// Update d'un groupe (PUT)
function updateGroup(req, res){
    Group.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, group) => {
        if(err){
            res.send(err);
        }
        res.json({ message: 'Group updated', group });
    });
}

// Suppression d'un groupe (DELETE)
function deleteGroup(req, res){
    Group.findByIdAndRemove(req.params.id, (err, group) => {
        if(err){
            res.send(err);
        }
        res.json({ message: `${group.nom} deleted` });
    });
}

// Ajouter un utilisateur à un groupe (POST)
function addUserToGroup(req, res){
    const groupId = req.body.groupId;
    const studentIds = req.body.studentIds;

    console.log('id groupe'+groupId);
    
    Group.findById(groupId, (err, group) => {
        if(err){
            res.send(err);
            return;
        }

        if(!group){
            res.status(404).json({ message: "Group not found" });
            return;
        }

        studentIds.forEach(studentId => group.utilisateurs.push(studentId));

        group.save((err) => {
            if(err){
                res.send(err);
                return;
            }
            res.json({ message: "Users added to group successfully" });
        });
    });
}

function removeUserToGroup(req, res) {
    const groupId = req.body.groupId;
    const studentIds = req.body.studentIds;
  
    console.log('Group ID:', groupId);
  
    Group.findById(groupId, (err, group) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
  
      if (!group) {
        res.status(404).json({ message: "Group not found" });
        return;
      }
  
      // Remove students using filter
      group.utilisateurs = group.utilisateurs.filter(
        (utilisateurId) => !studentIds.includes(utilisateurId.toString())
      );
  
      group.save((err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to save group" });
          return;
        }
        res.json({ message: "Users removed from group successfully" });
      });
    });
  }
  
  

module.exports = { removeUserToGroup,getGroups, getGroup, createGroup, updateGroup, deleteGroup,addUserToGroup,getGroupes,getGroupesByStudent};
