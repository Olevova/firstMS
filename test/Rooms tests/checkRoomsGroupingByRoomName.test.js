const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Rooms tests @Sa2b0fa77', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Check rooms grouping by the room name @Tb5b7cc05', async () => {
    await lambdaParameters(
      'Check rooms grouping by the room name',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkRoomGrouping = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await checkRoomGrouping.goToView(config.projectNameMain);
      await checkRoomGrouping.roomGroupingWithSameNameInViewTab();
      await checkRoomGrouping.goToSelectTab(config.projectProgress);
      await checkRoomGrouping.checkGroupingInProjectProgressTab();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_rooms_grouping');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
