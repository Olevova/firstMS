const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorNotification = require('../../utils/locators/locatorNotification');
const locatorsCommon = require('../../utils/locators/locatorsCommon'); 

class CheckUserNotificationsList extends Base {
  async lastNotificationInSeconds(string) {
    const arrayDate = string.split(' ');
    switch (arrayDate[1]) {
      case 'seconds':
        return Number(arrayDate[0]);
      case 'minutes':
        return Number(arrayDate[0]) * 60;
      default:
        throw new Error('No valid time unit specified in the notification');
    }
  }
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToNotificationList() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementLocated(locatorNotification.notificationsBtn),
      10000
    );
    const notificationsMenuBtn = await this.driver.findElement(
      locatorNotification.notificationsBtn
    );
    await notificationsMenuBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorNotification.notificationsListWrapper),
      1000
    );
  }

  async checkLastNotification(notificationtext) {
    await this.driver.wait(
      until.elementsLocated(locatorNotification.notificationListItem),
      10000
    );
    this.waitListDate('.notifications-list__item', 3);
    const allNotifications = await this.driver.findElements(
      locatorNotification.notificationListItem
    );
    const lastNotificatio = await allNotifications[0];
    const idOfItem = await lastNotificatio.findElement(locatorNotification.publicId);
    const timeOfLastNotification = await lastNotificatio.findElement(
      locatorNotification.notifInfoTime
    );
    const second = await this.lastNotificationInSeconds(
      await timeOfLastNotification.getText()
    );
    console.log(
      await idOfItem.getText(),
      await timeOfLastNotification.getText(),
      second,
      notificationtext
    );
    if (second < 60 && (await idOfItem.getText()) === notificationtext) {
      console.log('test notification passed successfully');
    } else {
      throw new Error('test notification failed');
    }
  }
}

module.exports = CheckUserNotificationsList;
