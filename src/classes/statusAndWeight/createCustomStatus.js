const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorStatusWeight = require('../../utils/locators/locatorStatusWeight');

class CreateCustomStatus extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async creatCustomStatus(name, color = 1) {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusFormCreate),
      10000
    );

    const addStatusBtn = await this.driver.findElement(
      locatorsCommon.baseAddAreaBtnId
    );
    await this.driver.wait(until.elementIsEnabled(addStatusBtn), 10000);
    await this.driver.sleep(1000);
    await addStatusBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusNewStatusList),
      10000
    );
    await this.driver.sleep(500);

    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const allColorsEl = await newStatusList.findElements(
      locatorStatusWeight.statusAllColorsEl
    );
    let chekColor;
    for (let colorEl of allColorsEl) {
      const statusInput = await colorEl.findElement(
        locatorStatusWeight.statusInput
      );

      const value = await statusInput.getAttribute('value');
      if (!value) {
        await statusInput.sendKeys(name);
        await this.driver.sleep(500);

        await colorEl.findElement(locatorStatusWeight.statusColorBox).click();
        await this.driver.wait(
          until.elementLocated(locatorStatusWeight.statusColorList),
          10000
        );
        const colorList = await this.driver.findElement(
          locatorStatusWeight.statusColorList
        );
        const customColors = await colorList.findElements(
          locatorStatusWeight.statusCustomColors
        );
        if (color) {
          await customColors[color].click();
          chekColor = await customColors[color].getAttribute('style');
        } else {
          for (let colorInList of customColors) {
            if ((await colorInList.getAttribute('inuse')) === 'false') {
              chekColor = await colorInList.getAttribute('style');
              await colorInList.click();
              break;
            }
          }
        }
        break;
      }
    }

    await this.driver.sleep(1000);
    const submitBtn = await this.driver.findElement(
      locatorsCommon.baseSubmitBtnCss
    );
    await this.driver.wait(until.elementIsVisible(submitBtn), 10000);
    await submitBtn.click();
    return chekColor;
  }

  async checkCreateStatus(name) {
    await this.notificationCheck();
    await this.checkCreateItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(500);
  }

  async deleteAllCustomStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusFormCreate),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusNewStatusList),
      10000
    );
    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const deleteEl = await newStatusList.findElements(
      locatorStatusWeight.statusDeleteStatusField
    );
    for (let del of deleteEl) {
      await del.click();
    }
    const submitBtn = await this.driver.findElement(
      locatorsCommon.baseSubmitBtnCss
    );
    await submitBtn.click();
  }

  async checkProjectHasCustomStatus() {
    await this.notificationCheck();
    const areaStatuses = await this.driver.findElements(
      locatorStatusWeight.statusViewAreaStatusItem
    );
    if ((await areaStatuses.length) > 4) {
      return true;
    }
    return false;
  }

  async deleteCustomStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusFormCreate),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusNewStatusList),
      10000
    );
    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const deleteBtn = await newStatusList.findElement(
      locatorStatusWeight.statusDeleteStatusField
    );
    await this.driver.wait(until.elementIsEnabled(deleteBtn));
    await deleteBtn.click();
    const changeStatusMenu = await this.driver
      .wait(
        until.elementLocated(locatorStatusWeight.statusNotificationModal),
        1000
      )
      .catch(() => null);
    await this.driver.sleep(1000);
    if (changeStatusMenu) {
      await this.driver.wait(
        until.elementLocated(locatorStatusWeight.statusDropdownStatusBtn),
        10000
      );
      const dropdownBtn = await this.driver.findElement(
        locatorStatusWeight.statusDropdownStatusBtn
      );
      await this.driver.wait(until.elementIsEnabled(dropdownBtn));
      await dropdownBtn.click();
      await this.waitListDate('.area__status-menu__item p', 1);
      const dropdownStatus = await this.driver.findElements(
        locatorStatusWeight.statusDropdownStatusItem
      );
      await this.findDateInDropDown(dropdownStatus, 'To Do');
      const delStatusBtn = await this.driver.findElement(
        locatorsCommon.baseDelStatusProjectBtnId
      );
      await delStatusBtn.click();
      await this.notificationCheck();
    }
    const submitBtn = await this.driver.findElement(
      locatorsCommon.baseSubmitBtnCss
    );
    await submitBtn.click();
  }

  async deleteCustomStatusWithoutSelectNewStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusFormCreate),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusNewStatusList),
      10000
    );
    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const deleteBtn = await newStatusList.findElement(
      locatorStatusWeight.statusDeleteStatusField
    );
    await this.driver.wait(until.elementIsEnabled(deleteBtn));
    await deleteBtn.click();
    const changeStatusMenu = await this.driver
      .wait(
        until.elementLocated(locatorStatusWeight.statusNotificationModal),
        1000
      )
      .catch(() => null);
    await this.driver.sleep(1000);
    if (changeStatusMenu) {
      await this.driver.wait(
        until.elementLocated(locatorStatusWeight.statusDropdownStatusBtn),
        10000
      );
      const delStatusBtn = await this.driver.findElement(
        locatorsCommon.baseDelStatusProjectBtnId
      );
      await delStatusBtn.click();
      if (
        await this.driver.wait(
          until.elementLocated(locatorStatusWeight.statusEroorBtn),
          3000
        )
      ) {
        console.log('Test passed');
      }
    }
  }

  async checkDeleteStatus(name) {
    await this.notificationCheck();
    await this.checkDeleteItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(500);
  }

  async inabilityToDeleteStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusFormCreate),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusNewStatusList),
      10000
    );
    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const formHasDeleBtn = await this.driver
      .wait(
        until.elementLocated(locatorStatusWeight.statusDeleteStatusField),
        2000
      )
      .catch(() => null);
    if (formHasDeleBtn) {
      throw new Error('You can delete custom status, test failed');
    } else {
      console.log('passed, you can not delete custom status');
      const cancelBtn = await this.driver.findElement(
        locatorsCommon.baseCancelBtn
      );
      await cancelBtn.click();
    }
  }

  async editCustomStatus(newstatus, color = 2) {
    await this.goToCustomStatusCreateForm();
    const newStatusList = await this.driver.findElement(
      locatorStatusWeight.statusNewStatusList
    );
    const statusInput = await newStatusList.findElement(
      locatorStatusWeight.statusInput
    );
    await this.driver.wait(until.elementIsEnabled(statusInput));
    await statusInput.clear();
    await statusInput.sendKeys(newstatus);
    await newStatusList.findElement(locatorStatusWeight.statusColorBox).click();
    await this.driver.wait(
      until.elementLocated(locatorStatusWeight.statusColorListElements),
      10000
    );
    const colorList = await this.driver.findElement(
      locatorStatusWeight.statusColorListElements,
      10000
    );
    await this.driver.wait(until.elementIsEnabled(colorList), 10000);
    const customColors = await colorList.findElements(
      locatorStatusWeight.statusCustomColors
    );
    await this.driver.sleep(1000);
    await customColors[color].click();

    await this.driver.sleep(1000);
    const submitBtn = await this.driver.findElement(
      locatorsCommon.baseSubmitBtnCss
    );
    await submitBtn.click();
  }

  async changeCustomStatusColor(customStatus) {
    await this.goToCustomStatusCreateForm();
    await this.driver.sleep(3000);
    const statusesList = await this.driver.findElements(
      locatorStatusWeight.statusPanelList
    );
    for (let status of statusesList) {
      const statusInput = await status.findElement(
        locatorStatusWeight.statusInput
      );
      const statusTitle = await statusInput.getAttribute('value');
      if (customStatus === statusTitle) {
        await status.findElement(locatorStatusWeight.statusColorBox).click();
        await this.driver.wait(
          until.elementLocated(locatorStatusWeight.statusColorBoxVisible),
          10000
        );
        const colorList = await this.driver.findElement(
          locatorStatusWeight.statusColorBoxVisible,
          10000
        );
        await this.driver.wait(until.elementIsEnabled(colorList), 10000);
        const customColors = await colorList.findElements(
          locatorStatusWeight.statusCustomColors
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
            const submitBtn = await this.driver.findElement(
              locatorsCommon.baseSubmitBtnCss
            );
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
      locatorStatusWeight.statusViewAreaStatusItem
    );
    for (let status of statusesList) {
      const col = await status
        .findElement(locatorStatusWeight.statusElMark)
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

module.exports = CreateCustomStatus;
