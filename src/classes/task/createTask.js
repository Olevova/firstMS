const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const path = require('path');
const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda,
} = require('../../utils/webdriver');
const config = require('../../../src/utils/config');
const locatorTask = require('../../utils/locators/LocatorTask'); 
const locatorsCommon = require('../../utils/locators/locatorsCommon'); 


class CreateTask extends Base {
  static async findDateInDropDown(array, text = false) {
    if (!text) {
      if (array) {
        await array[0].click();
        return;
      } else {
        throw Error(`No users in options list`);
      }
    }
    if (text) {
      for (const option of array) {
        const dateProject = (await option.getText()).trim().toLowerCase();

        if (dateProject === text.trim().toLowerCase()) {
          await option.click();
          return;
        }
      }
    }
    throw Error(`No ${text} in options list`);
  }

  static async findTaskInList(array, taskName) {
    let taskSearchName = ' ';

    for (let i = 0; i < array.length; i += 1) {
      taskSearchName = await array[i].getText();

      if (taskSearchName === taskName) {
        const allDotsElement = await this.driver.findElements(
          locatorsCommon.baseDotsActions
        );
        const linkElement = await allDotsElement[i];
        await linkElement.click();
        return;
      }
    }

    throw new Error('No such task in the list of tasks');
  }

  static async sortResult(driver, locator) {
    let numberElements = [];
    let firstEl = 1;
    let secondEl = 2;
    let waitSecond = 0;
    while (firstEl < secondEl && waitSecond < 10) {
      numberElements = await driver.findElements(By.className(locator));
      firstEl = parseInt(await numberElements[0].getText());
      secondEl = parseInt(await numberElements[1].getText());
      waitSecond += 1;
      console.log('work');
      await driver.sleep(1000);
    }

    if (firstEl < secondEl) {
      throw new Error('sorting not work');
    }
  }

  async attachFile(file) {
    const inputFile = await this.driver.findElement(locatorsCommon.baseFileInputId);
    if (!withoutLambda && !isRunningInDocker && !isRunningInTeamCity) {
      console.log(__dirname, '__dirname');
      const filePath = path.join(__dirname, '..', '..', 'utils', 'files', file);
      console.log(filePath);
      await inputFile.sendKeys(filePath);
    } else if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
      const pathLambda = config.lambdaPathWindows + `${file}`;
      console.log('lambda', pathLambda);
      await inputFile.sendKeys(pathLambda);
    } else {
      const pathSel = config.lambdaPathDockerChrom + `${file}`;
      console.log('running in Selenium hub', pathSel);
      await inputFile.sendKeys(pathSel);
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startTaskNumber = 0;
    this.endTasksNumber = 0;
  }

