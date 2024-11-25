const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @Sd0dae96d', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Filters are working on project progress before and after status changed @Tf2a877e4', async () => {
    await lambdaParameters(
      'Filters are working on project progress before and after status changed @Tf2a877e4',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatusInProgress = new CreateArea(
      driverChrome
    );

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatusInProgress.goToView(config.projectNameMain);
      await changeAreaStatusInProgress.goToSelectTab(config.projectProgress);
      
      await changeAreaStatusInProgress.verifyStatusPercentageConsistency();
      await changeAreaStatusInProgress.findeAreaInTheTable('-3');
      await changeAreaStatusInProgress.changeStatusToDoOnInProgress();
      await changeAreaStatusInProgress.closeAreaModalWindow();
      await changeAreaStatusInProgress.findeAreaInTheTable('-3');
      await changeAreaStatusInProgress.changeStatusInProgressOnDone();
      await changeAreaStatusInProgress.closeAreaModalWindow();
      await changeAreaStatusInProgress.verifyStatusPercentageConsistency();
      await changeAreaStatusInProgress.findeAreaInTheTable('-2');
      await changeAreaStatusInProgress.changeStatusInProgressOnToDo();
      await changeAreaStatusInProgress.closeAreaModalWindow();
      await changeAreaStatusInProgress.verifyStatusPercentageConsistency();
      await changeAreaStatusInProgress.findeAreaInTheTable('-1');
      await changeAreaStatusInProgress.changeStatusDoneOnInProgress();
      await changeAreaStatusInProgress.changeStatusInProgressOnToDo();
      await changeAreaStatusInProgress.closeAreaModalWindow();
      await changeAreaStatusInProgress.verifyStatusPercentageConsistency();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});