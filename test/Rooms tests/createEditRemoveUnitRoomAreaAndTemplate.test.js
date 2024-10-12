const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const DeleteUnit = require('../../src/classes/view/unit/deleteUnit');
const EditUnit = require('../../src/classes/view/unit/editUnit');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const DeleteRoom = require('../../src/classes/view/room/deleteRoom');
const CreateArea = require('../../src/classes/view/area/createArea');
const DeleteArea = require('../../src/classes/view/area/deleteArea');
const RoomTemplate = require('../../src/classes/view/room/roomTemplate');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { nanoid } = require('nanoid');

describe('Rooms tests @Sa2b0fa77', async () => {
  let driverChrome = null;

  const newUnitName = 'testUnit';
  const editUnitName = 'test2';
  const newRoomName = 'tr' + nanoid(5);
  const editFloorName = 'test2';
  const newAreaName = 'testArea';
  const editTemplateName = 'editTemplateTest';
  const roomBasedOnTemplate = 'room-on-template';
  const subtitleForEditRoom = 'test';
  const editTemplateRoomForCheck =
    roomBasedOnTemplate + ' ' + subtitleForEditRoom;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new unit @T089b45ef', async () => {
    await lambdaParameters('create new unit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createUnit = new CreateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createUnit.goToView(config.projectNameMain);
      await createUnit.createUnit(newUnitName);
      await createUnit.checkCreateUnit(newUnitName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('edit new unit @T621de4c7', async () => {
    await lambdaParameters('edit new unit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editUnit = new EditUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editUnit.goToView(config.projectNameMain);
      await editUnit.editUnit(newUnitName, editUnitName);
      await editUnit.checkCreateUnit(editUnitName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('create new Room(unique) @T2c9a49cd', async () => {
    await lambdaParameters('create new Room(unique)', driverChrome);
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
      await createRoom.goToView(config.projectNameMain);
      await createRoom.createRoom('_', newRoomName);
      await createRoom.checkCreateNewRoom(newRoomName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'room_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('create new Area and create template @Td4fc92c6', async () => {
    await lambdaParameters('create new Area and create template', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createArea = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createArea.goToView(config.projectNameMain);
      await createArea.openEditRoomFormViaThreeDots(newRoomName);
      await createArea.addAreaInRoom(newAreaName);
      await createArea.checkCreateArea(newRoomName, newAreaName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'area_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete new area @Ta3935be1', async () => {
    await lambdaParameters('delete new area', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteArea = new DeleteArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await deleteArea.goToView(config.projectNameMain);
      await deleteArea.openEditRoomFormViaThreeDots(newRoomName);
      await deleteArea.deleteArea(newAreaName);
      await deleteArea.checkDeleteArea(newRoomName, newAreaName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'area_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete new room (unique) @T48f0e2da', async () => {
    await lambdaParameters('delete new room (unique)', driverChrome);
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
      await deleteRoom.goToView(config.projectNameMain);
      await deleteRoom.deleteRoom(newRoomName);
      await deleteRoom.checkDeleteFloor(newRoomName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'room_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete new unit @T4a1ecb6c', async () => {
    await lambdaParameters('delete new unit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteUnit = new DeleteUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await deleteUnit.goToView(config.projectNameMain);
      await deleteUnit.deleteUnit(editUnitName);
      await deleteUnit.checkDeleteUnit(editUnitName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('template edit @T7965bbb8', async () => {
    await lambdaParameters('template edit', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const roomTemplate = new RoomTemplate(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await roomTemplate.goToView(config.projectNameMain);
      await roomTemplate.editTemplate('_', newAreaName, editTemplateName);
      await roomTemplate.checkTemplateInList('_', editTemplateName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'template_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('create template room via template @T9731e9ba', async () => {
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
      await createRoom.goToView(config.projectNameMain);
      await createRoom.createRoomViaTemplate(
        '_',
        editTemplateName,
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

  it('edit template room via template @T4fd5c13f', async () => {
    await lambdaParameters('edit template room via template', driverChrome);
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
      await createRoom.goToView(config.projectNameMain);
      await createRoom.openEditRoomFormViaThreeDots(roomBasedOnTemplate);
      await createRoom.addSubtitleToTheRoom(subtitleForEditRoom);
      await createRoom.checkCreateNewRoom(editTemplateRoomForCheck);
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'edit_room_via_template');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete template room via template @T51941cd6', async () => {
    await lambdaParameters('delete template room via template', driverChrome);
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
      await deleteRoom.goToView(config.projectNameMain);
      await deleteRoom.deleteRoom(editTemplateRoomForCheck);
      await deleteRoom.checkDeleteFloor(editTemplateRoomForCheck);
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'edit_room_via_template');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('template delete @Te003c823', async () => {
    await lambdaParameters('template delete', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const roomTemplate = new RoomTemplate(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await roomTemplate.goToView(config.projectNameMain);
      await roomTemplate.deleteTemplate('_', editTemplateName);
      await roomTemplate.checkDeleteTemplate('_', editTemplateName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'template_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
