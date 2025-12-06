const GrupEvenimente = require('../models/GrupEvenimente')
const Organizator = require('../models/Organizator')

// get - /api/grupuri - obtinem toate grupurile
const getAllGroups = async (req,res) => {
    try{
        const grupuri = await GrupEvenimente.findAll();
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
const getGroupById = async (req,res) => {
    try{
        id = req.params.id;
        const grup = await GrupEvenimente.findByPk(id);
        
        if(!grup){
            return res.status(404).json({
                status: "failed",
                message: "grupul nu a fost gasit"
            });
        }

        res.status(200).json({
            status: "succes",
            data: grup
        })
    }catch(err){
        res.status(500).json({
            status: "error",
            message: "eroare la cautarea grupului",
            error: err.message
        });
    }
};


// post - /api/grupuri
const createGroup = async (req,res) => {
    try{
        const {titlu, descriere, data_start, data_final, recurenta, organizator_id} = req.body;
        const organizator = await Organizator.findByPk(organizator_id);
        if(!organizator){
            return res.status(404).json({
                status: "failed",
                message: "organizator inexistent"
            });
        }
        const grupNou = await GrupEvenimente.create(
            {titlu, descriere, data_start, data_final,recurenta, organizator_id}
        );
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
const updateGroup = async (req,res) => {
    try{
        id= req.params.id;
        const grup = await GrupEvenimente.findByPk(id);
        if(!grup){
            return res.status(404).json({
                status: "failed",
                message: "grupul nu exista"
            });
        }

        await grup.update(req.body);
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
const deleteGroup = async (req,res) => {

};

module.exports = {getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup};