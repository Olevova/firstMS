const DashBoardPart = require('../../src/classes/dashboard/dashBoardPart');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

describe('Tasks tests @S26f6875e', async () => {
  let driverChrome = null;
  let elNumber;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('Infinity scroll on My open tasks (for CA, PM, Stand. User) @T33c4a28a', async () => {
    await lambdaParameters(
      'Infinity scroll on My open tasks (for CA, PM, Stand. User)',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const dashBoardPart = new DashBoardPart(driverChrome);

      await loginPageTest.userLogIn(
        config.emailCA,
        config.passwordCA,
        config.mainCompanyPage
      );
      elNumber = await dashBoardPart.numberOfElementsOnDashboardTable(
        config.dashboardTables.task
      );
      await dashBoardPart.endlessScrollDBTables(
        'app-dashboard-tasks-table',
        elNumber,
        config.dashboardTables.task
      );

      await driverChrome.executeScript('window.open()');
      let handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[1]);
      await loginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );
      elNumber = await dashBoardPart.numberOfElementsOnDashboardTable(
        config.dashboardTables.task
      );
      await dashBoardPart.endlessScrollDBTables(
        'app-dashboard-tasks-table',
        elNumber,
        config.dashboardTables.task
      );

      await driverChrome.executeScript('window.open()');
      handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[2]);
      await loginPageTest.userLogIn(
        config.emailSU,
        config.passwordSU,
        config.mainCompanyPage
      );
      elNumber = await dashBoardPart.numberOfElementsOnDashboardTable(
        config.dashboardTables.task
      );
      await dashBoardPart.endlessScrollDBTables(
        'app-dashboard-tasks-table',
        elNumber,
        config.dashboardTables.task
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'logout');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
