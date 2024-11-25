const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const WeightChange = require('../../src/classes/statusAndWeight/weightChange');
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

  it('Change area status and weight in view @T49839858', async () => {
    await lambdaParameters(
      'Change area status and weight in view',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new CreateArea(driverChrome);
    const changeWeight = new WeightChange(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_weight_change');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
