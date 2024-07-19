const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const FilterFloor = require('../src/classes/view/floor/filterFloorInRpojectProgressTab');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Filter floors and reset floors filter in the Progress Project tab in the chrom browser, test-cases #141, 141.2', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('filters floor and reset filter', async () => {
    await lambdaParameters('filters floor and reset filter',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filterFloor = new FilterFloor(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await filterFloor.goToView(config.projectNameMain);
      await filterFloor.goToSelektTab(config.projectProgress);
      await filterFloor.checkFloorInProjectProgressTab();
      await filterFloor.filterByFirstRoom();
      await filterFloor.checkOfFilterOperationByFloors();
      await filterFloor.resetFilterAndCheckResult();
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_create');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
