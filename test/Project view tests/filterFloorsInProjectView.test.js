const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
// const FilterFloor = require('../../src/classes/view/floor/filterFloorInRpojectProgressTab');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Area on project view tests @S686d997f', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Filter by floor and clear the filter @T916b283d', async () => {
    await lambdaParameters('Filter by floor and clear the filter', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filterFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await filterFloor.goToView(config.projectNameMain);
      await filterFloor.goToSelectTab(config.projectProgress);
      await filterFloor.checkFloorInProjectProgressTab();
      await filterFloor.filterByFirstRoom();
      await filterFloor.checkOfFilterOperationByFloors();
      await filterFloor.resetFilterAndCheckResult();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_filtering');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
