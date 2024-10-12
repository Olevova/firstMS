const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const AddCommentToArea = require('../../src/classes/view/area/addCommentToArea');
const ChangeAreaStatus = require('../../src/classes/view/area/changeAreaStatusInView');
const CheckHistoryStatus = require('../../src/classes/view/area/checkStatusHistory');
const WeightChange = require('../../src/classes/statusAndWeight/weightChange');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('CA can changes area progress, leave comments @Tf8c3b08a', async () => {
    await lambdaParameters(
      'CA can changes area progress, leave comments @Tf8c3b08a',
      driverChrome
    );
    // if (process.env.RUNNING_IN_TEAMCITY || process.env.RUNNING_IN_DOCKER){
    //   let testname = 'add, edit, delete comment to the area'
    //   await driverChrome.executeScript(`lambda-name=${testname}`);
    // }
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new AddCommentToArea(driverChrome);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const checkhistory = new CheckHistoryStatus(driverChrome);
    const changeWeight = new WeightChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await addComment.goToView(config.projectNameForCA, 'ca');
      await addComment.goToSelectTab(config.view);
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusToDoOnInProgress();
      await checkhistory.checkHistory(config.toDo);
      await changeAreaStatus.changeColorProgressStatusByClick();
      await changeAreaStatus.changeStatusInProgressOnDone();
      await changeAreaStatus.changeStatusDoneOnInProgress();
      await changeAreaStatus.changeColorProgressStatusByBtn();
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await changeWeight.findeWeightAndChangeIt(config.huge);
      await changeWeight.findeWeightAndChangeIt(config.medium);
      await changeAreaStatus.closeAreaModalWindow();
      await addComment.addComment('Hi its test comment CA');
      await addComment.deleteComment('Hi its test comment CA');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_comment_add_to_area_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
