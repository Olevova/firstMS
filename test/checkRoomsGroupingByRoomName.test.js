const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CheckRoomGrouping = require('../src/classes/view/room/checkRoomGrouping');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Check rooms grouping by the room name, test case #149', async () => {
  // here add parameters for creation
  let driverChrome = null;
  const project = 'one-floor';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Check rooms grouping by the room name', async () => {
    await lambdaParameters(
      'Check rooms grouping by the room name',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkRoomGrouping = new CheckRoomGrouping(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await checkRoomGrouping.goToView(project);
      await checkRoomGrouping.roomGroupingWithSameNameInViewTab();
      await checkRoomGrouping.goToSelektTab('Project Progress');
      await checkRoomGrouping.checkGroupingInProjectProgressTab();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_rooms_grouping');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
