const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateTask extends Base {
  
  static async findDateInDropDown(array) {
    if (array) {
      await array[0].click();
      return;
    } else {
      throw Error(`No users in options list`);
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startTaskNumber = 0;
    this.endTasksNumber = 0;
  }

  async openTaskForm(){
    await this.driver.wait(until.elementLocated(By.id('tasksTab')),10000);
    const tasksBtn = await this.driver.findElement(By.id('tasksTab'));
    await this.driver.wait(until.elementIsEnabled(tasksBtn),10000);
    await tasksBtn.click();
  }

  async goToCreateTasksForm(project) {
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();
    // await this.driver.sleep(2000);
    await this.waitListDate('.company-name',3)
    const listOfItem = await this.driver.findElements(By.css('.company-name'));
    
    console.log( await listOfItem.length , 'he');
    if ((await listOfItem.length) >= 20){
      const noPagination = await this.driver
      .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
      .catch(() => null);
      console.log("here");
      if (noPagination === null) {
        console.log('20 companies');
      }
      else{
        await this.selectNumberOfItemsPerPagination();
      }
    }
    
    await this.driver.wait(until.elementsLocated(By.css('.company-name')), 10000);
    const firstProjectLink = await this.driver.findElements(By.css('.company-name'));
    if(project){
     await this.findAndClickOnLinInTheList(project, ".company-name") 
    }
    else{
      await firstProjectLink[0].click();
    }
    // await firstProjectLink[0].click();

    await this.driver.wait(
      until.elementsLocated(By.className('tab-list__item')),
      10000
    );
    await this.openTaskForm();
    // const tasksBtn = await this.driver.findElement(By.id('tasksTab'));
    // await tasksBtn.click();
  }

  async fillCreateTask(name, description, taskDueData, user=null) {
    const createTaskBtn = await this.driver.findElement(By.id('btnCreate'));
    await this.driver.wait(until.elementIsEnabled(createTaskBtn), 10000);

    this.startTaskNumber = await this.numberOfItems(this.driver);

    await createTaskBtn.click();

    const createForm = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const taskName = await this.driver.findElement(By.id('taskName'));
    await taskName.sendKeys(name);

    const usersDropDownBtn = await this.driver.findElement(
      By.id('taskSelectMember')
    );
    await usersDropDownBtn.click();

    await this.waitListDate('.ng-option', 1);
    await this.driver.sleep(500)
    const usersList = await this.driver.findElements(By.className('ng-option'));
    if(user === null){
      console.log('I am in null');
      await CreateTask.findDateInDropDown(usersList);
    }
    else{
      await this.findDateInDropDown(usersList, user)
    }

    const taskDescription = await this.driver.findElement(
      By.id('taskDescription')
    );
    await taskDescription.sendKeys(description);

    const taskPriority = await this.driver.findElement(By.id('prioritySelect'));
    await taskPriority.click();

    await this.waitListDate('.ng-option', 1);
    const priorietyList = await this.driver.findElements(
      By.className('ng-option')
    );
   
    await CreateTask.findDateInDropDown(priorietyList);

    const taskData = await this.driver.findElement(By.id('taskDueDate'));
    await taskData.sendKeys(taskDueData);

    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    // await this.waitForSpecificTime(12,55 ) can use it for set the time for click
    await submitBtn.click();
  }

  async checkTaskCreation(newTaskName) {
    await this.notificationCheck('id','mainErrorText');
    await this.checkCreateItem('.table-tasks__row .item-info-list .task-name .task-name__wrapper .list-name-wrapper',newTaskName)
  }
}

module.exports = CreateTask;
