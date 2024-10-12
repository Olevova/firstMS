const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const AddCommentToArea = require('../../src/classes/view/area/addCommentToArea');
const ChangeAreaStatus = require('../../src/classes/view/area/changeAreaStatusInView');
const CheckHistoryStatus = require('../../src/classes/view/area/checkStatusHistory');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add comments to area @Te48e75b5', async () => {
    await lambdaParameters(
      'add, edit, delete comment to the area',
      driverChrome
    );
    // if (process.env.RUNNING_IN_TEAMCITY || process.env.RUNNING_IN_DOCKER){
    //   let testname = 'add, edit, delete comment to the area'
    //   await driverChrome.executeScript(`lambda-name=${testname}`);
    // }
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new AddCommentToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameMain);
      await addComment.goToSelectTab(config.view);
      await addComment.addComment('Hi its test comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Edit comment in area @T89c8c945', async () => {
    await lambdaParameters('edit comment to the area', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new AddCommentToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameMain);
      await addComment.goToSelectTab(config.view);
      await addComment.openAreasWithComment();
      await addComment.editComment('Hi its test comment', 'edit comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete comment in area @T6a9b6305', async () => {
    await lambdaParameters('delete comment from the area', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new AddCommentToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameMain);
      await addComment.goToSelectTab(config.view);
      await addComment.openAreasWithComment();
      await addComment.deleteComment('edit comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Change status from To-Do to In-progress @T0c860984', async () => {
    await lambdaParameters(
      'change area status in view and check history',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatus(driverChrome);
    const checkhistory = new CheckHistoryStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatus.goToView(config.projectNameMain);
      await changeAreaStatus.findAreaInView();
      await changeAreaStatus.changeStatusToDoOnInProgress();
      await checkhistory.checkHistory(config.toDo);
      await changeAreaStatus.changeStatusInProgressOnToDo();
      await checkhistory.checkHistory(config.inProgress);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'history_area_status');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
