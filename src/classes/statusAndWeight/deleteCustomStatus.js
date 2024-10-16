const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const { addAbortListener } = require('node-imap');

class DeleteCustomStatus extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async deleteAllCustomStatus(){
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .form-invite.form-create')),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('ul.additional-statuses-list')),
      10000
    );
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const deleteEl = await newStatusList.findElements(By.css('#deleteStatusField'));
    for(let del of deleteEl){
      await del.click();
    }
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
  };

  async checkProjectHasCustomStatus(){
    await this.notificationCheck();
    const areaStatuses = await this.driver.findElements(By.css('.view-area-status__item'));
    if(await areaStatuses.length > 4){
      return true
    }
    return false
  }

  async deleteCustomStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .form-invite.form-create')),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('ul.additional-statuses-list')),
      10000
    );
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const deleteBtn = await newStatusList.findElement(
      By.id('deleteStatusField')
    );
    await this.driver.wait(until.elementIsEnabled(deleteBtn));
    await deleteBtn.click();
    const changeStatusMenu = await this.driver
      .wait(until.elementLocated(By.css('app-deleting-status-modal')), 1000)
      .catch(() => null);
    await this.driver.sleep(1000);
    if (changeStatusMenu) {
      await this.driver.wait(
        until.elementLocated(By.css('.area__status-btn')),
        10000
      );
      const dropdownBtn = await this.driver.findElement(
        By.css('.area__status-btn')
      );
      await this.driver.wait(until.elementIsEnabled(dropdownBtn));
      await dropdownBtn.click();
      await this.waitListDate('.area__status-menu__item p', 1);
      const dropdownStatus = await this.driver.findElements(
        By.css('.area__status-menu__item p')
      );
      await this.findDateInDropDown(dropdownStatus, 'To Do');
      const delStatusBtn = await this.driver.findElement(
        By.id('btnDeleteProject')
      );
      await delStatusBtn.click();
      await this.notificationCheck();
    }
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
  }

  async deleteCustomStatusWithoutSelectNewStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .form-invite.form-create')),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('ul.additional-statuses-list')),
      10000
    );
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const deleteBtn = await newStatusList.findElement(
      By.id('deleteStatusField')
    );
    await this.driver.wait(until.elementIsEnabled(deleteBtn));
    await deleteBtn.click();
    const changeStatusMenu = await this.driver
      .wait(until.elementLocated(By.css('app-deleting-status-modal')), 1000)
      .catch(() => null);
    await this.driver.sleep(1000);
    if (changeStatusMenu) {
      await this.driver.wait(
        until.elementLocated(By.css('.area__status-btn')),
        10000
      );
      const delStatusBtn = await this.driver.findElement(
        By.id('btnDeleteProject')
      );
      await delStatusBtn.click();
      if(
      await this.driver.wait(until.elementLocated(By.css('.area__status-btn[iserror="true"]')),3000)
      ){
        console.log('Test passed');
        
      }
    }
    
  }


  async checkDeleteStatus(name) {
    await this.notificationCheck();
    await this.checkDeleteItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(1000);
  }

  async inabilityToDeleteStatus() {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .form-invite.form-create')),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('ul.additional-statuses-list')),
      10000
    );
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const formHasDeleBtn = await this.driver
      .wait(until.elementLocated(By.id('deleteStatusField')), 2000)
      .catch(() => null);
    if (formHasDeleBtn) {
      throw new Error('You can delete custom status, test failed');
    } else {
      console.log('passed, you can not delete custom status');
      const cancelBtn = await this.driver.findElement(By.id('btnCancel'));
      await cancelBtn.click();
    }
  }
}

module.exports = DeleteCustomStatus;
