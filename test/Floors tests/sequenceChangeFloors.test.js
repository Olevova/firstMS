const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

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
    const changeUnits = new CreateUnit(driverChrome);

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
    const changeFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeFloor.goToView(config.projectDone);
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
