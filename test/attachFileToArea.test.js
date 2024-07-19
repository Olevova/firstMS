const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const AddFileToArea = require('../src/classes/view/area/addFileToArea');
const AddCommentToArea = require('../src/classes/view/area/addCommentToArea');
// const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
// const CheckHistoryStatus = require('../src/classes/view/area/checkStatusHistory');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../src/utils/config');

describe('Add attachment to the area and delete atachment in the View tab in the chrom browser', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const attachmentFileName = 'Logo.png'; //use for local test;
  const attachmentFileNameDocker = '_classpath.txt';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('add attachment to the area check it, and delete', async () => {
    await lambdaParameters('add attachment to the area check it, and delete', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new AddFileToArea(driverChrome);
    const deleteAttachment = new AddCommentToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelektTab(config.view);
      await addFile.addFile('photo');
      // for local Use
      // await addFile.checkAttachment(attachmentFileName,'add');
      // for local Use
      await addFile.checkAttachment(attachmentFileNameDocker, 'add');
      await deleteAttachment.deleteComment('photo');
      // for local Use
      // await addFile.checkAttachment(attachmentFileName,'delete');
      // for local Use
      await addFile.checkAttachment(attachmentFileNameDocker, 'delete');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
