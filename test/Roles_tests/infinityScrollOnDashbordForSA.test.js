const DashBoardPart = require('../../src/classes/dashboard/dashBoardPart');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

describe('Super admin role @S75be5ddc', async () => {
  let driverChrome = null;
  let elNumber;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('Infinity scroll on Projects for SA @T56734caa', async () => {
    await lambdaParameters('Infinity scroll on Projects for SA', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const dashBoardPart = new DashBoardPart(driverChrome);

      await loginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );
      elNumber = await dashBoardPart.numberOfElementsOnDashboardTable(
        config.dashboardTables.project
      );
      console.log(elNumber);

      await dashBoardPart.endlessScrollDBTables(
        'app-dashboard-projects-table',
        elNumber,
        config.dashboardTables.project
      );

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'infinity_scroll_on_Projects_SA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
