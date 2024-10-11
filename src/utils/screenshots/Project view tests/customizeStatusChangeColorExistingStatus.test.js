const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const EditCustomStatus = require('../../../classes/statusAndWeight/editCustomStatus');
const CreateArea = require('../../../classes/view/area/createArea');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');

describe('Project view tests, @S1a26e659', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Customize status - change color of existing status @T7783bf3c', async () => {
    await lambdaParameters('create custom status', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editStatus = new EditCustomStatus(driverChrome);
    const createArea = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editStatus.goToView(config.projectNameEdit);
      const color = await editStatus.changeCustomStatusColor(
        config.statusForEdit
      );
      await editStatus.checkCustomStatusAndColor(config.statusForEdit, color);
      const areaColor = await createArea.returnAreaColor(
        'second',
        'color',
        'bad'
      );
      console.log(areaColor, color, color === areaColor);
      if (color === areaColor) {
        console.log('Test passed, color changed');
      } else {
        throw new Error('Test failed, area color not changed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_color_change');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
