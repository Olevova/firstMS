const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda

} = require('../utils/webdriver');

async function lambdaParameters(params, driver) {
    // console.log(!inDocker, '!inDocker');
  if ((isRunningInDocker || isRunningInTeamCity) && !inDocker && !withoutLambda) {
    if (params === 'passed') {
      await driver.executeScript('lambda-status=passed');
    } else if (params === 'failed') {
      await driver.executeScript('lambda-status=failed');
    } else {
        const tasteName = params;
        console.log(tasteName);
        await driver.executeScript(`lambda-name=${tasteName}`);
    }
  }
}

module.exports = lambdaParameters;
