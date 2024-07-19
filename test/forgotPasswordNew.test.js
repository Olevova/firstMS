const ForgotPassword = require('../src/classes/auth/forgotPassword');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const { createWebdriverChrom } = require('../src/utils/webdriver');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const makeScreenshot = require('../src/utils/makeScreenShot');
const should = require('chai').should();
const checkEmailsFromAddress = require('../src/utils/mailCheck');

describe('Forgot password chrome, test-case # 3 in the SU', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const searchText = 'Reset Password';
  const sendMailDate = new Date();
  // const comperaUrl = 'http://localhost:4200/login';

  beforeEach(async () => {
    try {
      driverChrome = await createWebdriverChrom();
    } catch (error) {
      console.log(error.message);
    }
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('forgot passsord Coloradojob chrome', async () => {
    await lambdaParameters('forgot passsord Coloradojob chrome', driverChrome)
    const forgotPasswordTest = new ForgotPassword(driverChrome);

    await forgotPasswordTest.openFogotPasswordForm(config.urlLoginPage);
    await forgotPasswordTest.changePassword(config.emailSU);
    await forgotPasswordTest.changePasswordSubmit();

    // waiting mail
    await driverChrome.sleep(5000);

    try {
      await checkEmailsFromAddress(config.emailForTest, searchText)
        .then(result => {
          if (result === false) {
            console.log('Dont get Link', result);

            throw new Error('Dont get Link');
          } else if (new Date(result) > sendMailDate) {
            console.log(
              'Compare time send mail and get mail',
              new Date(result),
              sendMailDate
            );
            return;
          } else {
            console.log('Date of receiving:', new Date(result), sendMailDate);
            throw new Error('Dont get mail');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      throw Error('message didnt send');
    }

    const currentUrl = await forgotPasswordTest.currentUrl();
    console.log(currentUrl);
    //   await driverChrome.manage().getCookie().then(function(cookie) {
    //     console.log('cookie details => ', cookie);
    // });
    // const source = await driverChrome.onLogEvent();
    //     console.log(source);

    if (currentUrl !== config.forgotPasswordUrl) {
      makeScreenshot(driverChrome, 'forgotpassword');
      await lambdaParameters('failed', driverChrome)
    }

    currentUrl.should.to.equal(config.forgotPasswordUrl);
    await lambdaParameters('passed', driverChrome)
  });
});
