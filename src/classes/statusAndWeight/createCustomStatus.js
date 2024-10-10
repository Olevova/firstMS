const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateCustomStatus extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async creatCustomStatus(name, color = 1) {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
        until.elementLocated(By.css('.backdrop .form-invite.form-create')),
        10000
    );

    const addStatusBtn = await this.driver.findElement(By.id('addAreaField'));
    await this.driver.wait(until.elementIsEnabled(addStatusBtn), 10000);
    await this.driver.sleep(1000);
    await addStatusBtn.click();

    await this.driver.wait(
        until.elementLocated(By.css('ul.additional-statuses-list')),
        10000
    );
    await this.driver.sleep(500);
    
    const newStatusList = await this.driver.findElement(
        By.css('ul.additional-statuses-list')
    );
    const allColorsEl = await newStatusList.findElements(By.css('.additional-statuses-list__item'));
    let chekColor
    for (let colorEl of allColorsEl) {
      
        const statusInput = await colorEl.findElement(
            By.css(".form-input-modal[placeholder='Status Name']")
        );
        
        const value = await statusInput.getAttribute('value');
        if (!value) {
            await statusInput.sendKeys(name);
            await this.driver.sleep(500);
            
            await colorEl.findElement(By.css('.color-box-with-list-wrapper')).click();
            await this.driver.wait(until.elementLocated(By.css('.colors-list[open="true"]')), 10000);
            const colorList = await this.driver.findElement(By.css('.colors-list[open="true"]'));           
            const customColors = await colorList.findElements(By.css('.colors-list__item'));
            if (color) {
                await customColors[color].click();
                chekColor = await customColors[color].getAttribute('style')
            } else {
                for (let colorInList of customColors) {
                    if (await colorInList.getAttribute('inuse') === 'false') {
                        chekColor = await colorInList.getAttribute('style')
                        await colorInList.click();
                        break;
                    }
                }
            }
            break;
        }
    }

    await this.driver.sleep(1000);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await this.driver.wait(until.elementIsVisible(submitBtn), 10000);
    await submitBtn.click();
    return chekColor
}

  async checkCreateStatus(name) {
    await this.notificationCheck();
    await this.checkCreateItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(500);
  }
}

module.exports = CreateCustomStatus;
