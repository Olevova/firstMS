const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const MentionUserToArea = require('../src/classes/view/area/mentionUserToArea');
const CheckUserNotificationsList = require('../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Receive notification about mentioning in the comment within the Area by mentioning himself, test case #161.2', async () => {
  // here add parameters for creation
  let driverChrome = null;
  let areaName = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('mentioning himself and check notification', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);
    const checkUserNotificationsList = new CheckUserNotificationsList(
      driverChrome
    );

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await driverChrome.sleep(1000);
      await addUserToComment.goToView(config.projectNameMain, 'admin');
      await addUserToComment.goToSelektTab(config.view);
      await addUserToComment.addUser(config.userCAName);
      areaName = await addUserToComment.goToUserList();
      await checkUserNotificationsList.goToNotificationList();
      await checkUserNotificationsList.checkLastNotification(areaName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      throw error;
    }
  });

  it('Delete yourself from the comments of the area', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await driverChrome.sleep(1000);
      await addUserToComment.goToView(config.projectNameMain, 'admin');
      await addUserToComment.goToSelektTab(config.view);
      //   await addComment.addComment('@Yuliia');

      await addUserToComment.deleteUserFromComment('@Vova CA test1');
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      throw error;
    }
  });
});
