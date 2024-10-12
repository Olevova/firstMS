const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const DuplicateFloor = require('../../src/classes/view/floor/duplicateFloor');
const DeleteFloor = require('../../src/classes/view/floor/deleteFloor');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Floors tests @S85063df9', async () => {
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

  it('duplicate floor @Ta32b9177', async () => {
    await lambdaParameters('duplicate floor', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateFloorInProject = new DuplicateFloor(driverChrome);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await duplicateFloorInProject.goToView(config.projectNameMain);
      duplicateFloorName = await duplicateFloorInProject.duplicateFloor();
      await deleteFloor.deleteFloor(duplicateFloorName);
      await deleteFloor.checkDeleteFloor(duplicateFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_duplicate');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
