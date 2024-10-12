const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../../src/classes/view/area/changeAreaStatusInProjectProgress');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Check hover mouse over area with black triangle @Tdbe7faab', async () => {
    await lambdaParameters(
      'Check hover mouse over area with black triangle',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatusInProgress = new ChangeAreaStatusInProjectProgress(
      driverChrome
    );

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatusInProgress.goToView(config.projectNameEdit);
      await changeAreaStatusInProgress.goToSelectTab(config.projectProgress);
      // await changeAreaStatusInProgress.hoverAreaAndCheckCommentsAndAttachments(
      //  2,1
      // );
      await changeAreaStatusInProgress.hoverAreaAndCheckCommentsAndAttachmentsNew()
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_hover_mouse_over_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
