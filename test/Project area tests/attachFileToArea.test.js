const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const AddFileToArea = require('../../src/classes/view/area/addFileToArea');
const AddCommentToArea = require('../../src/classes/view/area/addCommentToArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda,
} = require('../../src/utils/webdriver');
const path = require('path');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;
  let attachmentFileNameDocker = '_classpath.txt';
  // const attachmentFileName = 'Logo.png'; //use for local test;
  if (!withoutLambda) {
    attachmentFileNameDocker = 'Logo.png';
  }

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  const fullPathToAddCommentToArea = path.join(__dirname, '../../src/classes/view/area/AddCommentToArea.js');
  console.log('Full path to AddCommentToArea:', fullPathToAddCommentToArea);

  it('Add attachment to the area @Td1c6313c', async () => {
    await lambdaParameters(
      'add attachment to the area verify it',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new AddFileToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
        console.log('passed');
      } else {
        await addFile.addFile('photo');
        // for local Use
        // await addFile.checkAttachment(attachmentFileName,'add');
        // for local Use

        await addFile.checkAttachment(attachmentFileNameDocker, 'add');
        // for local Use
        // await addFile.checkAttachment(attachmentFileName,'delete');
        // for local Use
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete attachment from the area @T630f4341', async () => {
    await lambdaParameters('delete attachment', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new AddFileToArea(driverChrome);
    const deleteAttachment = new AddCommentToArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
        console.log('passed');
      } else {
        await deleteAttachment.openAreasWithComment();
        await deleteAttachment.deleteComment('photo');
        // for local Use
        // await addFile.checkAttachment(attachmentFileName,'delete');
        // for local Use
        await addFile.checkAttachment(attachmentFileNameDocker, 'delete');
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
