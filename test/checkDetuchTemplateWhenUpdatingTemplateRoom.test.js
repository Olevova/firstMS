const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateRoom = require('../src/classes/view/room/createRoom');
const DeleteRoom = require('../src/classes/view/room/deleteRoom');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../src/utils/config');

describe('Detach Template when Updating a template room, test-cases: 67/4', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const templateName = 'Kitchen';
  const roomBasedOnTemplate = 'room-on-template';
  const unitName = 'first';
  let arrayAreasOfTemplateRoom = null;
  let arrayAreasOfUniqueRoom = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create template room via template', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createRoom.goToView(config.projectStatus);
      await createRoom.createRoomViaTemplate(
        '_',
        templateName,
        roomBasedOnTemplate
      );
      await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template');
      throw error;
    }
  });

  it('detuch template room, and save as unique room', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createRoom.goToView(config.projectStatus);
      await createRoom.openEditRoomFormViaThreeDots(roomBasedOnTemplate);
      arrayAreasOfTemplateRoom =
        await createRoom.getArrayOfAreasInRoomModalForm();

      await createRoom.createUniqueRoomByDetachingTemplate();
      await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
      await driverChrome.sleep(3000);
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
      // await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
    } catch (error) {
      await makeScreenshot(driverChrome, 'detuch_template_room');
      throw new error();
    }
  });

  it('delete unique room', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await deleteRoom.goToView(config.projectStatus);
      await deleteRoom.deleteRoom(roomBasedOnTemplate);
      await deleteRoom.checkDeleteFloor(roomBasedOnTemplate);

      await driverChrome.sleep(1000);
      // await createRoom.checkCreateNewRoom(roomBasedOnTemplate);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_unique_room');
      throw error;
    }
  });
});
