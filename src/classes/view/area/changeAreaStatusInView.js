const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const AddCommentToArea = require('./addCommentToArea')

class ChangeAreaStatus extends AddCommentToArea {
 
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.progress = '0 %';
  }

  async checkStartProgressProjectPercent(){
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    this.progress= parseInt(await projectProgres.getText(), 10);
    console.log(`Start project percent status: ${this.progress} %`);
    return this.progress
   };

  async findAreaInView(status = '-3') {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );

    const areas = await this.driver.findElements(
      By.css(`[areastatus='${status}']`)
    );
    const firstArea = await areas[0];
    if (!(await firstArea)) {
      throw new Error('It has not area with status To Do');
    }
    console.log(
      await firstArea.getAttribute('areastatus'),
      await firstArea.getText()
    );
    await firstArea.click();
    await this.driver.wait(
      until.elementLocated(By.css('.area__status-btn')),
      10000
    );
  }

  async changeStatusToDoOnInProgress() {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(By.css('.area__status-menu__item'));
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '0%') {
      throw new Error('Progress Status Procent must be 0%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeColorProgressStatusByClick() {
    await this.driver.wait(
      until.elementLocated(By.css('.area-details-progress')),
      10000
    );
    const statusProgressElements = await this.driver.findElements(
      By.css('.area-status-progress-list__item')
    );
    const fifthProcentEl = await statusProgressElements[4];
    await this.driver.wait(until.elementIsEnabled(fifthProcentEl), 10000);
    await fifthProcentEl.click();
    await this.driver.wait(
      until.elementLocated(By.className('btn-confirm')),
      10000
    );
    const confirmBtn = this.driver.findElement(By.className('btn-confirm'));
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '50%') {
      throw new Error('Progress Status Procent must be 50%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeColorProgressStatusByBtn() {
    await this.driver.wait(
      until.elementLocated(By.css('.area-details-progress')),
      10000
    );
    const statusProgressBtns = await this.driver.findElements(
      By.css('.change-status-progress-btn')
    );
    const minusBtn = await statusProgressBtns[0];
    await this.driver.wait(until.elementIsEnabled(minusBtn), 10000);
    await minusBtn.click();
    await this.driver.wait(
      until.elementLocated(By.className('btn-confirm')),
      10000
    );
    const confirmBtn = this.driver.findElement(By.className('btn-confirm'));
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '90%') {
      throw new Error('Progress Status Procent must be 90%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeStatusInProgressOnDone() {
    const selectStatus = await this.driver.findElement(
      By.css('.area__status-btn')
    );
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(By.css('.area__status-menu__item'));
    await this.findDateInDropDown(await statusElements, 'Done');
    await this.notificationCheck();
    await this.checkAreaStatus('DONE');
  }

  async changeStatusDoneOnInProgress() {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(By.css('.area__status-menu__item'));
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '100%') {
      throw new Error('Progress Status Procent must be 100%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeStatusInProgressOnToDo() {
      const selectStatus = await this.driver.findElement(
      By.css('.area__status-btn')
    );
    // console.log(await selectStatus.getAttribute('value'));
    await this.clickAreaStatusDropdown();

    const statusElements = this.driver.findElements(By.css('.area__status-menu__item'));
    await this.driver.sleep(1000);
    await this.findDateInDropDown(await statusElements, 'To Do');
    await this.notificationCheck();
    await this.checkAreaStatus('TO_DO');
  }

  async closeAreaPopUpAndCheckStatusInView() {
   
    const areaName = await this.driver.findElement(
      By.css('.area-details-name')
    );
    const titleOfArea = await areaName.getText()
    this.statusNow = await titleOfArea.trim();
    await this.closeAreaModalWindow();
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );
    const areas = await this.driver.findElements(By.css("[areastatus='-3'] + span"));
    const firstArea = await areas[0];
    const firstAreaText = await firstArea.getText()
    if (await firstAreaText.trim() !== this.statusNow) {
      throw new Error('Close area Pop-up not work, check screenshot');
    }
   
  }

  
  async closeAreaAndCheckProgress(properties = 'increase') {
    await this.closeAreaModalWindow();
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber > nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async comparisonOfProgress(properties = 'increase') {
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber >= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async changeStatusOnCustomStatus(customyStatus) {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(By.css('.area__status-menu__item'));
    await this.findDateInDropDown(await statusElements, customyStatus);
    await this.notificationCheck();
    await this.checkAreaStatus(customyStatus);
  }
}

module.exports = ChangeAreaStatus;
