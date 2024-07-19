const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
const WeightChange = require('../src/classes/statusAndWeight/weightChange');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Check the area weight changing, test case #160 ', async () => {
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

  it(' change area status and weight in view', async () => {
    await lambdaParameters(' change area status and weight in view', driverChrome)
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const changeWeight = new WeightChange(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.checkStartProgressProjectPercent();
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusInProgressOnDone();
      await changeAreaStatus.closeAreaAndCheckProgress();
      await changeAreaStatus.findAreaInView('-1');
      await driverChrome.sleep(1000);
      await changeWeight.findeWeightAndChangeIt(config.huge);
      await driverChrome.sleep(1000);
      await changeAreaStatus.closeAreaAndCheckProgress();
      await changeAreaStatus.findAreaInView('-1');
      await changeWeight.findeWeightAndChangeIt(config.medium);
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await changeAreaStatus.closeAreaAndCheckProgress('decrease');
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_weight_change');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
