//importam dependentele necesare 
const Organizator=require('../models/Organizator'); //sa interactionam cu tabela noastra din baza de date
//biblioteca bcrypt - esentiala pentru securitate, o folosim pentru a cripta(hash) parola inainte de a o salva si pt a o compara la login
const bcrypt=require('bcrypt'); 
//JSON web token - odata ce utilizatorul se autentifica trebuie sa generam un token('o legitimatie') pe care front end ul il va folosi pentru a accesa rutele securizate 
const jwt=require('jsonwebtoken');
//citim cheia folosita de jwt pt a semna si a verifica autenticitatea token urilor
const SECRET_KEY= process.env.JWT_SECRET;


//FUNCTIA REGISTER
async function register(req, res){
    const {nume, email, parola}=req.body;
    
    try{
        const existingOrg=await Organizator.findOne({where: {email}});
        if(existingOrg){
            return res.status(409).json({message:'email ul este deja folosit'});
        }

        const hashedPassword=await bcrypt.hash(parola, 10);

        const newOrg=await Organizator.create({
            nume,
            email,
            parola_hash:hashedPassword,
        });

        res.status(201).json({message:'cont creat cu succes!', organizator:{
            id:newOrg.id, 
            nume:newOrg.nume,
            email:newOrg.email,
        }});
        }
         catch(error){
         console.error('eroare la inregistrare!', error);
         res.status(500).json({message:'eroare interna de server'});
    }
}


//FUNCTIA LOGIN
async function login(req, res){
    const {email, parola}=req.body;
    try{
        const organizator=await Organizator.findOne({where:{email}});
        if(!organizator){
            return res.status(401).json({message:'email sau parola incorecta'});
        }

        const match=await bcrypt.compare(parola, organizator.parola_hash);
        if(!match){
            return res.status(401).json({message:'email sau parola incorecta'});
        }

        const token=jwt.sign(
            {
            id:organizator.id,
            email:organizator.email
            },
            SECRET_KEY,
            {expiresIn:'1h'}
    );
    res.status(200).json({message:'autentificare reusita',token:token,
        organizator:{
            id:organizator.id,
            nume:organizator.nume,
            email:organizator.email
        } });
    }catch(error){
         console.error('eroare la autentificare!', error);
         res.status(500).json({message:'eroare interna de server'});
    }
}

// obtinem toti organizatorii
const getAll =  async (req,res) => {
    await Organizator.findAll().then(results => {
        res.json({
            status: "success",
            data: results
        });
    }).catch(error => {
        res.json({
            status: "failed",
            errors: error
        });
    });
};

// obtinem un organizator dupa id
const getOrganizatorById = async (req,res) => {
    const id = req.params.id;
    const organizator = await Organizator.findByPk(id);
    if(organizator){
        res.json({
            status: "success",
            data: organizator
        })
    }else{
        res.status(404).json({
            status: "failed",
            message: "Organizator not found"
        });
    };
}
module.exports = {register, login, getAll, getOrganizatorById};