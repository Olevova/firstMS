const DashBoardPart = require('../../../classes/dashboard/dashBoardPart');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const { createWebdriverChrome } = require('../../webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../makeScreenShot');
const config = require('../../config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('CA - Verify Navigation to Project detail via ID or Name Link @T73e41d27', async () => {
    await lambdaParameters(
      'CA - Verify Navigation to Project detail via ID or Name Link',
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
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'ts'
      );
      await driverChrome.sleep(1000);
      await driverChrome.executeScript('window.open()');
      let handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[1]);
      await loginPageTest.userLogIn(
        config.emailCA,
        config.passwordCA,
        config.mainCompanyPage
      );
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        false,
        'ts'
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'task_open_via_id_name_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM - Verify Navigation to Task Details via ID or Name Link @T33015376', async () => {
    await lambdaParameters(
      'PM - Verify Navigation to Task Details via ID or Name Link',
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
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'ts'
      );
      await driverChrome.sleep(1000);
      await driverChrome.executeScript('window.open()');
      let handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[1]);
      await loginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        false,
        'ts'
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'task_open_via_id_name_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU - Verify Navigation to Task Details via ID or Name Link @T4e4713fb', async () => {
    await lambdaParameters(
      'SU - Verify Navigation to Task Details via ID or Name Link',
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
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        true,
        'ts'
      );
      await driverChrome.sleep(1000);
      await driverChrome.executeScript('window.open()');
      let handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[1]);
      await loginPageTest.userLogIn(
        config.emailSU,
        config.passwordSU,
        config.mainCompanyPage
      );
      await dashBoardPart.checkRedirectByClickOnCompanyPageViaLinkOrId(
        false,
        'ts'
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'task_open_via_id_name_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
