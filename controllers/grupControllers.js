const GrupEvenimente = require('../models/GrupEvenimente')
const Organizator = require('../models/Organizator')
const Eveniment = require('../models/Eveniment') 
const { getRandomQuote } = require('../services/quoteService');
const { calculeazaDateRecurente } = require('../services/recurentaService');

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

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
// actualizare 2- implementare recurenta
const createGroup = async (req,res) => {
    try{
        let {titlu, descriere, data_start, data_final, recurenta, durata_ore} = req.body;
        const organizator_id = req.user.id; // din token
        
        // FUNCTIONALITATE NOUA - daca nu avem descriere pune una cu api de quotes
        if (!descriere || descriere.trim() === '') {
            descriere = await getRandomQuote();
        }

        // cream grupul
        const grupNou = await GrupEvenimente.create({
            titlu, 
            descriere, 
            data_start, 
            data_final,
            recurenta, 
            organizator_id
        });

        let evenimenteGenerate = [];

        // LOGICA NOUA - daca avem recurenta si intervale de date, generam automat evenimente
        if (recurenta && data_start && data_final) {
            const recurenteValide = ['saptamanal', 'bisaptamanal', 'lunar'];
            
            if (!recurenteValide.includes(recurenta)) {
                // stergem grupul creat si returnam eroare
                await grupNou.destroy();
                return res.status(400).json({
                    status: 'failed',
                    message: `recurenta trebuie sa fie una din: ${recurenteValide.join(', ')}`
                });
            }

            // validare date
            const start = new Date(data_start);
            const end = new Date(data_final);

            if (end <= start) {
                await grupNou.destroy();
                return res.status(400).json({
                    status: 'failed',
                    message: 'data_final trebuie sa fie dupa data_start'
                });
            }

            // calculam datele pentru evenimente
            const durataOreEv = durata_ore || 2;
            const dateEvenimente = calculeazaDateRecurente(start, end, recurenta, durataOreEv);

            // cream toate evenimentele
            for (const dateEv of dateEvenimente) {
                const eveniment = await Eveniment.create({
                    data_start: dateEv.data_start,
                    data_final: dateEv.data_final,
                    cod_acces: generateCode(),
                    grup_id: grupNou.id
                });
                evenimenteGenerate.push(eveniment);
            }
        }
        res.status(201).json({
            status: "success",
            message: evenimenteGenerate.length > 0 
                ? `Grup creat cu ${evenimenteGenerate.length} evenimente generate automat`
                : 'Grup creat cu succes',
            data: grupNou,
            quote_generat: !req.body.descriere || req.body.descriere.trim() === '' 
            // indica daca descrierea a fost generata automat
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