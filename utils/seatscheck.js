const check = async function areAllElementsInArray(arrayToCheck, targetArray) {
  return arrayToCheck.every((element) => targetArray.includes(element));
};
module.exports = check;
