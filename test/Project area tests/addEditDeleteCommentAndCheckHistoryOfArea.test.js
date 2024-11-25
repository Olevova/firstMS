const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Area comments sections tests @Sa128eb7d', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });


  it('Change status from To-Do to In-progress @T0c860984', async () => {
    await lambdaParameters(
      'Change area status in view and check history',
      driverChrome
    );
      //TODO move to another file under Area status and weight
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
      await changeAreaStatus.checkHistory(config.toDo);
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await changeAreaStatus.checkHistory(config.inProgress);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'history_area_status');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
