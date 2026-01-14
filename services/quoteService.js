const axios = require('axios');

const getRandomQuote = async () => {
    try {
        const response = await axios.get('https://zenquotes.io/api/random');
        const quoteData = response.data[0];
        const formattedQuote = `"${quoteData.q}" - ${quoteData.a}`;
        return formattedQuote;
    } catch (error) {
        console.error('Eroare la preluarea quote-ului:', error.message);
        
        // fallback simplu - un quote daca api nu merge
        return '"Succesul este suma micilor eforturi repetate zi de zi." - Robert Collier';
    }
};

module.exports = { getRandomQuote };