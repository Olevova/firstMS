const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');
const { until } = require('selenium-webdriver');

describe('Authorization tests @Se24225b7', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    await driverChrome.quit();
  });

  it('Access the main Dashboard page without authorization', async () => {
    await lambdaParameters(
      'Access the main Dashboard page without authorization',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      await driverChrome.get(config.urlhomePageForCheck);
      const currentUrl = await driverChrome.getCurrentUrl();
      const baseUrl = currentUrl.split('?')[0];
      if (baseUrl !== config.urlLoginPage) {
        throw new Error('URL does not match login page');
      }
      console.log('Test passed');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'access_main_dashboard_page_without_auth');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});