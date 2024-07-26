const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
const CreateRoom = require('../src/classes/view/room/createRoom');
const DeleteRoom = require('../src/classes/view/room/deleteRoom');
const CreateArea = require('../src/classes/view/area/createArea');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Check changes of Project Progress(%) when changing status of Area from in view tab in the chrom browser, test-cases #180, 181, 182, 183,184', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newRoomName = 'testPercentRoom';
  const newAreaName = 'testPercentArea';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });
  it('Сheck changes of Project Progress(%) when progress is 100% and adding New room with Area and check changes and after delete room and check changes', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Сheck changes of Project Progress(%) when progress is 100% and adding New room with Area and check changes and after delete room and check changes',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);
    const deleteRoom = new DeleteRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
      await changeAreaStatus.comparisonOfProgress();
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

  it('change area status in view tab and check Project Progress(%)', async () => {
    await lambdaParameters(
      'change area status in view tab and check Project Progress(%)',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
