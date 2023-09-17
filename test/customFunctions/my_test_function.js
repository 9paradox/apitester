async function customFunction(testCase, currentStep, lastStep) {
  var output = testCase.data('delectus_aut_autem');
  output = output.toUpperCase();
  var result = {
    inputData: lastStep.outputData,
    outputData: output,
  };
  return result;
}

module.exports.customFunction = customFunction;
