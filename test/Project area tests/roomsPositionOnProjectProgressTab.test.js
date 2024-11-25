const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @S87f1d663', async () => {
  let driverChrome = null;
  const roomName = 'bed';
  const position = 'right';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Rooms Position on Project Progress tab @T4015eeb0', async () => {
    await lambdaParameters(
      'Rooms Position on Project Progress tab',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeRoom = new CreateRoom(driverChrome);
    

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeRoom.goToView(config.projectNameMain);
      await changeRoom.goToSelectTab(config.projectProgress);
      await changeRoom.findRoomAndCheckPositionInPT(roomName);
      await changeRoom.checkRoomPositionInPT(roomName);
      await changeRoom.findRoomAndCheckPositionInPT(roomName, position);
      await changeRoom.checkRoomPositionInPT(roomName,position);
      
      
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'rooms_position_on_project_progress_tab');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Save Rooms Position in Project Progress when added a new room @T99a4edbd', async () => {
    await lambdaParameters(
      'Save Rooms Position in Project Progress when added a new room',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeRoom = new CreateRoom(driverChrome);
    

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeRoom.goToView(config.projectNameMain);
      await changeRoom.goToSelectTab(config.projectProgress);
      await changeRoom.findRoomAndCheckPositionInPT(roomName);
      await changeRoom.goToSelectTab(config.view);
      await changeRoom.createRoom('_', config.newRoomName);
      await changeRoom.checkCreateNewRoom(config.newRoomName);
      await changeRoom.goToSelectTab(config.projectProgress);
      await changeRoom.waitListDate(config.locatorRoomCss, 2);
      await changeRoom.checkRoomPositionInPT(roomName);
      await changeRoom.findRoomAndCheckPositionInPT(roomName, position);
      await changeRoom.checkRoomPositionInPT(roomName,position);
      await changeRoom.goToSelectTab(config.view);
      await changeRoom.deleteRoom(config.newRoomName);
      await changeRoom.checkDeleteFloor(config.newRoomName);
      
      
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'save_rooms_position');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
