const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateFloor = require('../src/classes/view/floor/createFloor');
const DeleteFloor = require('../src/classes/view/floor/deleteFloor');
const EditFloor = require('../src/classes/view/floor/editFloor');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Create. edit and remove Floor in the chrom browser, test-cases #58, 59, 60', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newFloorName = 'testFloor';
  const editFloorName = 'test2';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new floor', async () => {
    await lambdaParameters('create new floor', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createFloor.goToView();
      await createFloor.createFloor(newFloorName);
      await createFloor.checkFloorCreation(newFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('edit new floor', async () => {
    await lambdaParameters('edit new floor', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editFloor = new EditFloor(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await editFloor.goToView();
      await editFloor.editFloor(newFloorName, editFloorName);
      await editFloor.checkFloorCreation(editFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('delete new floor', async () => {
    await lambdaParameters('delete new floor', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await deleteFloor.goToView();
      await deleteFloor.deleteFloor(editFloorName);
      await deleteFloor.checkDeleteFloor(editFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