  async getTaskId(taskName) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    const allTasks = await this.driver.findElements(
      locatorsCommon.baseRowTasks
    );
    for (let task of allTasks) {
      const taskTitle = await task
        .findElement(locatorTask.taskTaskNameList)
        .getText();
      if ((await taskTitle.trim()) === taskName) {
        const taskId = await task
          .findElement(locatorTask.taskTaskIdList)
          .getText();
        console.log(taskId, 'taskId');
        return taskId.trim();
      }
    }
    console.log('Not such task in tasks list');
  }

  async openTaskForm() {
    await this.driver.wait(until.elementLocated(locatorTask.taskTabId), 10000);
    const tasksBtn = await this.driver.findElement(locatorTask.taskTabId);
    await this.driver.wait(until.elementIsEnabled(tasksBtn), 10000);
    await tasksBtn.click();
  }

  async goToCreateTasksForm(project, user = 'sa') {
    if (user === 'sa') {
      const projectsBtn = await this.driver.findElement(locatorsCommon.baselinkProjects);
      await projectsBtn.click();
    } else {
      const projectsBtn = await this.driver.findElement(
        locatorsCommon.baseProjectButtonAdminOrEmployee
      );
      await projectsBtn.click();
    }

    // await this.driver.sleep(2000);
    await this.waitListDate('.company-name', 3);
    const listOfItem = await this.driver.findElements(locatorsCommon.baseCompanyItem);

    // console.log( await listOfItem.length , 'he');
    if ((await listOfItem.length) >= 20) {
      const noPagination = await this.driver
        .wait(until.elementLocated(locatorsCommon.baseAmountItems), 3000)
        .catch(() => null);
      // console.log("here");
      if (noPagination === null) {
        console.log('20 companies');
      } else {
        await this.selectNumberOfItemsPerPagination();
      }
    }
    if (user === 'sa') {
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseCompanyItem),
        10000
      );
      const firstProjectLink = await this.driver.findElements(
        locatorsCommon.baseCompanyItem
      );
      if (project) {
        await this.findAndClickOnLinInTheList(project, '.company-name');
      } else {
        await firstProjectLink[0].click();
      }
    } else {
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseProjectItem),
        10000
      );
      const firstLink = await this.driver.findElements(locatorsCommon.baseProjectItem);
      await this.driver.sleep(1000);
      await firstLink[0].click();
    }
    await this.driver.wait(
      until.elementsLocated(locatorTask.tabListItem),
      10000
    );
    await this.openTaskForm();
  }

  async fillCreateTask(
    name,
    description,
    taskDueData,
    user = null,
    status = 'To Do'
  ) {
    const createTaskBtn = await this.driver.findElement(locatorsCommon.baseBtnCreate);
    await this.driver.wait(until.elementIsEnabled(createTaskBtn), 10000);

    this.startTaskNumber = await this.numberOfItems(this.driver);

    await createTaskBtn.click();

    const createForm = this.driver.findElement(locatorsCommon.baseModal);
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const taskName = await this.driver.findElement(locatorTask.taskNameMobile);
    await taskName.sendKeys(name);

    const usersDropDownBtn = await this.driver.findElement(
      locatorTask.taskSelectMemberMobile
    );
    await usersDropDownBtn.click();

    await this.waitListDate('.ng-option', 1);
    await this.driver.sleep(500);
    const usersList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    if (user === null) {
      console.log('I am in null');
      await CreateTask.findDateInDropDown(usersList);
    } else {
      await this.findDateInDropDown(usersList, user);
    }

    const statusInput = await this.driver.findElement(
      locatorTask.taskFlterByStatus
    );
    await this.driver.wait(until.elementIsEnabled(statusInput), 10000);
    await statusInput.click();
    await this.waitListDate('.ng-option', 3);
    const statusList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(statusList, status);

    const taskDescription = await this.driver.findElement(
      locatorTask.taskDescriptionMobile
    );
    await taskDescription.sendKeys(description);

    const taskPriority = await this.driver.findElement(
      locatorTask.taskPrioritySelectMobile
    );
    await taskPriority.click();

    await this.waitListDate('.ng-option', 1);
    const priorietyList = await this.driver.findElements(
      locatorsCommon.baseDropdownOption
    );

    await CreateTask.findDateInDropDown(priorietyList);

    const taskData = await this.driver.findElement(locatorTask.taskDueDate);
    await taskData.sendKeys(taskDueData);

    const submitBtn = await this.driver.findElement(locatorsCommon.baseBtnSubmitMobile);
    // await this.waitForSpecificTime(12,55 ) can use it for set the time for click
    await submitBtn.click();
  }

  async checkTaskCreation(newTaskName) {
    await this.notificationCheck();
    await this.checkCreateItem(
      '.table-tasks__row .item-info-list .task-name .task-name__wrapper .list-name-wrapper',
      newTaskName
    );
  }

  async goToTasksList(project) {
    const projectsBtn = await this.driver.findElement(locatorsCommon.baselinkProjects);
    await projectsBtn.click();
    await this.selectNumberOfItemsPerPagination();
    await this.driver.wait(
      until.elementsLocated(locatorsCommon.baseCompanyItem),
      10000
    );
    const firstProjectLink = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );
    if (project) {
      await this.findAndClickOnLinInTheList(project, '.company-name');
    } else {
      await firstProjectLink[0].click();
    }

    await this.driver.wait(
      until.elementsLocated(locatorTask.tabListItem),
      10000
    );
    const tasksBtn = await this.driver.findElement(locatorTask.taskTabId);
    await tasksBtn.click();

    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(locatorTask.taskItemInfoList));
    const tasksNumber = this.driver.findElements(locatorTask.taskItemInfoList);
    if ((await tasksNumber.length) >= 21) {
      await this.driver.wait(
        until.elementLocated(locatorsCommon.baseAmountItems, 10000)
      );
      const paginationDropDown = await this.driver.findElement(
        locatorsCommon.baseAmountItems
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();

      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.task-name', 11);
    }
  }

  async findAllTasksInProject() {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(locatorTask.taskName), 10000);
    const taskList = await this.driver.findElements(locatorTask.taskName);
    if ((await taskList.length) >= 21) {
      const paginationDropDown = await this.driver.findElement(
        locatorsCommon.baseAmountItems
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.task-name', 11);
    }

    this.startEntiteNumber = await taskList.length;
  }

  async changeStatus() {
    const taskRow = await this.driver.findElement(
      locatorsCommon.baseRowTasks
    );
    const firstTask = await taskRow.findElement(
      By.css('.task-name .task-name__wrapper .list-name-wrapper')
    );
    this.taskName = await firstTask.getText();

    const taskStatus = await taskRow.findElement(
      locatorTask.taskStatusTd
    );
    await this.driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      taskStatus
    );

    await this.driver.sleep(1000);
    this.startTaskStatus = await taskStatus.getText();

    await taskStatus.click();
    await this.driver.wait(
      until.elementLocated(locatorTask.taskStatusTdOpenMenu),
      10000
    );
    const openStatusMenu = this.driver.findElement(
      locatorTask.taskStatusTdOpenMenu
    );
    const statusMenu = await openStatusMenu.findElement(
      locatorTask.taskStatusMenu
    );
    const allStatus = await this.driver.findElements(
      locatorTask.taskStatusMenuItem
    );

    for (const status of allStatus) {
      if (this.startTaskStatus !== (await status.getText())) {
        this.endTaskStatus = await status.getText();
        await status.click();
        return;
      }
    }
  }

  async checkStatus() {
    const changEl = await this.driver.findElement(
      locatorsCommon.baseRowTasks
    );
    await this.driver.wait(
      until.elementTextIs(
        await changEl.findElement(locatorTask.taskStatusTd),
        this.endTaskStatus
      ),
      10000
    );
    console.log('change status succesful');
  }

  async checkTasksInList(array) {
    const listOfTasks = await this.driver.findElements(
      locatorTask.taskName
    );

    for (const [index, task] of listOfTasks.entries()) {
      if (array.includes(await task.getText())) {
        const threeDotsElement = await this.driver.findElements(
          locatorsCommon.baseDotsActions
        );
        const menuElement = await threeDotsElement[index];
        await this.driver.wait(until.elementIsEnabled(menuElement), 10000);
        await menuElement.click();
        await this.driver.wait(
          until.elementLocated(locatorsCommon.baseDotsActionEditMenuOpen),
          10000
        );
        const activeMenu = await this.driver.findElement(
          locatorsCommon.baseDotsActionEditMenuOpen
        );
        await this.driver.wait(until.elementIsEnabled(activeMenu), 10000);
        const menuEl = await activeMenu.findElement(locatorsCommon.baseSelectItemId);
        await this.driver.wait(until.elementIsEnabled(menuEl, 10000));
        await menuEl.click();

        while ((await activeMenu.getAttribute('editmenuopen')) === true) {
          await this.driver.sleep(1000);
        }
      }
    }
  }

  async removeCheckingTasks() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    const delCheckItemBtn = await this.driver.findElement(
      By.id('btnDeleteSelect')
    );
    await this.driver.actions().scroll(0, 0, 0, 0, delCheckItemBtn).perform();

    await delCheckItemBtn.click();
    const modalWindow = await this.driver.findElement(locatorsCommon.baseBackdrop);
    await this.driver.wait(until.elementIsVisible(modalWindow), 10000);

    const delBtn = this.driver.findElement(locatorTask.taskBtnDeleteTask);
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await delBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseNotificationClass),
      10000
    );
    const windowHandles = await this.driver.findElement(
      locatorsCommon.baseNotificationClass
    );
    const windowHandlesText = await windowHandles.getText();

    const errorRegex = /error/i;
    if (errorRegex.test(windowHandlesText)) {
      throw new Error('You have error, check screenshot');
    } else console.log(windowHandlesText);

    let elAfterRemove = await this.numberOfItems(this.driver);
    let numderOfWaiting = null;
    while (this.startEntiteNumber === elAfterRemove && numderOfWaiting < 5) {
      elAfterRemove = await this.numberOfItems(this.driver);
      await this.driver.sleep(500);
      numderOfWaiting += 1;
      console.log(numderOfWaiting);
    }
    console.log(elAfterRemove, this.startEntiteNumber);
  }

  async filterTasks(status, member = false) {
    let filterForm = null;
    const filterFormBtn = await this.driver.findElement(
      locatorsCommon.baseFilterBtn
    );

    await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
    await filterFormBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseFilterForm),
      10000
    );

    if (status) {
      await this.driver.wait(until.elementsLocated(locatorTask.taskFilterByStatusId),10000);
      
      await this.driver.findElement(locatorTask.taskFilterByStatusId).click();
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseDropdownOption),
        10000
      );
      filterForm = await this.driver.findElement(locatorsCommon.baseFilterForm);
      const statusElements = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );
      await CreateTask.findDateInDropDown(statusElements, status);
    }
    if (member) {
      await this.driver.findElement(locatorsCommon.baseNgSelect).click();
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseDropdownOption),
        10000
      );
      if (filterForm === null) {
        filterForm = await this.driver.findElement(
          locatorsCommon.baseFilterForm
        );
      }
      const membersElements = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );
      await CreateTask.findDateInDropDown(membersElements, member);
    }
    await filterFormBtn.click();
    do {
      await this.driver.sleep(1000);
    } while ((await filterForm.getAttribute('visible')) === 'true');
    {
    }
  }

  async chekFilter(status, member = false) {
    await this.driver.executeScript('return document.readyState');
    const allTasks = await this.driver.findElements(
      locatorTask.taskStatusTd
    );
    let taskText;

    for (let task of allTasks) {
      taskText = await task.getText();

      if (taskText.trim().toLowerCase() !== status.trim().toLowerCase()) {
        console.log(await task.getText(), status);
        throw new Error('filter not work');
      }
    }
    if (member) {
      const allMembers = await this.driver.findElements(
        locatorTask.taskMember
      );
      let memberName;
      for (let memberEl of allMembers) {
        memberName = await memberEl.getText();

        if (memberName.trim().toLowerCase() !== member.trim().toLowerCase()) {
          console.log(await task.getText(), 'error', member);
          throw new Error('filter not work');
        }
      }
    }
    console.log('filter is working');
    await this.driver.sleep(500);
  }

  async taskRemove(task) {
    await this.driver.wait(
      until.elementsLocated(locatorTask.taskName),
      10000
    );
    const allTasks = await this.driver.findElements(locatorTask.taskName);

    if (allTasks) {
      // await RemoveTask.findTaskInList(allTasks, task);
      await this.findItemAndOpenThreeDotsMenu(task, '.task-name');
    }

    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseDotMenuOpen),
      10000
    );
    const delBtn = await this.driver.findElement(
      locatorsCommon.baseDotMenuDeleteBtn
    );
    // await this.driver.wait(until.elementIsVisible(delBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000);
    await delBtn.click();

    const delTaskBtn = await this.driver.findElement(locatorTask.taskBtnDeleteTask);
    await this.driver.wait(until.elementIsVisible(delTaskBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(delTaskBtn), 10000);
    await this.driver.sleep(500);

    await delTaskBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseNotificationClass),
      10000
    );
    const windowHandles = await this.driver.findElement(
      locatorsCommon.baseNotificationClass
    );
    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('You have error, check screenshot');
    }
    try {
      const noTasks = await this.driver
        .wait(until.elementsLocated(locatorTask.taskName), 10000)
        .catch(() => null);

      if (noTasks === null) {
        console.log('list of task is empty');
        return;
      }
      const allTasksAfterDel = await this.driver.findElements(
        locatorTask.taskName
      );

      const isTaskRemoved = allTasksAfterDel.every(
        async i => (await i.getText()) !== task
      );

      if (isTaskRemoved) {
        console.log('task is removed');
        return;
      } else {
        throw new Error('Task did not remove');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchingTasksByName(name) {
    const searchingFormInput = await this.driver.findElement(
      locatorTask.taskLabelSearch
    );
    await this.driver.wait(until.elementIsEnabled(searchingFormInput));
    this.startTaskNumber = await this.numberOfItemsInTheList('.item-info-list');
    console.log(this.startTaskNumber, 'this.startTaskNumber');
    await searchingFormInput.sendKeys(name);
  }

  async chekSearchingResult(name) {
    this.endTasksNumber = await this.numberOfItemsInTheList('.item-info-list');
    console.log(this.endTasksNumber, 'end task');

    if (this.startTaskNumber === 1) {
      return;
    } else {
      let count = null;
      while (this.startTaskNumber === this.endTasksNumber && count < 5) {
        this.endTasksNumber = await this.numberOfItemsInTheList(
          '.item-info-list'
        );
        await this.driver.sleep(1000);
        count += 1;
      }
      if (count > 4) {
        throw new Error('searching not working');
      }
    }
    await this.driver.wait(until.elementsLocated(locatorTask.taskName), 10000);
    const allTasks = await this.driver.findElements(locatorTask.taskName);

    for (const task of allTasks) {
      if ((await task.getText()) !== name) {
        console.log(await task.getText());

        throw new Error('search not work');
      }

      console.log('search is working');
      return;
    }
  }

  async sortTasks() {
    const sortingElements = await this.driver.findElements(
      locatorTask.tableSortIconBtn
    );
    await sortingElements[0].click();

    await this.driver.wait(
      until.elementsLocated(locatorTask.taskId),
      10000
    );

    await CreateTask.sortResult(this.driver, 'task-id');
  }

  async editTask(taskName, newName) {
    await this.driver.wait(
      until.elementsLocated(locatorTask.taskTableRowTaskName),
      10000
    );
    const listOfTasks = await this.driver.findElements(
      locatorTask.taskTableRowTaskName
    );
    for (const task of listOfTasks) {
      const taskNameForCheck = await task.getText();
      console.log(taskNameForCheck);
      if (taskName === taskNameForCheck) {
        await task.click();
        await this.driver.wait(
          until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
          10000
        );
        await this.driver.wait(
          until.elementLocated(locatorTask.taskNameMobile),
          10000
        );
        const taskNameInput = await this.driver.findElement(
          locatorTask.taskNameMobile
        );
        await this.driver.sleep(1000);
        await taskNameInput.clear();
        await taskNameInput.sendKeys(newName);
        await this.driver.sleep(1000);
        const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnSubmitMobile);
        await saveBtn.click();
        await this.driver.sleep(500);
        return;
      }
    }
    await this.notificationCheck();
    await this.checkCreateItem('.task-name', newName);
  }

  async addAttachment(taskName, file = 'JavaScript.png') {
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseDropAreaMobile),
      10000
    );
    await this.attachFile(file);

    const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnSubmitMobile);
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
    await this.notificationCheck();
    await this.driver.sleep(2000);
  }

  async addAttachmentWithoutSave(file = 'JavaScript.png') {
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseDropAreaMobile),
      10000
    );
    await this.attachFile(file);
    const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnSubmitMobile);
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await this.driver.sleep(500);
  }

  async openTaskPopUp(taskName) {
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
      10000
    );
  }

  async checkAttachment(taskName, filename) {
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
      10000
    );
    await this.driver.wait(until.elementLocated(locatorTask.taskFilesList), 10000);
    const attacheFileList = await this.driver.findElement(
      locatorTask.taskFilesList
    );
    await this.waitListDate('.file-item', 1);
    const attacheFile = await attacheFileList.findElements(
      By.css('.fileName-with-timeLeft')
    );
    let filesTitle = [];
    for (let file of attacheFile) {
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

module.exports = CreateTask;
