const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateCustomStatus = require('../src/classes/statusAndWeight/createCustomStatus');
const DeleteCustomStatus = require('../src/classes/statusAndWeight/deleteCustomStatus');
const EditCustomStatus = require('../src/classes/statusAndWeight/editCustomStatus');
const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Create, edit, remove custom status, test-cases #133, 134, 144.1, 133.1, 141, 141.2', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const status = 'test';
  const newstatus = 'test2';
  const color = 1;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create custom status', async () => {
    await lambdaParameters('create custom status', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createStatus = new CreateCustomStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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

  it('edit custom status', async () => {
    await lambdaParameters('edit custom status', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editStatus = new EditCustomStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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

  it('Add a custom status to the area and after delete it', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'Add a custom status to the area and after delete it',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const deleteStatus = new DeleteCustomStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);
    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusOnCustomStatus(newstatus);
      await changeAreaStatus.closeAreaModalWindow();
      await deleteStatus.deleteCustomStatus();
      await deleteStatus.checkDeleteStatus(newstatus);
      // await changeAreaStatus.findAreaInView('1');
      // await changeAreaStatus.changeStatusOnCustomStatus(config.toDo);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_try_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  // it('delete custom status', async () => {
  //   await lambdaParameters('delete custom status',driverChrome);
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const deleteStatus = new DeleteCustomStatus(driverChrome);

  //   await logginPageTest.openLoginForm();
  //   await logginPageTest.fillEmailInput(config.email);
  //   await logginPageTest.fillPasswordInput(config.password);
  //   await logginPageTest.checkSaveForFuture();
  //   await logginPageTest.login(config.urlhomePageForCheck);

  //   try {
  //     await deleteStatus.goToView(config.projectNameMain);
  //     await deleteStatus.deleteCustomStatus();
  //     await deleteStatus.checkDeleteStatus(status);
  //     await lambdaParameters('passed',driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'custom_status_delete');
  //     await lambdaParameters('failed',driverChrome);
  //     throw error;
  //   }
  // });
});
