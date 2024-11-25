const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Area status and weight tests @Sc6ecacd5', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Change area status in project @Tb28627eb', async () => {
    await lambdaParameters(
      'Change area status in progress project',
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
      await changeAreaStatusInProgress.findeAreaInTheTable();

      await changeAreaStatusInProgress.changeStatusToDoOnInProgress();
      await changeAreaStatusInProgress.changeColorProgressStatusByClick();
      await changeAreaStatusInProgress.changeStatusInProgressOnDone();
      await changeAreaStatusInProgress.changeStatusDoneOnInProgress();
      await changeAreaStatusInProgress.changeColorProgressStatusByBtn();
      await changeAreaStatusInProgress.changeStatusInProgressOnToDo();
      await changeAreaStatusInProgress.closeAreaPopUpAndCheckStatusInPogress();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Change area status in view @T50f0e3f2', async () => {
    await lambdaParameters('change area status in view', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusToDoOnInProgress();
      await changeAreaStatus.changeColorProgressStatusByClick();
      await changeAreaStatus.changeStatusInProgressOnDone();
      await changeAreaStatus.changeStatusDoneOnInProgress();
      await changeAreaStatus.changeColorProgressStatusByBtn();
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await changeAreaStatus.closeAreaPopUpAndCheckStatusInView();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_view');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
