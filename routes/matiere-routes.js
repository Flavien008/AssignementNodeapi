    let Matiere = require('../model/matiere');


    function getMatieres(req, res){
        Matiere.find((err, matiere) => {
            if(err){
                res.send(err)
            }
    
            res.send(matiere);
        });
    }

    function saveMatiere(req, res){
        let matiere = new Matiere();
        matiere.nom = req.body.nom;
    
        console.log("POST matiere reçu :");
        console.log(matiere)
    
        matiere.save( (err) => {
            if(err){
                res.send('cant post matiere ', err);
            }
            res.json({ message: `${matiere.nom} saved!`})
        })
    }
    

    module.exports = { getMatieres,saveMatiere };

