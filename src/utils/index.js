const allowWhitelisted = (key, whitelist) => whitelist.includes(key);

const removeBlacklisted = (key, blacklist) => !blacklist.includes(key);

const getFilteredObject = (obj, whitelist = [], blacklist = []) => {
  const isNotFiltered = !whitelist.length && !blacklist.length;
  if (isNotFiltered) return obj;

  const filteredObj = Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => allowWhitelisted(key, whitelist))
      .filter(([key]) => removeBlacklisted(key, blacklist))
  );

  return filteredObj;
};

const hasProps = (props, object) => {
  props.forEach((prop) => {
    if (object[prop] === undefined) {
      throw {
        missingProp: prop,
        reason: `Missing prop: ${prop}`,
        error: new Error("Missing prop: ", prop),
      };
    }
  });

  return object;
};

module.exports = {
  getFilteredObject,
  hasProps,
};
