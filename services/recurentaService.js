const calculeazaDateRecurente = (dataStart, dataFinal, recurenta, durataOre = 2) => {
  const evenimente = [];
  let currentDate = new Date(dataStart);
  const endBoundary = new Date(dataFinal);
  let counter = 1;

  let incrementZile;
  switch (recurenta) {
    case 'saptamanal':
      incrementZile = 7;
      break;
    case 'bisaptamanal':
      incrementZile = 14;
      break;
    case 'lunar':
      incrementZile = 30;
      break;
    default:
      throw new Error('Recurență invalidă. Valori permise: saptamanal, bisaptamanal, lunar');
  }

  while (currentDate <= endBoundary) {
    const evStart = new Date(currentDate);
    const evFinal = new Date(currentDate);
    evFinal.setHours(evFinal.getHours() + durataOre);

    evenimente.push({
      data_start: evStart.toISOString(),
      data_final: evFinal.toISOString(),
      numar: counter
    });

    if (recurenta === 'lunar') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + incrementZile);
    }

    counter++;
  }

  return evenimente;
};

module.exports = { calculeazaDateRecurente };