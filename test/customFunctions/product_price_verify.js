//function should follow CustomFunction structure.
async function isValidProductPrice(testCase, currentStep, lastStep) {
  var data = lastStep.outputData.data;
  var isValidPrice = data && data.price && data.price > 0;
  return {
    inputData: data,
    outputData: isValidPrice,
    verification: {
      verified: isValidPrice,
      actualData: data.price,
      message: isValidPrice ? 'Price is valid' : 'Price is invalid',
    },
  };
}

//should follow exporting the functionName
module.exports.isValidProductPrice = isValidProductPrice;
