const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const AddCommentToArea = require('../src/classes/view/area/addCommentToArea');
const ChangeAreaStatus = require('../src/classes/view/area/changeAreaStatusInView');
const CheckHistoryStatus = require('../src/classes/view/area/checkStatusHistory');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../src/utils/config');

describe('Add, edit, delete comment to the Area and check history Status in the View tab in the chrom browser, test-cases #119,122,123,125,124,126, 120.1', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('add, edit, delete comment to the area', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new AddCommentToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlLoginPage);

    try {
      await addComment.goToView(config.projectNameMain);
      await addComment.goToSelektTab(config.view);
      await addComment.addComment('Hi its test comment');
      await addComment.editComment('Hi its test comment', 'edit comment');
      await addComment.deleteComment('edit comment');
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      throw error;
    }
  });

  it(' change area status in view and check history', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const checkhistory = new CheckHistoryStatus(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusToDoOnInProgress();
      await checkhistory.checkHistory(config.toDo);
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await checkhistory.checkHistory(config.inProgress);
    } catch (error) {
      await makeScreenshot(driverChrome, 'history_area_status');
      throw error;
    }
  });
});
