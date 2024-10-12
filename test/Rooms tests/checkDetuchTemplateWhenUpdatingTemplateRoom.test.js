const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const DeleteRoom = require('../../src/classes/view/room/deleteRoom');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Rooms tests @Sa2b0fa77', async () => {
  let driverChrome = null;

  const templateName = 'Kitchen';
  const roomBasedOnTemplate = 'room-on-template';
  const unitName = 'first';
  let arrayAreasOfTemplateRoom = null;
  let arrayAreasOfUniqueRoom = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create template room via template @T967acc73', async () => {
    await lambdaParameters('create template room via template', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createRoom.goToView(config.projectStatus);
      await createRoom.createRoomViaTemplate(
        '_',
        templateName,
        roomBasedOnTemplate
      );
      await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('detuch template room, and save as unique room @T3ea2c0f6', async () => {
    await lambdaParameters('create template room via template', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createRoom.goToView(config.projectStatus);
      await createRoom.openEditRoomFormViaThreeDots(roomBasedOnTemplate);
      arrayAreasOfTemplateRoom =
        await createRoom.getArrayOfAreasInRoomModalForm();

      await createRoom.createUniqueRoomByDetachingTemplate();
      await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
      await driverChrome.sleep(2000);
      arrayAreasOfUniqueRoom = await createRoom.findRoomAndGetAreasArray(
        unitName,
        roomBasedOnTemplate
      );
      console.log(arrayAreasOfTemplateRoom, arrayAreasOfUniqueRoom);
      if (
        JSON.stringify(arrayAreasOfTemplateRoom) !==
        JSON.stringify(arrayAreasOfUniqueRoom)
      ) {
        throw new Error('detuch not work');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'detuch_template_room');
      await lambdaParameters('failed', driverChrome);
      throw new error();
    }
  });

  it('delete unique room @Tca4da1c9', async () => {
    await lambdaParameters('delete unique room', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await deleteRoom.goToView(config.projectStatus);
      await deleteRoom.deleteRoom(roomBasedOnTemplate);
      await deleteRoom.checkDeleteFloor(roomBasedOnTemplate);
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_unique_room');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
