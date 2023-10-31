const { By, until } = require("selenium-webdriver");


class LoginPage {

  constructor(driver, url) {
    this.driver = driver;
    this.url = url
    // this.emailInputLocator = this.driver.findElement(By.id("email"));
    // this.passwordInputLocator = this.driver.findElement(By.id("password"));
    // this.enterButtonLocator = this.driver.findElement(By.id("btn-submit"));
    // this.checkBoxLocator= this.driver.findElement(By.className('checkbox'));
  };

  async openLoginForm(){
    await this.driver.get(this.url);
    await this.driver.wait(until.elementsLocated(By.css("form")), 10000);
  }

  async fillEmailInput(email){
    if(!email){
        throw new Error('no email');
    };
    await this.driver.wait(until.elementsLocated(By.id('email')), 10000);
    const emailInput = await  this.driver.findElement(By.id("email"));
    await emailInput.sendKeys(email);

  };

  async fillPasswordInput(password){
    if(!password){
        throw new Error('no password');
    };
    await this.driver.wait(until.elementsLocated(By.id('password')), 10000);
    const passwordInput = await this.driver.findElement(By.id("password"));
    await passwordInput.sendKeys(password);
  };

  async checkSaveForFuture(){
    const checkForFutureSave =await this.driver.findElement(By.className('checkbox'));
    await checkForFutureSave.click();
  }

  async login(urlForCheck) {
        const enterButton = this.driver.findElement(By.id("btn-submit"));
        const isEnabled = await enterButton.isEnabled();
        if(isEnabled){
            await enterButton.click();
            await this.driver.wait(until.urlIs(urlForCheck),10000);
            // 'https://dev-frontend.colorjob.terenbro.com/system/dashboard'
        } else {
            const errorElement = await this.driver.findElement(By.className('error-message'));
            await this.driver.wait((until.elementsLocated(By.className('error-message'))), 3000);
            throw new Error(await errorElement.getText());
        }
}

};

module.exports = LoginPage;