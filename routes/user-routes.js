let User = require('../model/user');
const bcrypt = require('bcrypt');

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

async function signup(req, res, next) {
    try {
        const hash = await bcrypt.hash(req.body.password, 10); // Use a higher salt rounds value, e.g., 10
        req.body.password = hash;
        let user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.role = req.body.role;
        user.photo = req.body.photo;

        if (req.body.role == null) req.body.role = 'student';
  
        console.log("POST User reçu :");
        console.log(user)
    
        user.save( (err) => {
            if(err){
                res.send('cant post user ', err);
            }
            console.log({ message: `${user.nom} saved!`})
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
function deleteAssignment(req, res) {

    User.findByIdAndRemove(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${User.nom} deleted`});
    })
}



module.exports = { signup };
