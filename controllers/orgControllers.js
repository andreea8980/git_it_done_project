//importam dependentele necesare 
const Organizator=require('../models/Organizator'); //sa interactionam cu tabela noastra din baza de date
//biblioteca bcrypt - esentiala pentru securitate, o folosim pentru a cripta(hash) parola inainte de a o salva si pt a o compara la login
const bcrypt=require('bcrypt'); 
//JSON web token - odata ce utilizatorul se autentifica trebuie sa generam un token('o legitimatie') pe care front end ul il va folosi pentru a accesa rutele securizate 
const jwt=require('jsonwebtoken');
//citim cheia folosita de jwt pt a semna si a verifica autenticitatea token urilor
const SECRET_KEY= process.env.JWT_SECRET || "secret_test";


//FUNCTIA REGISTER
// actualizare - adaugam validari suplimentare si gestionare erori
async function register(req, res){
    const {nume, email, parola}=req.body;

    // VALIDARE INPUT
    if(!nume || !email || !parola){
        return res.status(400).json({
            status: 'failed',
            message: 'nume, email si parola sunt obligatorii'
        });
    }

    if(parola.length < 6){
        return res.status(400).json({
            status: 'failed',
            message: 'parola trebuie sa aiba minim 6 caractere'
        });
    }
    
    try{
        const existingOrg=await Organizator.findOne({where: {email}});
        if(existingOrg){
            return res.status(409).json({
                status: 'failed',
                message:'email ul este deja folosit'
            });
        }

        const hashedPassword=await bcrypt.hash(parola, 10);

        const newOrg=await Organizator.create({
            nume,
            email,
            parola_hash:hashedPassword,
        });

        res.status(201).json({
            status: 'success', 
            message:'cont creat cu succes!', 
            organizator:{
                id:newOrg.id, 
                nume:newOrg.nume,
                email:newOrg.email,
            }
        });
    }catch(error){
         console.error('eroare la inregistrare!', error);
         res.status(500).json({
            staus: 'failed',
            message:'eroare interna de server'
        });
    }
}


//FUNCTIA LOGIN
async function login(req, res){
    const {email, parola}=req.body;

    // VALIDARE INPUT
    if(!email || !parola){
        return res.status(400).json({
            status: 'failed',
            message: 'email si parola sunt obligatorii'
        });
    }

    try{
        const organizator=await Organizator.findOne({where:{email}});
        if(!organizator){
            return res.status(401).json({
                status: 'failed',
                message:'email sau parola incorecta'
            });
        }

        const match=await bcrypt.compare(parola, organizator.parola_hash);
        if(!match){
            return res.status(401).json({
                status: 'failed',
                message:'email sau parola incorecta'
            });
        }

        const token=jwt.sign(
            {
            id:organizator.id,
            email:organizator.email
            },
            SECRET_KEY,
            {expiresIn:'1h'}
        );
        res.status(200).json({
            status: 'success',
            message:'autentificare reusita',token:token,
            organizator:{
                id:organizator.id,
                nume:organizator.nume,
                email:organizator.email
        } });
    }catch(error){
         console.error('eroare la autentificare!', error);
         res.status(500).json({
            status: 'failed',
            message:'eroare interna de server'
        });
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
            message: "eroare la preluarea organizatorilor",
            errors: error
        });
    });
};

// obtinem un organizator dupa id
const getOrganizatorById = async (req,res) => {
    try {
        const id = req.params.id;
        const organizator = await Organizator.findByPk(id);
        
        if(!organizator){
            return res.status(404).json({
                status: "failed",
                message: "organizatorul nu a fost gasit"
            });
        }
        
        res.json({
            status: "success",
            data: organizator
        });
    } catch(error) {
        res.status(500).json({
            status: "failed",
            message: "eroare la cautarea organizatorului",
            error: error.message
        });
    }
}
module.exports = {register, login, getAll, getOrganizatorById};