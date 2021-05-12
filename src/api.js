let listOfCoins = [];

const AGGREGATE_INDEX = "5";
const tickersHandlers = new Map();
const socketURL = new URL("wss://streamer.cryptocompare.com/v2");
const params = {
  api_key: "77a04170aff4020424d94d248d6741dffd08e6a148db2aded46d8657aabdb758",
};
Object.entries(params).forEach(([key, value]) =>
  socketURL.searchParams.set(key, value)
);
const socket = new WebSocket(socketURL);

socket.addEventListener("message", (event) => {
  const { TYPE: type, FROMSYMBOL: ticker, PRICE: newPrice } = JSON.parse(
    event.data
  );
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(ticker) ?? [];
  handlers.forEach((func) => func(newPrice));
});

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subcribeToTickerOnWebSocket(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubcribeFromTickerOnWebSocket(ticker);
};

const sendToWebSocket = (message) => {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === socket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.onopen = () => socket.send(stringifiedMessage);
};

const subcribeToTickerOnWebSocket = (ticker) => {
  const message = {
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  };
  sendToWebSocket(message);
};

const unsubcribeFromTickerOnWebSocket = (ticker) => {
  const message = {
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  };
  sendToWebSocket(message);
};

export async function presearch() {
  let response = await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=77a04170aff4020424d94d248d6741dffd08e6a148db2aded46d8657aabdb758"
  );
  let data = await response.json();
  listOfCoins = Object.keys(data.Data);
}

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
