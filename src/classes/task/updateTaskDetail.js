const { By, until, error } = require('selenium-webdriver');
const Base = require('../base');
const fs = require('fs');
const path = require('path');
const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda,
} = require('../../utils/webdriver');
const config = require('../../../src/utils/config');

class UpdateTaskDetail extends Base {

  async attachFile(file){
    const inputFile = await this.driver.findElement(By.id('fileInputMobile'));
    if (!withoutLambda && !isRunningInDocker && !isRunningInTeamCity)  {
      console.log(__dirname, '__dirname');
      const filePath = path.join(__dirname, '..','..', 'utils', 'files', file);
      console.log(filePath);
      await inputFile.sendKeys(filePath);
    } else if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
      const pathLambda = config.lambdaPathWindows + `${file}`
      console.log('lambda', pathLambda);
      await inputFile.sendKeys(pathLambda);
    } else {
      const pathSel = config.lambdaPathDockerChrom + `${file}`
      console.log('running in Selenium hub', pathSel);
      await inputFile.sendKeys(pathSel);
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async findAllTasksInProject() {
    await this.driver.wait(until.elementsLocated(By.css('.item-info-list')));
    const tasksNumber = this.driver.findElements(By.css('.item-info-list'));
    if ((await tasksNumber.length) >= 21) {
      await this.driver.wait(
        until.elementLocated(By.id('selectAmountItems'), 10000)
      );
      const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();

      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.task-name', 11);
    }
    this.startEntiteNumber = await tasksNumber.length;
  }

  async editTask(taskName, newName) {
    await this.driver.wait(
      until.elementsLocated(By.css('.table-tasks__row .task-name')),
      10000
    );
    const listOfTasks = await this.driver.findElements(
      By.css('.table-tasks__row .task-name')
    );
    console.log('here and');
    // await this.driver.sleep(1000);
    for (const task of listOfTasks) {
      const taskNameForCheck = await task.getText();
      console.log(taskNameForCheck);
      if (taskName === taskNameForCheck) {
        await task.click();
        // await this.driver.sleep(1000);
        await this.driver.wait(
          until.elementLocated(By.css('.backdrop .modal')),
          10000
        );
        const taskForm = await this.driver.findElement(
          By.className('modalViewTask')
        );
        await this.driver.wait(until.elementIsEnabled(taskForm));

        const editBtn = await this.driver.findElement(By.id('btnEditTask'));
        await editBtn.click();
        await this.driver.wait(until.elementLocated(By.id('taskNameMobile')), 10000);
        const taskNameInput = await this.driver.findElement(By.id('taskNameMobile'));
        await taskNameInput.clear();
        await this.driver.sleep(1000);
        await taskNameInput.sendKeys(newName);
        await this.driver.sleep(1000);
        const saveBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
        await saveBtn.click();
        await this.driver.sleep(500);
        return;
      }
    }
    await this.notificationCheck();
    await this.checkCreateItem('.task-name', newName);
  }

  async addAttachment(taskName, file='JavaScript.png') {
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .modal')),
      10000
    );
    const editBtn = await this.driver.findElement(By.id('btnEditTask'));
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await editBtn.click();
    await this.driver.wait(until.elementLocated(By.id('drop-areaMobile')), 10000);
    await this.attachFile(file);

    const saveBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
    await this.notificationCheck();
    await this.driver.sleep(2000);
  };

  async addAttachmentWithoutSave(file='JavaScript.png') {
    await this.driver.wait(until.elementLocated(By.id('drop-areaMobile')), 10000);
    await this.attachFile(file);
    const saveBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await this.driver.sleep(500);
    
  }

  async openTaskPopUp(taskName){
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .modal')),
      10000
    );
    const editBtn = await this.driver.findElement(By.id('btnEditTask'));
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await editBtn.click();
  }
  

  async checkAttachment(taskName, filename) {
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .modal')),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('.task-files-list')),
      10000
    );
    const attacheFileList = await this.driver.findElement(
      By.css('.task-files-list')
    );
    await this.waitListDate('.file-link', 1);
    const attacheFile = await attacheFileList.findElements(By.css('.fileName-with-timeLeft'));
    let filesTitle=[];
    for(let file of attacheFile){
      const fileName = await file.getText();
      filesTitle.push(fileName);
      console.log(filesTitle);
    }
   
    if (!filesTitle.includes(filename)) {
      throw new Error('file did not added');
    } else {
      console.log('file was added');
    }
    console.log(filesTitle);
  }
}

module.exports = UpdateTaskDetail;
