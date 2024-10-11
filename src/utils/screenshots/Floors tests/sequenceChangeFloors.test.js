const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const SequenceFloorChange = require('../../../classes/view/floor/sequenceFloorChange');
const SequenceUnitChange = require('../../../classes/view/unit/sequenceUnitChange');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');

describe('Floors tests @S85063df9', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('units @T3b4b3792', async () => {
    await lambdaParameters('units sequence change', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeUnits = new SequenceUnitChange(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeUnits.goToView(config.projectNameMain);
      await changeUnits.sequenceChange();
      await changeUnits.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'units_change_sequence');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('floor @Tad86aea3', async () => {
    await lambdaParameters('floor sequence change', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeFloor = new SequenceFloorChange(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeFloor.goToView(config.projectNameMain);
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence');
      throw error;
    }
  });
});
