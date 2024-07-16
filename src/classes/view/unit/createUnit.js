const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class CreateUnit extends Base {
  async createForm(driver) {
    const firstUnitForm = await driver
      .wait(
        until.elementLocated(
          By.css('form.form-create-unit-instead-btn[openedunit="true"]')
        ),
        3000
      )
      .catch(() => null);
    if (firstUnitForm !== null) {
      const inputUnit = await firstUnitForm.findElement(
        By.id('createUnitInput')
      );
      await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    } else {
      await this.driver.wait(
        until.elementLocated(By.id('createNewUnit')),
        10000
      );
      const createBtn = this.driver.findElement(By.id('createNewUnit'));
      await this.driver.wait(until.elementIsEnabled(createBtn), 10000);
      await createBtn.click();
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async createUnit(unit) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.wait(until.elementsLocated(By.css('head style')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    const addUnitBtn = await this.driver.findElement(By.id('addUnit'));
    await this.driver.wait(until.elementIsEnabled(addUnitBtn), 10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnitBtn).perform();
    await addUnitBtn.click();
    await this.createForm(this.driver);

    await this.driver.wait(
      until.elementLocated(By.id('createUnitInput')),
      10000
    );
    const unitInput = await this.driver.findElement(By.id('createUnitInput'));
    await unitInput.sendKeys(unit);
    await this.driver.wait(until.elementLocated(By.id('createUnitBtn')), 10000);
    const submitBtn = await this.driver.findElement(By.id('createUnitBtn'));
    await this.driver.wait(until.elementIsEnabled(submitBtn), 10000);
    await submitBtn.click();
  }

  async checkCreateUnit(unit) {
    await this.driver.sleep(1000);
    await this.checkCreateItem('.unit-name-wrapper p', unit);
  }
}

module.exports = CreateUnit;
