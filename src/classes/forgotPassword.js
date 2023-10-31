const {By, until} = require('selenium-webdriver');



class ForgotPassword {

    constructor(driver){

        this.driver = driver;
        
    };

    async openFogotPasswordForm(page){

        await this.driver.get(page);
        await this.driver.wait(until.elementLocated(By.id('linkForgotPassword')),10000);
        const forgotPaswordBtn = await this.driver.findElement(By.id('linkForgotPassword'));
        await forgotPaswordBtn.click();
    };

    async changePassword(email){
        const emailInputLocator = this.driver.findElement(By.id("email"));
        await emailInputLocator.sendKeys(email);
       
    };

    async changePasswordCancel(){
       
        const cancelLinkLocator = this.driver.findElement(By.id("linkCancel"));
        await cancelLinkLocator.click();
        

        const currentUrl = await this.driver.getCurrentUrl()
        console.log(currentUrl);
    };

    async changePasswordSubmit(){
        const submitLincLocator = this.driver.findElement(By.id('btn-submit'));
        await submitLincLocator.click();

    }

    async currentUrl(){
        const currentUrl = await this.driver.getCurrentUrl()
        return currentUrl
    };

    async changePasswordSubnit(){
        const submitBtnLocator = this.driver.findElement(By.id('btn-submit'));
        await submitBtnLocator.click()
    };

}

module.exports = ForgotPassword;