const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const EditUnit = require('../src/classes/view/unit/editUnit');

const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
// const { nanoid } = require('nanoid');

describe('Edit Unit name by clicking on it, test-cases testomat (Edit unit name double click)', async () => {
  // here add parameters for creation
  let driverChrome = null;
  const unitName = 'First';
  const editName = 'FirstEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Edit Unit name by clicking on it', async () => {
    await lambdaParameters('Edit Unit name by clicking on it', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editUnit = new EditUnit(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await editUnit.goToView(config.projectNameEdit);
      await editUnit.editUnitByClick(unitName, editName);
      await editUnit.checkCreateUnit(editName);
      await editUnit.editUnitByClick(editName, unitName);
      await editUnit.checkCreateUnit(unitName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_edit_by_click');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
