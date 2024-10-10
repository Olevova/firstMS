const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const DeleteFloor = require('../../src/classes/view/floor/deleteFloor');
const EditFloor = require('../../src/classes/view/floor/editFloor');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Floors tests @S85063df9', async () => {
  let driverChrome = null;


  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add a floor with valid name', async () => {
    await lambdaParameters('Add a floor with valid name', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createFloor.goToView(config.projectNameEdit);
      await createFloor.createFloor(config.newFloorName);
      await createFloor.checkFloorCreation(config.newFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Edit floor name', async () => {
    await lambdaParameters('Edit floor name', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editFloor = new EditFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editFloor.goToView(config.projectNameEdit);
      await editFloor.editFloor(config.newFloorName, config.editFloorName);
      await editFloor.checkFloorCreation(config.editFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete floor in case this is not the last one', async () => {
    await lambdaParameters(
      'Delete floor in case this is not the last one',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await deleteFloor.goToView(config.projectNameEdit);
      await deleteFloor.deleteFloor(config.editFloorName);
      await deleteFloor.checkDeleteFloor(config.editFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
