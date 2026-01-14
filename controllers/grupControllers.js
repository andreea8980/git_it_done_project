const GrupEvenimente = require('../models/GrupEvenimente')
const Organizator = require('../models/Organizator')

// get - /api/grupuri 
// actualizare - DOAR grupurile organizatorului autentificat
const getAllGroups = async (req,res) => {
    try{
        const organizator_id = req.user.id; // din token
        const grupuri = await GrupEvenimente.findAll({
            where: { organizator_id }
        });
        res.status(200).json({
            status: "success",
            data: grupuri
        });
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la preluarea grupurilor",
            error: err.message
        });
    }
};

// get - /api/grupuri/:id
// actualizare - verificam ca grupul apartine organizatorului autentificat
const getGroupById = async (req,res) => {
    try{
        const id = req.params.id;
        const organizator_id = req.user.id; // din token
        
        const grup = await GrupEvenimente.findOne({
            where: { 
                id,
                organizator_id // verificam ca grupul apartine user-ului
            }
        });
        
        if(!grup){
            return res.status(404).json({
                status: "failed",
                message: "grupul nu a fost gasit sau nu aveti permisiunea sa il accesati"
            });
        }

        res.status(200).json({
            status: "success",
            data: grup
        })
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la cautarea grupului",
            error: err.message
        });
    }
};


// post - /api/grupuri
// actualizare - luam organizator_id DIN TOKEN nu din body
const createGroup = async (req,res) => {
    try{
        const {titlu, descriere, data_start, data_final, recurenta} = req.body;
        const organizator_id = req.user.id; // din token
        
        // nu mai verificam organizatorul - stim sigur ca exista (e autentificat)
        const grupNou = await GrupEvenimente.create({
            titlu, 
            descriere, 
            data_start, 
            data_final,
            recurenta, 
            organizator_id
        });

        res.status(201).json({
            status: "success",
            data: grupNou
        });
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la crearea grupului",
            error: err.message
        });
    }
};

// put - /api/grupuri/:id
// verificam ca grupul apartine organizatorului autentificat
const updateGroup = async (req,res) => {
    try{
        const id= req.params.id;
        const organizator_id = req.user.id; // din token
        const grup = await GrupEvenimente.findOne({
            where: { 
                id,
                organizator_id // verificam ca grupul apartine user-ului
            }
        });
        if(!grup){
            return res.status(404).json({
                status: "failed",
                message: "grupul nu exista sau nu aveti permisiunea de a-l modifica"
            });
        }
        const { titlu, descriere, data_start, data_final, recurenta } = req.body;

        await grup.update({
            titlu: titlu ?? grup.titlu,
            descriere: descriere ?? grup.descriere,
            data_start: data_start ?? grup.data_start,
            data_final: data_final ?? grup.data_final,
            recurenta: recurenta ?? grup.recurenta,
            // nu se pot modifica id si organizator_id - nu ar avea sens
        });

        res.status(200).json({
            status: "sucess",
            data: grup
        });
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la actualizarea grupului",
            error: err.message
        });
    }
};

// delete - /api/grupuri/:id
// actualizare - verificam ca grupul apartine organizatorului autentificat
const deleteGroup = async (req,res) => {
    try{
        const id = req.params.id;
        const organizator_id = req.user.id; // din token
        const grup = await GrupEvenimente.findOne({
            where: { 
                id,
                organizator_id // verificam ca grupul apartine user-ului
            }
        });
        if(!grup){
            return res.status(404).json({
                status: "failed",
                message: "grupul nu exista sau nu aveti permisiunea de a-l sterge"
            });
        }

        await grup.destroy();
        res.status(200).json({
            status: "success",
            message: "grup sters cu succes"
        });
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la stergerea grupului",
            error: err.message
        });
    }
};

module.exports = {getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup};