const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const MentionUserToArea = require('../../src/classes/view/area/mentionUserToArea');
const CheckUserNotificationsList = require('../../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;
  let areaName = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Mention user to the area comment @T54377cb7', async () => {
    await lambdaParameters('mention user to the area comment', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addUserToComment.goToView(config.projectNameMain);
      await addUserToComment.goToSelectTab('view');
      await addUserToComment.addUser(config.userCAName);
      areaName = await addUserToComment.goToUserList();
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Check receive notification about mentioning in the comment within the Area  @T803b9e0b', async () => {
    await lambdaParameters(
      'Check receive notification about mentioning in the comment within the Area',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkUserNotificationsList = new CheckUserNotificationsList(
      driverChrome
    );

    await logginPageTest.userLogIn(config.emailCA, config.passwordCA, null);

    try {
      await checkUserNotificationsList.goToNotificationList();
      await checkUserNotificationsList.checkLastNotification(areaName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_notification');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete mention user @Td1d85a20', async () => {
    await lambdaParameters('Delete mention user', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addUserToComment.goToView(config.projectNameMain);
      await addUserToComment.goToSelectTab('view');

      await addUserToComment.deleteUserFromComment('@Vova CA test1');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'mention_user_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
