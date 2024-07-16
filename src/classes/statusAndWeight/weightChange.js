const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class WeightChange extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.selectStatusName = '';
  }

  async findeWeightAndChangeIt(weight = 'medium') {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    const weightDropDown = await this.driver.findElement(By.css('.area__weight-btn'));
    await weightDropDown.click();
    const weightList = await this.driver.findElements(
      By.css('.area__weight-menu__text')
    );
    await this.findDateInDropDown(await weightList, weight);
    await this.notificationCheck();
    
  }

  async closeAreaAndCheckProgress() {
    const closeAreaBtn = await this.driver.findElement(By.id('btnCloseModal'));
    await this.driver.wait(until.elementIsEnabled(closeAreaBtn));
    await closeAreaBtn.click();
    await this.driver.wait(
      until.elementLocated('backdrop[show="false"]'),
      10000
    );
  }
}

module.exports = WeightChange;
