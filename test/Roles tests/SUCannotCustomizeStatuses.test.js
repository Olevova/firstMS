const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCustomStatus = require('../../src/classes/statusAndWeight/createCustomStatus');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('SU cannot customize statuses @Tf17af6f6', async () => {
    await lambdaParameters('SU cannot customize statuses @Tf17af6f6', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createStatus = new CreateCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createStatus.goToView(config.projectNameForSU, 'su');
      const customStatusMenu= await createStatus.checkMissingElement(config.locatorCustomMenuBtnCss,2000);
      if(customStatusMenu){
        console.log('Test passed, customize statuses menu is missed');
       
      }
      else{
        throw new Error('Test failed, customize statuses menu is exist')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});