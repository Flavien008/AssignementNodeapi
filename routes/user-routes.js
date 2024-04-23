let User = require('../model/user');
const Groupe = require('../model/groupe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
        // Exclure le champ 'password' de l'objet 'user' renvoyé dans la réponse
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Récupérer un User par son id (GET)
function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, User) => {
        if (err) { res.send(err) }
        res.json(User);
    })

    /*
    User.findOne({id: userId}, (err, User) =>{
        if(err){res.send(err)}
        res.json(User);
    })
    */
}

async function signup(req, res) {
    try {
        const hash = await bcrypt.hash(req.body.password, 10); // Use a higher salt rounds value, e.g., 10
        req.body.password = hash;
        let user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.role = req.body.role;
        user.matricule = req.body.matricule;

        if (req.body.role == null) req.body.role = 'student';

        console.log("POST User reçu :");
        console.log(user)

        user.save((err) => {
            if (err) {
                res.send('cant post user ', err);
            }
            console.log({ message: `${user.name} saved!` })
            res.status(200).json(user);
        })
    } catch (error) {
        console.error(error);
        res.status(501).json(error);
    }
}


async function getStudents(req, res) {
    try {
        let filtre = req.query.filtre;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regexFiltre = new RegExp(filtre, 'i');
        const matchStage = {
            $match: {
                role: { $ne: null, $eq: "student" }
            }
        };

        if (filtre && regexFiltre !== '') {
            matchStage.$match = {
                $or: [
                    { username: { $regex: regexFiltre } },
                    { name: { $regex: regexFiltre } },
                ],
            };
        }


        const aggregation = User.aggregate([matchStage]);
        const liste = await User.aggregatePaginate(aggregation, options);
        console.log(liste);
        res.json(liste);
    } catch (error) {
        console.log('Erreur lors de la récupération des édtudiants:', error);
        res.status(500).send(error);
    }
}

async function getProfs(req, res) {
    try {
        let filtre = req.query.filtre;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regexFiltre = new RegExp(filtre, 'i');
        const matchStage = {
            $match: {
                role: { $ne: null, $eq: "prof" }
            }
        };

        if (filtre && regexFiltre !== '') {
            matchStage.$match = {
                $or: [
                    { username: { $regex: regexFiltre } },
                    { name: { $regex: regexFiltre } },
                ],
            };
        }


        const aggregation = User.aggregate([matchStage]);
        const liste = await User.aggregatePaginate(aggregation, options);
        console.log(liste);
        res.json(liste);
    } catch (error) {
        console.log('Erreur lors de la récupération des profs:', error);
        res.status(500).send(error);
    }
}

async function getAllProfs(req, res) {
    try {
        const matchStage = {
            $match: {
                role: "prof"
            }
        };

        const aggregation = await User.aggregate([matchStage]);
        console.log(aggregation);
        res.json(aggregation);
    } catch (error) {
        console.log('Erreur lors de la récupération des profs:', error);
        res.status(500).send(error);
    }
}


async function getAssignment(req, res) {
    try {
        const assignment = await Assignment.filtre(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getStudentsNotInGroup(req, res) {
    try {
        const groupId = req.query.idgroupe;
        console.log("groupe id" + groupId);
        let filtre = req.query.filtre;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regexFiltre = new RegExp(filtre, 'i');
        const matchStage = {
            $match: {
                role: { $ne: null, $eq: "student" },
                _id: { $nin: groupId ? (await Groupe.findById(groupId)).utilisateurs : [] }
            }
        };

        if (filtre && regexFiltre !== '') {
            matchStage.$match.$or = [
                { username: { $regex: regexFiltre } },
                { name: { $regex: regexFiltre } },
            ];
        }

        const aggregation = User.aggregate([matchStage]);
        const studentsNotInGroup = await User.aggregatePaginate(aggregation, options);

        res.json(studentsNotInGroup);
    } catch (error) {
        console.log('Erreur lors de la récupération des étudiants non dans le groupe:', error);
        res.status(500).send(error);
    }
}

async function getStudentsInGroup(req, res) {
    try {
        const groupId = req.query.idgroupe;
        console.log("groupe id" + groupId);
        let filtre = req.query.filtre;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = {
            page: page,
            limit: limit
        };

        const regexFiltre = new RegExp(filtre, 'i');
        const matchStage = {
            $match: {
                role: { $ne: null, $eq: "student" },
                _id: { $in: groupId ? (await Groupe.findById(groupId)).utilisateurs : [] }
            }
        };

        if (filtre && regexFiltre !== '') {
            matchStage.$match.$or = [
                { username: { $regex: regexFiltre } },
                { name: { $regex: regexFiltre } },
            ];
        }

        const aggregation = User.aggregate([matchStage]);
        const studentsNotInGroup = await User.aggregatePaginate(aggregation, options);

        res.json(studentsNotInGroup);
    } catch (error) {
        console.log('Erreur lors de la récupération des étudiants non dans le groupe:', error);
        res.status(500).send(error);
    }
}


module.exports = { signup, login, getStudents, getStudentsNotInGroup, getStudentsInGroup, getProfs, getAllProfs};
