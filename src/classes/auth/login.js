const {until } = require('selenium-webdriver');
const Base = require("../base");
const locatorsLogin = require('../../utils/locators/locatorsLogin');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const config = require('../../utils/config');

class LoginPage extends Base {
  constructor(driver, url) {
    super(driver);
    this.driver = driver;
    this.url = url;
  }

  async authFormErrorMsg() {
    const errors = await this.formErrorMsgArray();
    if (errors) {
      for (let er of errors) {
        console.log(er);
      }
      return true;
    }
    return false;
  }

  async changePassword(email) {
    await this.driver.wait(until.elementLocated(locatorsLogin.authEmailId), 10000);
    const emailInputLocator = this.driver.findElement(locatorsLogin.authEmailId);
    await emailInputLocator.sendKeys(email);
  }

  async changePasswordCancel() {
    const cancelLinkLocator = this.driver.findElement(locatorsLogin.authCancelId);
    await cancelLinkLocator.click();

    const currentUrl = await this.driver.getCurrentUrl();
    console.log(currentUrl);
  }

  async changePasswordOwnUser(oldPassword, newPassword) {
    await this.clickElement('#btnChangePassword');
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdropAndModalCss), 10000);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseSaveBtn), 10000);
    const saveBtn = await this.driver.findElement(locatorsCommon.baseSaveBtn);
    await this.driver.wait(until.elementLocated(locatorsLogin.authCurrentPasswordId), 10000);
    const currentPassword = await this.driver.findElement(locatorsLogin.authCurrentPasswordId);
    await currentPassword.sendKeys(oldPassword);
    await this.driver.wait(until.elementLocated(locatorsLogin.authNewPasswordId), 10000);
    const passwordForChange = await this.driver.findElement(locatorsLogin.authNewPasswordId);
    await passwordForChange.sendKeys(newPassword);
    await this.driver.sleep(500);
    await this.driver.wait(until.elementLocated(locatorsLogin.authConfirmPasswordId), 10000);
    const confirmPassword = await this.driver.findElement(locatorsLogin.authConfirmPasswordId);
    await confirmPassword.sendKeys(newPassword);
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
    await this.notificationCheck();
  }

  async changePasswordSubmit() {
    const submitLincLocator = this.driver.findElement(locatorsLogin.authBtnSubmitId);
    await submitLincLocator.click();

    const formError = await this.driver
      .wait(until.elementLocated(locatorsLogin.authMainErrorId), 1000)
      .catch(() => null);
    if (formError) {
      console.log('Error element exists:', formError);
      throw new Error('You have error, check screenshot');
    }
    const windowHandles = await this.driver.findElement(locatorsCommon.baseNotificationClass);
    await this.driver.wait(until.elementIsVisible(windowHandles), 10000);

    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('Such company is created');
    } else {
      console.log(windowHandlesText);
    }
  }

  async checkSaveForFuture() {
    const checkForFutureSave = await this.driver.findElement(locatorsLogin.authCheckBoxClass);
    await checkForFutureSave.click();
  }

  async currentUrl() {
    const currentUrl = await this.driver.getCurrentUrl();
    return currentUrl;
  }

  async fillEmailInput(email) {
    if (!email) {
      throw new Error('no email');
    }
    
    await this.driver.wait(until.elementLocated(locatorsLogin.authEmailId), 10000);
    const emailInput = await this.driver.findElement(locatorsLogin.authEmailId);
    await emailInput.sendKeys(email);
  }

  async fillPasswordInput(password) {
    if (!password) {
      throw new Error('no password');
    }

    await this.driver.wait(until.elementLocated(locatorsLogin.authPasswordId), 10000);
    const passwordInput = await this.driver.findElement(locatorsLogin.authPasswordId);
    await passwordInput.sendKeys(password);
  }

  async findUserMenu() {
    await this.driver.executeScript('return document.readyState');
    const profileMenu = this.driver.findElement(locatorsLogin.authProfileUserBtnId);
    await this.driver.wait(until.elementIsVisible(profileMenu), 10000);
    await profileMenu.click();
  }

  async login(urlForCheck) {
    const enterButton = this.driver.findElement(locatorsLogin.authBtnSubmitId);
    const isEnabled = await enterButton.isEnabled();

    if (isEnabled) {
      await enterButton.click();
      await this.driver.wait(until.urlContains(urlForCheck), 10000);
    } else {
      const errorElement = await this.driver.findElement(locatorsCommon.baseErrorClass);
      await this.driver.wait(until.elementLocated(locatorsCommon.baseErrorClass), 3000);
      throw new Error(await errorElement.getText());
    }
  }

  async loginWithoutCheckingURL() {
    const enterButton = this.driver.findElement(locatorsLogin.authBtnSubmitId);
    const isEnabled = await enterButton.isEnabled();

    if (isEnabled) {
      await enterButton.click();
      await this.driver.wait(until.urlContains(config.matchUrl), 10000);
    } else {
      const errorElement = await this.driver.findElement(locatorsCommon.baseErrorClass);
      await this.driver.wait(until.elementLocated(locatorsCommon.baseErrorClass), 3000);
      throw new Error(await errorElement.getText());
    }
  }

  async openFogotPasswordForm(page) {
    await this.driver.get(page);
    await this.driver.wait(until.elementLocated(locatorsLogin.authForgotPasswordId), 10000);
    const forgotPaswordBtn = await this.driver.findElement(locatorsLogin.authForgotPasswordId);
    await forgotPaswordBtn.click();
  }

  async openLoginForm() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(locatorsLogin.authForm), 10000);
    if(config.baseUrl === config.baseUrlDev){
      await this.driver.wait(until.elementLocated(locatorsLogin.authVersionTextCss),10000);
      const versionEl = await this.driver.findElement(locatorsLogin.authVersionTextCss);
      await this.driver.wait(until.elementTextMatches(versionEl,/^V\d+/), 10000);
    }
    else {
      this.driver.sleep(500)
    }
    
  }

  async userLogIn(email, password, urlForCheck, saveForFuter = false) {
    try {
      await this.openLoginForm();
      await this.fillEmailInput(email);
      await this.fillPasswordInput(password);
      if (saveForFuter) {
        await this.checkSaveForFuture();
      }
      if (urlForCheck) {
        await this.login(urlForCheck);
      } else {
        await this.loginWithoutCheckingURL();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async userLogOut(urlLogin) {
    await this.driver.wait(until.elementLocated(locatorsLogin.authBtnLogoutId), 10000);
    const logOutBtn = this.driver.findElement(locatorsLogin.authBtnLogoutId);
    await this.driver.wait(until.elementIsVisible(logOutBtn), 10000);
    await logOutBtn.click();
    await this.driver.wait(until.urlIs(urlLogin), 10000);
  }
}

module.exports = LoginPage;
