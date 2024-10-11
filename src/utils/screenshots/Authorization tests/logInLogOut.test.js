const LogOut = require('../../../classes/auth/logOut');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const { createWebdriverChrome } = require('../../webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../makeScreenShot');
const config = require('../../config');

describe('Authorization tests @Se24225b7', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('Login as user with valid credentials @Td9ae6ea9', async () => {
    await lambdaParameters(
      'Login as user with valid credentials',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const logOutUserTest = new LogOut(driverChrome);
      await loginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );
      await logOutUserTest.findUserMenu();
      await logOutUserTest.userLogOut(config.urlLoginPage);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'logout');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Login with Save for future authorization checkbox @Tc3002320',
    async () => {
      await lambdaParameters(
        'Login with Save for future authorization checkbox @Tc3002320',
        driverChrome
      );
      // time and site or lochalhost there tests are going
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
      try {
        const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
        const logOutUserTest = new LogOut(driverChrome);
        await loginPageTest.userLogIn(
          config.email,
          config.password,
          config.urlhomePageForCheck,
          true
        );
        await logOutUserTest.findUserMenu();
        await logOutUserTest.userLogOut(config.urlLoginPage);
        await lambdaParameters('passed', driverChrome);
      } catch (error) {
        // if something wrong make screen in utils/screenshot
        makeScreenshot(driverChrome, 'login_with_save_for_future');
        await lambdaParameters('failed', driverChrome);
        throw error;
      }
    }
  )
});
