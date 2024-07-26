const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const DuplicateUnit = require('../src/classes/view/unit/duplicateUnit');

const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Duplicate and delete Unit between the floors in the chrom browser, test-cases #93, 110', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const projectName = 'ColorjobAT';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('duplicate unit', async () => {
    await lambdaParameters('duplicate unit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateUnit = new DuplicateUnit(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
