const Group = require('../model/groupe');

async function getGroupes(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const grp = await Group.aggregatePaginate({}, { page, limit });
        console.log('groupe', grp);
        res.json(grp);
    } catch (error) {
        console.log('Erreur lors de la récupération des groupes:', error);
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
function postGroup(req, res){
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
    const groupId = req.params.groupId;
    const userId = req.body.userId;

    Group.findById(groupId, (err, group) => {
        if(err){
            res.send(err);
            return;
        }

        if(!group){
            res.status(404).json({ message: "Group not found" });
            return;
        }

        group.utilisateurs.push(userId);

        group.save((err) => {
            if(err){
                res.send(err);
                return;
            }
            res.json({ message: "User added to group successfully" });
        });
    });
}

module.exports = { getGroups, getGroup, postGroup, updateGroup, deleteGroup,addUserToGroup,getGroupes};
