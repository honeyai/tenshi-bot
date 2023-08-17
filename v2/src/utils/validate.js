module.exports.checkModule = (cmdName, cmdModule) => {
  if (!cmdModule.hasOwnProperty("run"))
    throw new Error(`${cmdName} doesn't have the run property.`);
  if (!cmdModule.hasOwnProperty("alias"))
    throw new Error(`${cmdName} doesn't have the alias property.`);
  if (!cmdModule.hasOwnProperty(`description`))
    throw new Error(`${cmdName} doesn't have the description property.`);
  return true;
};

module.exports.checkProp = (cmdName, cmdModule) => {
  if (typeof cmdModule.run !== "function")
    throw new Error(`${cmdName}.run is not a function.`);
  if (!Array.isArray(cmdModule.alias))
    throw new Error(`${cmdName}.description is not an array.`);
  if (typeof cmdModule.description !== "string")
    throw new Error(`${cmdName}.alias is not an string.`);
  return true;
};

module.exports.checkEventModule = (eventName, eventModule) => {
  if (!eventModule.hasOwnProperty("run"))
    throw new Error(`${eventName} doesn't have the run property.`);
  if (!eventModule.hasOwnProperty(`description`))
    throw new Error(`${eventName} doesn't have the description property.`);
  return true;
};

module.exports.checkEventProp = (eventName, eventModule) => {
  if (typeof eventModule.run !== "function")
    throw new Error(`${eventName}.run is not a function.`);
  if (typeof eventModule.description !== "string")
    throw new Error(`${eventName}.alias is not an string.`);
  return true;
};
