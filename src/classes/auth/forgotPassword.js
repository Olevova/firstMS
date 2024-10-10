const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class ForgotPassword extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async openFogotPasswordForm(page) {
    await this.driver.get(page);
    await this.driver.wait(
      until.elementLocated(By.id('linkForgotPassword')),
      10000
    );
    const forgotPaswordBtn = await this.driver.findElement(
      By.id('linkForgotPassword')
    );
    await forgotPaswordBtn.click();
  }

  async changePassword(email) {
    await this.driver.wait(until.elementLocated(By.id('email')),10000);
    const emailInputLocator = this.driver.findElement(By.id('email'));
    await emailInputLocator.sendKeys(email);
  }

  async changePasswordCancel() {
    const cancelLinkLocator = this.driver.findElement(By.id('linkCancel'));
    await cancelLinkLocator.click();

    const currentUrl = await this.driver.getCurrentUrl();
    console.log(currentUrl);
  }

  async changePasswordSubmit() {
    const submitLincLocator = this.driver.findElement(By.id('btn-submit'));
    await submitLincLocator.click();

    const formError = await this.driver
      .wait(until.elementLocated(By.id('mainErrorText')), 1000)
      .catch(() => null);
    if (formError) {
      console.log('Error element exists:', formError);
      throw new Error('You have error, check screenshot');
    }
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );
    await this.driver.wait(until.elementIsVisible(windowHandles), 10000);

    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('Such company is created');
    } else {
      console.log(windowHandlesText);
    }
  }

  async currentUrl() {
    const currentUrl = await this.driver.getCurrentUrl();
    return currentUrl;
  }

  async changePasswordOwnUser(oldPassword, newPassword) {
    await this.clickElement('#btnChangePassword');
    await this.driver.wait(until.elementLocated(By.css('.backdrop .modal')),10000);
    await this.driver.wait(until.elementLocated(By.id('btnSave')),10000)
    const saveBtn = await this.driver.findElement(By.id('btnSave'));
    await this.driver.wait(until.elementLocated(By.id('currentPassword')),10000);
    const currentPassword = await this.driver.findElement(
      By.id('currentPassword')
    );
    await currentPassword.sendKeys(oldPassword);
    await this.driver.wait(until.elementLocated(By.id('newPassword')),10000);
    const passwordForChange = await this.driver.findElement(By.id('newPassword'));
    await passwordForChange.sendKeys(newPassword);
    await this.driver.sleep(500);
    await this.driver.wait(until.elementLocated(By.id('confirmPassword')),10000);
    const confirmPassword = await this.driver.findElement(
      By.id('confirmPassword')
    );
    await confirmPassword.sendKeys(newPassword);
    await this.driver.wait(until.elementIsEnabled(saveBtn),10000);
    await saveBtn.click();
    await this.notificationCheck();
  }

  async authFormErrorMsg(){
    const errors = await this.formErrorMsgArray();
    if(errors){
      for(let er of errors){
        console.log(er);
      }
      return true
    }
    return false
  }
}

module.exports = ForgotPassword;
