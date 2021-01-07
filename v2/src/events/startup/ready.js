//================================================
//For the terminal visualization of command status
//================================================
const tableConfig = require("../../utils/tableConfig.js");
const db = require("../../database/database");
const { createStream, table } = require("table");
const { commandStatus } = require("../../tenshi");

module.exports = {
  run: async (client) => {
    console.log("commandStatus:", commandStatus);
    let stream = createStream(tableConfig);
    let i = 0;
    let fn = setInterval(() => {
      if (i === commandStatus.length) clearInterval(fn);
      else {
        stream.write(commandStatus[i]);
        i++;
      }
    }, 200);
    console.log("Tenshi has descended from the heavens and has logged in.");
    db.then(() => console.log("Connected to mongo.")).catch((error) =>
      console.error(error)
    );
  },
  description: "For the terminal visualization of command status"
};
