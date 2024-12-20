const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Unit tests @S023a0c9b', async () => {
  let driverChrome = null;
  const unitName = 'first';
  const editName = 'firstEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Edit unit name by clicking on it @T8aa7c967', async () => {
    await lambdaParameters('Edit unit name by clicking on it', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editUnit = new CreateUnit(driverChrome);

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
