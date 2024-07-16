const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
const ChangeAreaStatusInProjectProgress = require('../src/classes/view/area/changeAreaStatusInProjectProgress');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Change Area status in the View tab and in the Progress Project tab in the chrom browser, test-cases #89,94,105,104,117, 117.1,95,96,97,105.1, 104.1, 117.3, 117.4,98', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('change area status in progress project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatusInProgress = new ChangeAreaStatusInProjectProgress(
      driverChrome
    );

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeAreaStatusInProgress.goToView(config.projectNameMain);
      await changeAreaStatusInProgress.goToSelektTab(config.projectProgress);
      await changeAreaStatusInProgress.findeAreaInTheTable();

      await changeAreaStatusInProgress.changeStatusToDoOnInProgress();
      await changeAreaStatusInProgress.changeColorProgressStatusByClick();
      await changeAreaStatusInProgress.changeStatusInProgressOnDone();
      await changeAreaStatusInProgress.changeStatusDoneOnInProgress();
      await changeAreaStatusInProgress.changeColorProgressStatusByBtn();
      await changeAreaStatusInProgress.changeStatusInProgressOnToDo();
      await changeAreaStatusInProgress.closeAreaPopUpAndCheckStatusInPogress();
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_project');
      throw error;
    }
  });

  it(' change area status in view', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_view');
      throw error;
    }
  });
});
