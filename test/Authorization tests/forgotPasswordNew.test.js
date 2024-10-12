const ForgotPassword = require('../../src/classes/auth/forgotPassword');
const LoginPage = require('../../src/classes/auth/login');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const checkEmailsFromAddress = require('../../src/utils/mailCheck');
const chai = require('chai');
const { By, until } = require('selenium-webdriver');

describe('Authorization tests @Se24225b7', async () => {
  let driverChrome = null;

  const searchText = "Here's a link to";
  const sendMailDate = new Date();

  beforeEach(async () => {
    try {
      driverChrome = await createWebdriverChrome();
    } catch (error) {
      console.log(error.message);
    }
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Forgot password - enter valid email @T6825b92c', async () => {
    await lambdaParameters('Forgot password - enter valid email', driverChrome);
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

    if (currentUrl !== config.forgotPasswordUrl) {
      makeScreenshot(driverChrome, 'forgotpassword');
      await lambdaParameters('failed', driverChrome);
    }

    currentUrl.should.to.equal(config.forgotPasswordUrl);
    await lambdaParameters('passed', driverChrome);
  });

  it('Forgot password - invalid format email @Tf732cd02', async () => {
    await lambdaParameters('Forgot password - invalid format email @Tf732cd02', driverChrome);
    const forgotPasswordTest = new ForgotPassword(driverChrome);
    try {
    await forgotPasswordTest.openFogotPasswordForm(config.urlLoginPage);
    await forgotPasswordTest.changePassword(config.wrongEmailFormat);
    await forgotPasswordTest.clickElement(config.linkSubmitBtnCss);
    const errorMsg = await forgotPasswordTest.authFormErrorMsg()
    if(errorMsg){
      console.log('Test passed');
    }
    else{
      throw new Error ('Test failed');
    }
    await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'invalid_format_email_test');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("Forgot password - don't change, but login with old password @T309ab760", async () => {
    await lambdaParameters("Forgot password - don't change, but login with old password @T309ab760", driverChrome);
    const forgotPasswordTest = new ForgotPassword(driverChrome);
    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  
      
    try {
      await forgotPasswordTest.openFogotPasswordForm(config.urlLoginPage);
      await loginPageTest.clickElement(config.locatorCancelLinkLoginCss);
      await loginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'login_with_old_password_test');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("Forgot password - cancel @T7a675d87", async () => {
    await lambdaParameters("Forgot password - cancel @T7a675d87", driverChrome);
    const forgotPasswordTest = new ForgotPassword(driverChrome);
    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  
      
    try {
      await forgotPasswordTest.openFogotPasswordForm(config.urlLoginPage);
      await loginPageTest.clickElement(config.locatorCancelLinkLoginCss);
      const loginPage =  await driverChrome.wait(until.urlIs(config.urlLoginPage), 3000).catch(()=>null);
      if(null){
        throw new Error('Test failed, check screenshot')
      }
      console.log('Test passed');
      await lambdaParameters('passed', driverChrome);
      
    } catch (error) {
      await makeScreenshot(driverChrome, 'forgot_password_cancel');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
