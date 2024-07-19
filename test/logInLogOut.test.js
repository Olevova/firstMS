const LogOut = require('../src/classes/auth/logOut');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const { createWebdriverChrom } = require('../src/utils/webdriver');
const { describe } = require('mocha');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../src/utils/makeScreenShot');
const config = require('../src/utils/config');

describe('Log In and Log Out in the chrome browser, test-cases #1, 2', async () => {
  // add varibalses for testing

  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('Log In and Log Out the Coloradojob', async () => {
    await lambdaParameters('Log In and Log Out the Coloradojob',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const logOutUserTest = new LogOut(driverChrome);
      await loginPageTest.openLoginForm();
      await loginPageTest.fillEmailInput(config.email);
      await loginPageTest.fillPasswordInput(config.password);
      await loginPageTest.checkSaveForFuture();
      await loginPageTest.login(config.urlhomePageForCheck);
      await logOutUserTest.findUserMenu();
      await logOutUserTest.userLogOut(config.urlLoginPage);
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'logout');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
