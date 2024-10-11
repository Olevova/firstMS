const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const EditUnit = require('../../../classes/view/unit/editUnit');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');

describe('Unit tests @S023a0c9b', async () => {
  let driverChrome = null;
  const unitName = 'First';
  const editName = 'FirstEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Edit Unit name by clicking on it @T8aa7c967', async () => {
    await lambdaParameters('Edit Unit name by clicking on it', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editUnit = new EditUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

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
