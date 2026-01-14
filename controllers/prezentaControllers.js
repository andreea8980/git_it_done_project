const InregistrarePrezenta = require('../models/InregistrarePrezenta');
const Eveniment = require('../models/Eveniment')
const GrupEvenimente = require('../models/GrupEvenimente');

// functie care calculeaza daca un eveniment este OPEN sau CLOSED pe baza data_start si data_final din eveniment
const eventOpenOrClosed = (eveniment) => {
    const now = new Date();
    const start = new Date(eveniment.data_start);
    const end = new Date(eveniment.data_final);

    if (now < start || now > end) {
        return "CLOSED";
    }
    return "OPEN";
}

// post - /api/prezenta - fara AUTH pentru participanti care nu au cont
const createPrezenta = async (req,res) => {
    try{
        // vom trimite codul de acces in pachet
        const { cod_acces, nume_participant, email_participant } = req.body;

        // validare input minimal
        if(!cod_acces || !nume_participant || !email_participant){
            return res.status(400).json({
                status: "failed",
                message: "cod_acces, nume_participant si email_participant sunt obligatorii"
            });
        }

        // cautam evenimentul dupa codul de acces
        const eveniment = await Eveniment.findOne({
            where: {cod_acces}
        });
        if(!eveniment){
            return res.status(404).json({
                status: "failed",
                message: "nu exista niciun eveniment pentru acest cod de acces"
            });
        }

        // verificam daca evenimentul este deschis sa nu cu ajutorul functiei de mai sus
        const stareEveniment = eventOpenOrClosed(eveniment);
        if(stareEveniment === "CLOSED"){
            return res.status(400).json({
                status: "failed",
                message: "evenimentul este inchis pentru inregistrarea prezentei"
            });
        }

        // verificam daca participantul este deja inregistrat:
        const dejaInregistrat = await InregistrarePrezenta.findOne({
            where: {
                eveniment_id: eveniment.id,
                email_participant
            }
        });

        if(dejaInregistrat){
            // nu adaugam alta inregistrare, ci o afisam pe cea deja existenta
            return res.status(200).json({
                status: "success",
                message: "participant deja inregistrat la acest eveniment",
                data: dejaInregistrat
            });
        }

        // daca nu este deja inregistrat, aici vom crea inregistrarea de prezenta:
        const nouaPrezenta = await InregistrarePrezenta.create({
            nume_participant,
            email_participant,
            eveniment_id: eveniment.id
            // timestamp-ul se va pune automat deoarece in models/InregistrarePrezenta avem defaultValue: DataTypes.NOW
        })

        res.status(201).json({
            status: "success",
            message: "prezenta inregistrata",
            data: nouaPrezenta
        });

    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la inregistrarea prezentei",
            error: err.message
        });
    }
};

// get - /api/prezenta/:id - functia afiseaza toate prezentele pt un eveniment
// actualizare - cu AUTH doar pt organizatorul autentificat
const getPrezenteEveniment = async (req,res) => {
    try{
        const id = req.params.id;
        const organizator_id = req.user.id; // din token

        // cautam evenimentul si verificam ownership-ul
        const eveniment = await Eveniment.findByPk(id, {
            include: [{
                model: GrupEvenimente,
                attributes: ['organizator_id', 'titlu']
            }]
        });

        if(!eveniment){
            return res.status(404).json({
                status: "failed",
                message: "evenimentul nu a fost gasit"
            });
        }

        // verificam ca evenimentul apartine unui grup al organizatorului
        if(eveniment.GrupEvenimente.organizator_id !== organizator_id){
            return res.status(403).json({
                status: "failed",
                message: "nu aveti permisiunea sa vizualizati prezentele pentru acest eveniment"
            });
        }
        
        const prezente = await InregistrarePrezenta.findAll({
            where: {
                eveniment_id: id
            },
            order: [['timestamp_confirmare', 'ASC']] // sortare cronologică
        });

        res.status(200).json({
            status: "success",
            eveniment: {
                id: eveniment.id,
                cod_acces: eveniment.cod_acces,
                data_start: eveniment.data_start,
                data_final: eveniment.data_final,
                stare: eventOpenOrClosed(eveniment),
                grup_titlu: eveniment.GrupEvenimente.titlu
            },
            total_prezente: prezente.length,
            data: prezente
        });
    }catch(err){
        res.status(500).json({
            status: "failed",
            message: "eroare la preluarea prezentei",
            error: err.message
        });
    }
};

module.exports = { createPrezenta, getPrezenteEveniment }