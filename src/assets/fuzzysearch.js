let listOfCoins = [];

export const presearch = () => {
  fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
    .then((response) => response.json())
    .then((data) => (listOfCoins = Object.keys(data.Data)));
};

export const fuzzySearch = (tickerName) => {
  tickerName = tickerName.toUpperCase();
  let bestOfFour = [];
  for (let coin of listOfCoins) {
    let pos = -1,
      overlapCount = 0;
    for (let symbolTicker of tickerName) {
      let tmpPos = coin.toUpperCase().indexOf(symbolTicker, pos + 1);
      if (~tmpPos) {
        pos = tmpPos;
        overlapCount++;
      }
    }
    if (overlapCount) {
      bestOfFour.push({ coin: coin, count: overlapCount });
      bestOfFour = bestOfFour.sort((a, b) => a.count < b.count).slice(0, 4);
    }
  }
  return bestOfFour;
};

export const exactSearch = (tickerName) => {
  return listOfCoins.find(
    (elem) => elem.toUpperCase() === tickerName.toUpperCase()
  );
};
