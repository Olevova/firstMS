const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class EditCustomStatus extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editCustomStatus(newstatus, color = 2) {
    await this.goToCustomStatusCreateForm();
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const statusInput = await newStatusList.findElement(
      By.css(".form-input-modal[placeholder='Status Name']")
    );
    await this.driver.wait(until.elementIsEnabled(statusInput));
    await statusInput.clear();
    await statusInput.sendKeys(newstatus);
    await newStatusList
      .findElement(By.css('.color-box-with-list-wrapper'))
      .click();
    await this.driver.wait(until.elementLocated(By.css('.colors-list')), 10000);
    const colorList = await this.driver.findElement(
      By.css('.colors-list'),
      10000
    );
    await this.driver.wait(until.elementIsEnabled(colorList), 10000);
    const customColors = await colorList.findElements(
      By.css('.colors-list__item')
    );
    await this.driver.sleep(1000);
    await customColors[color].click();

    await this.driver.sleep(1000);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
  }

  async changeCustomStatusColor(customStatus) {
    await this.goToCustomStatusCreateForm();
    await this.driver.sleep(3000);
    const statusesList = await this.driver.findElements(
      By.css('ul.additional-statuses-list .additional-statuses-list__item')
    );
    for (let status of statusesList) {
      const statusInput = await status.findElement(
        By.css(".form-input-modal[placeholder='Status Name']")
      );
      const statusTitle = await statusInput.getAttribute('value');
      if (customStatus === statusTitle) {
        await status
          .findElement(By.css('.color-box-with-list-wrapper'))
          .click();
        await this.driver.wait(
          until.elementLocated(By.css('.colors-list[style="visibility: visible; opacity: 1;"]')),
          10000
        );
        const colorList = await this.driver.findElement(
          By.css('.colors-list[style="visibility: visible; opacity: 1;"]'),
          10000
        );
        await this.driver.wait(until.elementIsEnabled(colorList), 10000);
        const customColors = await colorList.findElements(
          By.css('.colors-list__item')
        );
        for (let color of customColors) {
          const freeColor = await color.getAttribute('inuse');
          console.log(freeColor, 'freeColor');
          if (freeColor === 'false') {
            const colorStyle = await color.getAttribute('style');
            console.log(freeColor, 'in', colorStyle);
            await this.driver.wait(until.elementIsEnabled(color), 10000);
            const isVisible = await color.isDisplayed();
            const isEnabled = await color.isEnabled();
            console.log(
              isVisible,
              isEnabled,
              await color.getAttribute('disabled'),
              await color.getAttribute('class')
            );
            await this.driver.sleep(1000);
            // await this.driver.executeScript("arguments[0].click();", color);
            await color.click();
            await this.driver.sleep(1000);
            const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
            await this.driver.wait(until.elementIsEnabled(submitBtn), 10000);
            await submitBtn.click();
            return colorStyle;
          }
        }
      }
    }
    throw new Error('Not such custom status');
  }

  async checkCustomStatusAndColor(name, style) {
    await this.notificationCheck();
    const statusesList = await this.driver.findElements(
      By.css('.view-area-status__item')
    );
    for (let status of statusesList) {
      const col = await status
        .findElement(By.css('.view-area-status__mark'))
        .getAttribute('style');
      const statusTitle = await status.getText();
      const statusName = statusTitle.split(' ')[0];
      

      if (statusName === name && style === col) {
        console.log(`Test passed: new color is ${col}`);
        return;
      }
    }
    throw new Error('Test failed');
  }
  async checkEditStatus(name) {
    await this.notificationCheck();
    await this.checkCreateItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(1000);
  }

  async checkStatusFormError(locator) {
    await this.driver.wait(until.elementLocated(By.css(locator)), 3000);
    const errorStatus = await this.driver.findElement(By.css(locator));
    if (errorStatus) {
      console.log('Test passed');
      return;
    }
    throw new Error('Test Failed');
  }
}

module.exports = EditCustomStatus;
