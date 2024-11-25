const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const CreateArea = require('../../src/classes/view/area/createArea');
const WeightChange = require('../../src/classes/statusAndWeight/weightChange');

const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Area status ans weight tests @Sc6ecacd5', async () => {
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
  it('Project Progress(%) changes when New room with Area added and later deleted @Tce924f87', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Project Progress(%) changes when New room with Area added and later deleted ',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);
    // const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createArea.goToView(config.projectStatus);
      await createArea.checkStartProgressProjectPercent();
      await createRoom.createRoom('_', newRoomName);
      await createRoom.checkCreateNewRoom(newRoomName);
      await createArea.openEditRoomFormViaThreeDots(newRoomName);
      await createArea.addAreaInRoomWithoutCreatingTemplate(newAreaName);
      await createArea.checkCreateArea(newRoomName, newAreaName);
      await createArea.comparisonOfProgress('decrease');
      await createRoom.deleteRoom(newRoomName);
      await createRoom.checkDeleteFloor(newRoomName);
      await createArea.comparisonOfProgress('increase');
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

  it('Change area status in view tab and check Project Progress(%) @T5224f8bf', async () => {
    await lambdaParameters(
      'Change area status in view tab and check Project Progress(%)',
      driverChrome
    );
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
