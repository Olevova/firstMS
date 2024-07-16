const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const MentionUserToArea = require('../src/classes/view/area/mentionUserToArea');
const CheckUserNotificationsList = require('../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Mention user to the area comment and after delete in the View tab, and receive notification about mentioning in the chrom browser, test-cases #120 , 160 in the CA', async () => {
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

  it('mention user to the area comment', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await addUserToComment.goToView(config.projectNameMain);
      await addUserToComment.goToSelektTab('view');
      await addUserToComment.addUser(config.userCAName);
      areaName = await addUserToComment.goToUserList();
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      throw error;
    }
  });

  it('Check receive notification about mentioning in the comment within the Area ', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkUserNotificationsList = new CheckUserNotificationsList(
      driverChrome
    );
    // const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.loginWithoutCheckingURL();

    try {
      await checkUserNotificationsList.goToNotificationList();
      await checkUserNotificationsList.checkLastNotification(areaName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_notification');
      throw error;
    }
  });

  it('Delete mention user', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await addUserToComment.goToView(config.projectNameMain);
      await addUserToComment.goToSelektTab('view');
      //   await addComment.addComment('@Yuliia');

      await addUserToComment.deleteUserFromComment('@Vova CA test1');
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      throw error;
    }
  });
});
