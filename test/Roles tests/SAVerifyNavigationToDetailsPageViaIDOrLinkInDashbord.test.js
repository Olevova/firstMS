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

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('SA - Verify Navigation to Details Page via ID or Name Link @Ta4808bb2', async () => {
    await lambdaParameters(
      'SA - Verify Navigation to Details Page via ID or Name Link',
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
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'cm'
      );
      await driverChrome.sleep(1000);
      await dashBoardPart.clickElement('#linkBackAllCompanies');
      await driverChrome.sleep(1000);
      await dashBoardPart.clickElement('#linkDashboard');
      await driverChrome.sleep(1000);
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        false,
        'cm'
      );
      await dashBoardPart.clickElement('#linkBackAllCompanies');
      await driverChrome.sleep(1000);
      await dashBoardPart.clickElement('#linkDashboard');
      await driverChrome.sleep(1000);
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'pj'
      );
      await dashBoardPart.clickElement('#linkBackAllCompanies');
      await driverChrome.sleep(1000);
      await dashBoardPart.clickElement('#linkDashboard');
      await driverChrome.sleep(1000);
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'pj'
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'project_company_open_via_id_link');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
