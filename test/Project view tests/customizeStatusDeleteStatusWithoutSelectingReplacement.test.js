const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCustomStatus = require('../../src/classes/statusAndWeight/createCustomStatus');
const DeleteCustomStatus = require('../../src/classes/statusAndWeight/deleteCustomStatus');
const EditCustomStatus = require('../../src/classes/statusAndWeight/editCustomStatus');
const ChangeAreaStatus = require('../../src/classes/view/area/changeAreaStatusInView');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project view tests, @S1a26e659', async () => {
  let driverChrome = null;

  const status = 'test';
  const newstatus = 'test2';
  const color = 1;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Customize Status - Delete Status without Selecting Replacement @Tf183799e', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Customize Status - Delete Status without Selecting Replacement',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const deleteStatus = new DeleteCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await changeAreaStatus.goToView(config.projectNameEdit);
      await deleteStatus.deleteCustomStatusWithoutSelectNewStatus();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_try_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
