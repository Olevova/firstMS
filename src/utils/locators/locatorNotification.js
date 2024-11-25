const { By } = require('selenium-webdriver');

module.exports = {
  notificationsBtn: By.css('.notifications-btn'),
  notificationsListWrapper: By.css('.notifications-list-wrapper[show="true"]'),
  notificationListItem: By.css('.notifications-list__item'),
  publicId: By.css('.public-id'),
  notifInfoTime: By.css('.notif-info-time'),
};
