const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const DeleteFloor = require('../../src/classes/view/floor/deleteFloor');
const DuplicateFloor = require('../../src/classes/view/floor/duplicateFloor');
const DuplicateUnit = require('../../src/classes/view/unit/duplicateUnit');
const SequenceFloorChange = require('../../src/classes/view/floor/sequenceFloorChange');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const CreateArea = require('../../src/classes/view/area/createArea');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const DeleteRoom = require('../../src/classes/view/room/deleteRoom');
const RoomTemplate = require('../../src/classes/view/room/roomTemplate');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  

  let duplicateFloorName = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('CA can add/duplicate floors @T30d6a7c9', async () => {
    await lambdaParameters('CA can add/duplicate floors', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);
    const duplicateFloorInProject = new DuplicateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForCA, 'ca');
      await createFloor.createFloor(config.newFloorName);
      await createFloor.checkFloorCreation(config.newFloorName);
      duplicateFloorName = await duplicateFloorInProject.duplicateFloor();  
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_create_duplicate_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

it('CA can rearrange floors @T64f23cbb', async () => {
    await lambdaParameters('CA can rearrange floors', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeFloor = new SequenceFloorChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await changeFloor.goToView(config.projectNameForCA, 'ca');
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence_by_CA');
      throw error;
    }
  });

  it('CA can add/duplicate units @Te00e3377', async () => {
    await lambdaParameters('CA can add/duplicate units', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createUnit = new CreateUnit(driverChrome);
    const duplicateUnit = new DuplicateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createUnit.goToView(config.projectNameForCA, 'ca');
      await createUnit.createUnit(config.newUnitName);
      await createUnit.checkCreateUnit(config.newUnitName);
      await duplicateUnit.duplicateUnit();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_create_duplicate_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete floor by CA', async () => {
    await lambdaParameters(
      'Delete floor by CA',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await deleteFloor.goToView(config.projectNameForCA, 'ca');
      await deleteFloor.deleteFloor(config.newFloorName);
      await deleteFloor.checkDeleteFloor(config.newFloorName);
      await deleteFloor.deleteFloor(duplicateFloorName);
      await deleteFloor.checkDeleteFloor(duplicateFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_delete_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can add unique rooms @T41e327d3', async () => {
    await lambdaParameters('create new Room(unique)', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createRoom.goToView(config.projectNameForCA, 'ca');
      await createRoom.createRoom('_', config.newRoomName);
      await createRoom.checkCreateNewRoom(config.newRoomName);
      await createArea.openEditRoomFormViaThreeDots(config.newRoomName);
      await createArea.addAreaInRoomWithoutCreatingTemplate(config.newAreaName);
      await createArea.checkCreateArea(config.newRoomName, config.newAreaName);
      await createArea.openEditRoomFormViaThreeDots(config.newRoomName);
      await createRoom.addSubtitleToTheRoom(config.newSubtitle);
      await createRoom.notificationCheck();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unique_room_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can can edit unqie rooms @T3cc7507f', async () => {
    await lambdaParameters('CA can can edit unqie rooms', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createRoom.goToView(config.projectNameForCA, 'ca');
      await createRoom.openEditRoomFormViaThreeDots(config.newRoomName+' '+config.newSubtitle);
      await createRoom.changeRoomTitle(config.editRoom);
      await createArea.addAreaInRoomWithoutCreatingTemplate(config.editArea);
      await createArea.checkCreateArea(config.editRoom+' '+config.newSubtitle,config.newAreaName+config.editArea);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unique_room_edit_by_CA');
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
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await deleteRoom.goToView(config.projectNameForCA, 'ca');
      await deleteRoom.deleteRoom(config.editRoom+' '+config.newSubtitle);
      await deleteRoom.checkDeleteFloor(config.editRoom+' '+config.newSubtitle);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'room_delete_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
  it('CA can create templates (save as template) @T68e3da72', async () => {
    await lambdaParameters('CA can create templates (save as template)', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createRoom.goToView(config.projectNameForCA, 'ca');
      await createRoom.createTemplateRoomWithAreas('_',config.template, false,1);
      await createRoom.checkCreateNewRoom(config.template);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'template_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can create room from templates @T5728761c', async () => {
    await lambdaParameters('CA can create room from templates', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createRoom.goToView(config.projectNameForCA, 'ca');
      await createRoom.createRoomViaTemplate(
        '_',
        config.template,
        config.roomBasedOnTemplate
      );
      await createRoom.checkCreateNewRoom(config.roomBasedOnTemplate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can detach template @T0c0b529b', async () => {
    await lambdaParameters('CA can detach template', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createRoom.goToView(config.projectNameForCA, 'ca');
      await createRoom.createUniqueRoomViaTemplate(
        '_',
        config.template,
        config.detuchRoom
      );
      await createRoom.checkCreateNewRoom(config.detuchRoom);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete template, template room via template, unique room via template', async () => {
    await lambdaParameters('delete template room via template', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteRoom = new DeleteRoom(driverChrome);
    const roomTemplate = new RoomTemplate(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await deleteRoom.goToView(config.projectNameForCA, 'ca');
      await deleteRoom.deleteRoom(config.detuchRoom);
      await deleteRoom.checkDeleteFloor(config.detuchRoom);
      await deleteRoom.deleteRoom(config.roomBasedOnTemplate);
      await deleteRoom.checkDeleteFloor(config.roomBasedOnTemplate);
      await roomTemplate.deleteTemplate('_', config.template);
      await roomTemplate.checkDeleteTemplate('_', config.template);
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'edit_room_via_template');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
