const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCustomStatus = require('../../src/classes/statusAndWeight/createCustomStatus');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { error } = require('selenium-webdriver');

describe('Project view tests, @S1a26e659', async () => {
  let driverChrome = null;

  const status = 'test';
  const newstatus = 'test2';
  const textError = 'Progress not change, please check screenshot'

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create custom status @T8eb4bd33', async () => {
    await lambdaParameters('create custom status', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createStatus = new CreateCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createStatus.goToView(config.projectNameMain);
      await createStatus.creatCustomStatus(status);
      await createStatus.checkCreateStatus(status);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('edit custom status @Tcb08d45c', async () => {
    await lambdaParameters('edit custom status', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editStatus = new CreateCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editStatus.goToView(config.projectNameMain);
      await editStatus.editCustomStatus(newstatus);
      await editStatus.checkEditStatus(newstatus);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Add a custom status to the area and after delete it @Tf183799e', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Add a custom status to the area and after delete it',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new CreateArea(driverChrome);
    const deleteStatus = new CreateCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.checkStartProgressProjectPercent();
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusOnCustomStatus(newstatus);
      await changeAreaStatus.closeAreaModalWindow();
      const result = await changeAreaStatus.comparisonOfProgress().catch(error=>error.message);     
      if(result !== textError){
        throw new Error ('Test failed, Project Progress changed')
      }
      await deleteStatus.deleteCustomStatus();
      await deleteStatus.checkDeleteStatus(newstatus);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_try_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});