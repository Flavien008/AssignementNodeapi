let User = require('../model/user');
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
        res.status(200).json({ message: 'Login successful', token,  user  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    User.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/



// Récupérer un User par son id (GET)
function getUser(req, res){
    let userId = req.params.id;
    User.findById(userId, (err, User) =>{
        if(err){res.send(err)}
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
    
        user.save( (err) => {
            if(err){
                res.send('cant post user ', err);
            }
            console.log({ message: `${user.name} saved!`})
            res.status(200).json(user);
        })
    } catch (error) {
      console.error(error);
      res.status(501).json(error);
    }
  }


// Update d'un User (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu User : ");
    console.log(req.body);
    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, User) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', User)
    });

}

// suppression d'un User (DELETE)
// l'id est bien le _id de mongoDB
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${User.nom} deleted`});
    })
}



module.exports = { signup , login };
