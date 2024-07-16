const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class FilterTaskByStatus extends Base {
  static async findDateInDropDown(array, text) {
    for (const option of array) {
      const dateProject = (await option.getText()).trim().toLowerCase();

      if (dateProject === text.trim().toLowerCase()) {
        await option.click();
        return;
      }
    }

    throw Error(`No ${text} in options list`);
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startTaskNumber = 0;
    this.endTasksNumber = 0;
  }

  async goToTasksList(project=null) {
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();
    await this.selectNumberOfItemsPerPagination();
    await this.driver.wait(until.elementsLocated(By.css('.company-name')), 10000);
    const firstProjectLink = await this.driver.findElements(By.css('.company-name'));
    if(project){
     await this.findAndClickOnLinInTheList(project, ".company-name") 
    }
    else{
      await firstProjectLink[0].click();
    }

    await this.driver.wait(
      until.elementsLocated(By.className('tab-list__item')),
      10000
    );
    const tasksBtn = await this.driver.findElement(By.id('tasksTab'));
    await tasksBtn.click();
  }

  async filterTasksByStatus(status) {
    const filterFormBtn = await this.driver.findElement(
      By.className('filters-btn')
    );
    await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
    await filterFormBtn.click();

    await this.driver.wait(until.elementLocated(By.className('filters-form')));

    await this.driver.findElement(By.id('filterByStatus')).click();
    await this.driver.wait(
      until.elementsLocated(By.className('ng-option')),
      10000
    );
    const filterForm = await this.driver.findElement(
      By.className('filters-form')
    );
    const statusElements = await this.driver.findElements(
      By.className('ng-option')
    );
    await FilterTaskByStatus.findDateInDropDown(statusElements, status);
    await filterFormBtn.click();

    do {
      await this.driver.sleep(1000);
    } while ((await filterForm.getAttribute('visible')) === 'true');
    {
    }
  }

  async chekFilter(status) {
    await this.driver.executeScript('return document.readyState');
    const allTasks = await this.driver.findElements(
      By.className('task-status-td')
    );
    let taskText;

    for (const task of allTasks) {
      taskText = await task.getText();

      if (taskText.trim().toLowerCase() !== status.trim().toLowerCase()) {
        console.log(await task.getText(), 2222, status);
        throw new Error('filter not work');
      }

      console.log('filter is working');
    }
  }
}

module.exports = FilterTaskByStatus;
