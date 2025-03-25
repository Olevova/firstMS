const DashBoardPart = require('../../src/classes/dashboard/dashBoardPart');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

describe('Super admin role @S75be5ddc', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('SA - Verify Navigation to Full Table Version (See All Button) @T8def8f62', async () => {
    await lambdaParameters(
      'SA - Verify Navigation to Full Table Version (See All Button)',
      driverChrome
    );
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
      await dashBoardPart.clickOnSeeAllLink(
        config.dashboardTables.company,
        config.companiesPage
      );
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'See_all_button_dashboard_SA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA - Verify Navigation to Full Table Version (See All Button) @T50a7c780', async () => {
    await lambdaParameters(
      'CA - Verify Navigation to Full Table Version (See All Button)',
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
      await dashBoardPart.clickOnSeeAllLink(
        config.dashboardTables.project,
        config.mainCompanyPage
      );
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'See_all_button_dashboard_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM - Verify Navigation to Full Table Version (See All Button) @T5eacc167', async () => {
    await lambdaParameters(
      'PM - Verify Navigation to Full Table Version (See All Button)',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const dashBoardPart = new DashBoardPart(driverChrome);

      await loginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );
      await dashBoardPart.clickOnSeeAllLink(
        config.dashboardTables.project,
        config.mainCompanyPage
      );
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'See_all_button_dashboard_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU - Verify Navigation to Full Table Version (See All Button) @T57b83caa', async () => {
    await lambdaParameters(
      'SU - Verify Navigation to Full Table Version (See All Button)',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const dashBoardPart = new DashBoardPart(driverChrome);

      await loginPageTest.userLogIn(
        config.emailSU,
        config.passwordSU,
        config.mainCompanyPage
      );
      await dashBoardPart.clickOnSeeAllLink(
        config.dashboardTables.project,
        config.mainCompanyPage
      );
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'See_all_button_dashboard_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
