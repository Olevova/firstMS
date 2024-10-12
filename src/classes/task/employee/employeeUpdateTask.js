const { By, until } = require('selenium-webdriver');
const CreateTaskByEmployee = require('./employeeCreateTask');

class EmployeeUpdateTask extends CreateTaskByEmployee {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editTask(taskName, newName) {
    await this.driver.wait(until.elementsLocated(By.className('task-name')),10000);
    await this.findItemAndOpenThreeDotsMenu(taskName, '.task-name');
    console.log('in task');
    
    await this.driver.wait(
      until.elementLocated(By.css('#dotsMenu[editmenuopen]')),
      10000
    );
    console.log('in task');
    const taskMenu = await this.driver.findElement(
      By.css('#dotsMenu[editmenuopen] .editMenuList')
    );

    const editBtn = await taskMenu.findElement(By.id('editItem'));
    await this.driver.wait(until.elementIsVisible(editBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await this.driver.sleep(1000);
    console.log(await editBtn.getAttribute('class'));
    
    await editBtn.click();

    const taskNameInput = await this.driver.findElement(By.id('taskNameMobile'));
    await this.driver.wait(until.elementIsVisible(taskNameInput), 10000);
    await this.driver.executeScript('return document.readyState');

    await this.driver.sleep(1000);

    await taskNameInput.clear();

    await this.driver.findElement(By.id('taskNameMobile')).sendKeys(newName);

    const saveBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
    // await this.waitForSpecificTime(9, 29) can use it for set time for a click
    await saveBtn.click();

    await this.driver.wait(
      until.elementLocated(By.className('notification')),
      10000
    );
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );

    if ((await windowHandles.getText()) === 'Error. Failed to save data') {
      throw new Error('Task did not update');
    }
    await this.driver.wait(until.elementIsVisible(windowHandles), 10000);

    let updateTask = null;
    let waitTask = 0;

    while (updateTask !== newName && waitTask < 5) {
      const taskElements = await this.driver.findElements(
        By.className('task-name')
      );
      const taskEl = await taskElements[taskElements.length - 1];

      updateTask = await taskEl.getText();
      await this.driver.sleep(1000);
      waitTask += 1;
    }

    if (updateTask >= 4) {
      throw new Error('Task not edit');
    }
  }
}

module.exports = EmployeeUpdateTask;
