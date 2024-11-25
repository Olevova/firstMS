const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const WeightChange = require('../../src/classes/statusAndWeight/weightChange');
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

  it('SU can change area status and weight @T93d50296', async () => {
    await lambdaParameters(
      'SU can change area status and weight @T93d50296',
      driverChrome
    );
    
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);
    const changeWeight = new WeightChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await addComment.goToView(config.projectNameForSU, 'su');
      await addComment.goToSelectTab(config.view);
      await addComment.findAreaInView();
      await addComment.changeStatusToDoOnInProgress();
      await addComment.checkHistory(config.toDo);
      await addComment.changeColorProgressStatusByClick();
      await addComment.changeStatusInProgressOnDone();
      await addComment.changeStatusDoneOnInProgress();
      await addComment.changeColorProgressStatusByBtn();
      await addComment.changeStatusInProgressOnToDo();
      await changeWeight.findeWeightAndChangeIt(config.huge);
      await changeWeight.findeWeightAndChangeIt(config.medium);
      await addComment.closeAreaModalWindow();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_and_weight_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU can add comments @Tad0d1344', async () => {
    await lambdaParameters(
      'SU can add comments @Tad0d1344',
      driverChrome
    );
    
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await addComment.goToView(config.projectNameForSU, 'su');
      await addComment.goToSelectTab(config.view);
      await addComment.addComment('Hi its test comment SU');
      await addComment.deleteComment('Hi its test comment SU');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_comments_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
