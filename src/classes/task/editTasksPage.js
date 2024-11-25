const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class EditTaskPage extends Base{
    constructor(driver){
        super(driver);
        this.driver = driver;
        this.editTaskHeader = By.xpath("//p[contains(text(),'Edit Task')]");
        this.taskNameField = By.id("taskNameMobile");
    }

    async isEditPageOpen(){
        await this.driver.wait(
            until.elementLocated(this.editTaskHeader),3000);
         await this.driver.findElement(this.editTaskHeader).isDisplayed();
         await this.driver.findElement(this.taskNameField).isDisplayed();
        return true;
    };


};
module.exports = EditTaskPage;
    