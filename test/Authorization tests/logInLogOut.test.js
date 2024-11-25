const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

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

      await loginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );
      await loginPageTest.findUserMenu();
      await loginPageTest.userLogOut(config.urlLoginPage);
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
        
        await loginPageTest.userLogIn(
          config.email,
          config.password,
          config.urlhomePageForCheck,
          true
        );
        await loginPageTest.findUserMenu();
        await loginPageTest.userLogOut(config.urlLoginPage);
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
