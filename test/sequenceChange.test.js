const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const SequenceFloorChange = require('../src/classes/view/floor/sequenceFloorChange');
const SequenceRoomChange = require('../src/classes/view/room/sequenceRoomChange');
const SequenceUnitChange = require('../src/classes/view/unit/sequenceUnitChange');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Items sequence change in the chrom browser, test-cases #76,78', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('units', async () => {
    await lambdaParameters('units sequence change', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeUnits = new SequenceUnitChange(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeUnits.goToView(config.projectNameMain);
      await changeUnits.sequenceChange();
      await changeUnits.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'units_change_sequence');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('floor', async () => {
    await lambdaParameters('floor sequence change', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeFloor = new SequenceFloorChange(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeFloor.goToView(config.projectNameMain);
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence');
      throw error;
    }
  });

  // it('room', async () => {
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', URL);

  //   const logginPageTest = new LoginPage(driverChrome, URL);
  //   const changeRoom = new SequenceRoomChange(driverChrome);

  //   await logginPageTest.openLoginForm();
  //   await logginPageTest.fillEmailInput(email);
  //   await logginPageTest.fillPasswordInput(password);
  //   await logginPageTest.checkSaveForFuture();
  //   await logginPageTest.login(urlForCheck);

  //   try {
  //     await changeRoom.goToView();
  //     await changeRoom.sequenceRoomChange();
  //     // await changeFloor.checkSequence()
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'floor_change_sequence');
  //     throw error;
  //   }
  // });
});
