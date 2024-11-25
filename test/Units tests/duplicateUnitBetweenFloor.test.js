const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Unit tests @S023a0c9b', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Duplicate unit @Tc91a88a4', async () => {
    await lambdaParameters('Duplicate unit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateUnit = new CreateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await duplicateUnit.goToView(config.projectNameMain);
      await duplicateUnit.duplicateUnitBetweenFloor();
      await duplicateUnit.deleteDuplicateUnit();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_duplicate');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
