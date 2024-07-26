const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const DuplicateFloor = require('../src/classes/view/floor/duplicateFloor');
const DeleteFloor = require('../src/classes/view/floor/deleteFloor');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Duplicate and delete Floor in the chrom browser, test-case #61', async () => {
  // here add parameters for creation
  let driverChrome = null;

  let duplicateFloorName = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('duplicate floor', async () => {
    await lambdaParameters('duplicate floor', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateFloorInProject = new DuplicateFloor(driverChrome);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await duplicateFloorInProject.goToView(config.projectNameMain);
      duplicateFloorName = await duplicateFloorInProject.duplicateFloor();
      await deleteFloor.deleteFloor(duplicateFloorName);
      await deleteFloor.checkDeleteFloor(duplicateFloorName);
      await lambdaParameters('passed', driverChrome);
      //   await duplicateUnit.deleteDuplicateUnit();
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_duplicate');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
