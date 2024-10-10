const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const ChangeAreaStatus = require('../../src/classes/view/area/changeAreaStatusInView');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const DeleteRoom = require('../../src/classes/view/room/deleteRoom');
const CreateArea = require('../../src/classes/view/area/createArea');
const WeightChange = require('../../src/classes/statusAndWeight/weightChange');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;

  const newRoomName = 'testPercentRoom';
  const newAreaName = 'testPercentArea';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });
  it('Сheck changes of Project Progress(%) when progress is 100% and adding New room with Area and check changes and after delete room and check changes @Tce924f87', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Сheck changes of Project Progress(%) when progress is 100% and adding New room with Area and check changes and after delete room and check changes',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const changeWeight = new WeightChange(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);
    const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatus.goToView(config.projectStatus);
      await changeAreaStatus.checkStartProgressProjectPercent();
      await createRoom.createRoom('_', newRoomName);
      await createRoom.checkCreateNewRoom(newRoomName);
      await createArea.openEditRoomFormViaThreeDots(newRoomName);
      await createArea.addAreaInRoomWithoutCreatingTemplate(newAreaName);
      await createArea.checkCreateArea(newRoomName, newAreaName);
      await changeAreaStatus.comparisonOfProgress('decrease');
      await deleteRoom.deleteRoom(newRoomName);
      await deleteRoom.checkDeleteFloor(newRoomName);
      await changeAreaStatus.comparisonOfProgress('increase');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(
        driverChrome,
        'chek_project%_after_added_new_room_area'
      );
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('change area status in view tab and check Project Progress(%) @T5224f8bf', async () => {
    await lambdaParameters(
      'change area status in view tab and check Project Progress(%)',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.checkStartProgressProjectPercent();
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusToDoOnInProgress();
      await changeAreaStatus.closeAreaAndCheckProgress('equally');
      await changeAreaStatus.findAreaInView('-2');
      await changeAreaStatus.changeColorProgressStatusByClick();
      await changeAreaStatus.closeAreaAndCheckProgress();
      await changeAreaStatus.findAreaInView('-2');
      await changeAreaStatus.changeStatusInProgressOnDone();
      await changeAreaStatus.closeAreaAndCheckProgress();
      await changeAreaStatus.findAreaInView('-1');
      await changeAreaStatus.changeStatusDoneOnInProgress();
      await changeAreaStatus.closeAreaAndCheckProgress('equally');
      await changeAreaStatus.findAreaInView('-2');
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await changeAreaStatus.closeAreaAndCheckProgress('decrease');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(
        driverChrome,
        'chek_project%_after_change_status_area'
      );
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
