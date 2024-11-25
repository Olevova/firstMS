const { By } = require('selenium-webdriver');

module.exports = {
  
  statusNewStatusList: By.css('ul.additional-statuses-list'),
  statusAllColorsEl: By.css('.additional-statuses-list__item'),
  statusInput: By.css('.form-input-modal[placeholder="Status Name"]'),
  statusColorBox: By.css('.color-box-with-list-wrapper'),
  statusColorList: By.css('.color-box-with-list-wrapper[open]'),
  statusColorListElements: By.css('.colors-list'),
  statusCustomColors: By.css('.colors-list__item'),
  statusDeleteStatusField: By.id('deleteStatusField'),
  statusNotificationModal: By.css('app-deleting-status-modal'),
  statusDropdownStatusBtn: By.css('.area__status-btn'),
  statusDropdownStatusItem: By.css('.area__status-menu__item p'),
  statusViewAreaStatusItem: By.css('.view-area-status__item'),
  statusColorBoxVisible: By.css('.colors-list[style="visibility: visible; opacity: 1;"]'),
  statusFormCreate: By.css('.backdrop .form-invite.form-create'),
  statusEroorBtn: By.css('.area__status-btn[iserror="true"]'),
  statusPanelList: By.css('ul.additional-statuses-list .additional-statuses-list__item'),
  statusElMark: By.css('.view-area-status__mark'),
  
  weightAreaWeightBtn: By.css('.area__weight-btn'),
  weightAreaWeightMenuText: By.css('.area__weight-menu__text')
};