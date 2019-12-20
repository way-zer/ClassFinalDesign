const Etherport = require("etherport");
const Firmata = require("firmata-io")(null);
const {data} = require("./data")

require("./web")

console.log("Firmata listen on 8089")
const board = new Firmata(new Etherport(8089));
board.on("ready", () => {
    // Arduino is ready to communicate
});
