const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorStatusWeight = require('../../utils/locators/locatorStatusWeight');

class WeightChange extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.selectStatusName = '';
  }

  async findeWeightAndChangeIt(weight = 'medium') {
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseHtml),
      10000
    );
    await this.driver.executeScript('return document.readyState');
    const weightDropDown = await this.driver.findElement(
      locatorStatusWeight.weightAreaWeightBtn
    );
    await weightDropDown.click();
    const weightList = await this.driver.findElements(
      locatorStatusWeight.weightAreaWeightMenuText
    );
    await this.findDateInDropDown(await weightList, weight);
    await this.notificationCheck();
  }

  async closeAreaAndCheckProgress() {
    const closeAreaBtn = await this.driver.findElement(
      locatorsCommon.baseBtnCloseModal
    );
    await this.driver.wait(until.elementIsEnabled(closeAreaBtn));
    await closeAreaBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBacksropShowFalse),
      10000
    );
  }
}

module.exports = WeightChange;
