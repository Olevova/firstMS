const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const DeleteRoom = require('../../src/classes/view/room/deleteRoom');
const RoomTemplate = require('../../src/classes/view/room/roomTemplate');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Rooms tests @Sa2b0fa77', async () => {
  let driverChrome = null;

  const newRoomName = 'editTemplate';
  const roomBasedOnTemplate = 'linkTemplate';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Creating a room template after editing the template in the room add form @T85a889ba', async () => {
    await lambdaParameters(
      'Creating a room template after editing the template in the room add form',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);
    const roomTemplate = new RoomTemplate(driverChrome);
    const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createRoom.goToView(config.projectNameMain);
      await createRoom.createTemplateRoomWithAreas('_', newRoomName, false, 2);
      await createRoom.checkCreateNewRoom(newRoomName);
      await deleteRoom.deleteRoom(newRoomName);
      await deleteRoom.checkDeleteFloor(newRoomName);
      await createRoom.clickElement('#addRoom');
      await createRoom.findAndClickOnLinInTheList(
        newRoomName,
        '.duplicate-floor-variants__item'
      );
      await driverChrome.sleep(1000);
      await roomTemplate.createTemplateRoomViaLinkEditTemplateInAddRoomForm(
        roomBasedOnTemplate
      );
      await createRoom.checkCreateNewRoom(newRoomName);
      await deleteRoom.deleteRoom(newRoomName);
      await deleteRoom.checkDeleteFloor(newRoomName);
      await roomTemplate.deleteTemplate('_', newRoomName);
      await roomTemplate.checkDeleteTemplate('_', newRoomName);
      await driverChrome.sleep(1000);

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'room_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
