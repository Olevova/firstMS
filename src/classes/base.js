const { By, until } = require('selenium-webdriver');
const path = require('path');
const { elementLocated } = require('selenium-webdriver/lib/until');

class Base {
  // The method used for finding values in dropdown menus in forms.
  async findDateInDropDown(array, text) {
    // console.log(await array.length, 'len');
    for (const option of array) {
      const dateEl = await option.getText();
      const date = await dateEl.trim().toLowerCase();
      // console.log(date, 'drop', text);

      if (date === text.trim().toLowerCase()) {
        await option.click();
        return;
      }
    }

    throw Error(`No ${text} in options list`);
  }

  async numberOfItemsInTheList(
    locator,
    number = '100',
    listLocator = '.company-name'
  ) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.css(locator)), 10000);

    let element;
    let counter = 0;
    
    while (!element || element.length < 2) {
      element = await this.driver.findElements(By.css(locator));

      if (element.length < 1) {
        await this.driver.sleep(1000);
      }
      counter += 1;
      if (counter >= 5) {
        break;
      }
    }
    const listOfItem = await this.driver.findElements(By.css(locator));
    let len;
    // console.log(await listOfItem.length, "list len");
    if ((await listOfItem.length) >= 20) {
      const noPagination = await this.driver
        .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
        .catch(() => null);

      if (noPagination === null) {
        const emptyList = 20;
        return emptyList;
      }
      const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );

      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();

      const totalEl = await this.driver
        .findElement(By.className('total-item-text'))
        .getText();
      const numberEl = totalEl.split(' ');
      const len = Number(numberEl[numberEl.length - 1]);
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, number);
      await this.waitListDate(listLocator, 21);
      const dataInList = await this.driver.findElements(By.css(listLocator));
      // console.log(len, await dataInList.length , 'lenght');
      if (len === (await dataInList.length)) {
        return len;
      } else {
        throw new Error(
          `The number of items in the list does not match the number of items in the counter`
        );
      }
    }
    len = await listOfItem.length;
    return len;
  }

  // The method that returns the number of items in a list can be used to search for the count of projects, companies, etc
  async numberOfItems(driver) {
    await driver.executeScript('return document.readyState');

    const noPagination = await this.driver
      .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
      .catch(() => null);

    if (noPagination === null) {
      const companyList = await this.driver.findElements(
        By.css('.company-name')
      );
      const listLenght = await companyList.length;
      return listLenght;
    }

    const paginationDropDown = await driver.findElement(
      By.id('selectAmountItems')
    );

    await driver.actions().scroll(0, 0, 0, 0, paginationDropDown).perform();

    const totalEl = await driver
      .findElement(By.className('total-item-text'))
      .getText();
    const numberEl = totalEl.split(' ');
    const numberOfItems = Number(numberEl[numberEl.length - 1]);

    // console.log(numberOfItems);
    return numberOfItems;
  }

  // The method that expects an array whose length is greater than a certain number, which can be specified as a parameter
  async waitListDate(selector, lngh) {
    let element;
    let counter = 0;
       
    while (!element || element.length < lngh) {
      element = await this.driver.findElements(By.css(selector)); // Use the provided selector

      if (element.length < lngh) {
        // console.log(element.length, 'lenght', counter);
        await this.driver.sleep(1000);
      }
      counter += 1;
      if (counter >= 10) {
        break;
      }
    }
  }

  // The method that waits for a certain period of time and continues executing a function during that time
  async waitForSpecificTime(hour, minute) {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );

    const timeDifference = targetTime - now;
    if (timeDifference > 0) {
      // console.log(now);
      return new Promise(resolve => setTimeout(resolve, timeDifference));
    }
  }

  // The method for switching to a tab view.
  async goToView(project = null, user = 'sa') {
    if (user === 'sa') {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjects')),
        10000
      );
      const projectLink = await this.driver.findElement(By.id('linkProjects'));
      await this.driver.wait(until.elementIsEnabled(projectLink), 10000);
      await projectLink.click();
    } else {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjectsAdminOrEmployee')),
        10000
      );
      const projectLinkForAnotherUsers = await this.driver.findElement(
        By.id('linkProjectsAdminOrEmployee')
      );
      await this.driver.wait(
        until.elementIsEnabled(projectLinkForAnotherUsers),
        10000
      );
      await this.driver.sleep(500);
      await projectLinkForAnotherUsers.click();
      await this.driver.sleep(1000);
    }

    await this.driver.wait(
      until.elementsLocated(By.css('.company-name')),
      10000
    );
    const listItem = await this.driver.findElements(By.css('.company-name'));
    let firstProjectLink;
    if ((await listItem.length) >= 20) {
      const pagination = await this.driver.wait(
        until.elementLocated(By.id('paginationWrapper')),
        3000
      );
      if (pagination) {
        await this.selectNumberOfItemsPerPagination('100');
      }
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    } else {
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    }
    if (project) {
      await this.driver.sleep(1000);
      await this.findAndClickOnLinInTheList(project, '.company-name');
      await this.driver.sleep(1000);
    } else {
      await firstProjectLink[0].click();
      await this.driver.sleep(1000);
    }
  }

  // The method for navigating to a specified tab.
  async goToSelectTab(tabname) {
    await this.driver.wait(
      until.elementsLocated(By.css('.tab-list__item')),
      10000
    );
    const tabElements = await this.driver.findElements(
      By.css('.tab-list__item')
    );
    let trigger = false;
    for (const tab of tabElements) {
      let tabEl = await tab.getText();
      tabEl = tabEl.toLowerCase().trim();
      if (tabEl === tabname.toLowerCase()) {
        await tab.click();
        trigger = true;
        return;
      }
    }
    if (!trigger) {
      throw new Error(`It is not tab with name ${tabname}`);
    }
  }

  // The method for searching for a created element and checking its presence in the list
  async checkCreateItem(locator, item) {
    const units = await this.driver.findElements(By.css(locator));
    let isItemCreated = false;
    for (let i of units) {
      if (i) {
        const itemText = await i.getText();
        // console.log(itemText, item, 'check');
        if (itemText.trim() === item) {
          console.log(`${item} is created successfully`);
          isItemCreated = true;
          break;
        }
      }
    }
    if (!isItemCreated) {
      console.log(`${item} is not created`);
      throw new Error(`${item} is not created`);
    }
  }

  // The method that checks for the removal of an element from the list
  async checkDeleteItem(locator, item) {
    const units = await this.driver.findElements(By.css(locator));

    let isItemCreated = false;

    for (let i of units) {
      if (i) {
        const itemText = await i.getText();
        if (itemText.trim() === item) {
          console.log(`${item} is not deleted`);
          throw new Error(`${item} is not deleted`);
        }
      }
    }

    if (!isItemCreated) {
      console.log(`Item ${item} is deleted successfully`);
    }
  }

  // The method for checking notifications after a successful action on the website
  async notificationCheck() {
    let attempts = 0;
    const maxAttempts = 3;
    while(attempts < maxAttempts){
      console.log('in notif', attempts);
    try {
        await this.driver.wait(
        until.elementLocated(By.css('app-notification .notification')),
        10000);
      let notificationEl = await this.driver.findElement(By.css('app-notification .notification'))
      if (notificationEl) {
        await this.driver.wait(until.elementIsVisible(notificationEl), 10000);
        const elClasses = await notificationEl.getAttribute('class');
        if (elClasses.includes('success')) {
          console.log('notification successful');
          await this.driver.wait(until.stalenessOf(notificationEl), 10000);
          return
        } else if (elClasses.includes('error')) {
          console.log('error notification ');
          throw new Error('error notification');
        } else {
          throw new Error('Unexpected notification class');
        }
      }
    } catch (error) {
      if (error.name === 'StaleElementReferenceError') {
        attempts += 1;
        console.log(error.message, 'erorr message');
        console.log(`StaleElementReferenceError: try ${attempts} from ${maxAttempts}. retry...`);
        if (attempts === maxAttempts) {
          throw new Error(error.message);
        }
      } else {
      console.error('An error occurred:', error.message);
      throw new Error(error.message);}
    }
  }
  }

  // The method for locating the coordinates of an element on the website
  async getCoordinates(element) {
    const rect = await element.getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    return { x, y };
  }

  // The method for checking the status of an array
  async checkAreaStatus(status) {
    const newSelectStatus = await this.driver.findElement(
      By.css('.area__status-btn')
    );
    const areaStatus = await newSelectStatus.getText();
    if ((await areaStatus.trim()) == !status) {
      throw new Error(
        `The area's status does not match the specified status of ${status}`
      );
    }
    console.log(` All ok status is ${status}`);
  }

  // The method for click on the status dropdown in area Pop-up
  async clickAreaStatusDropdown() {
    const inputEl = this.driver.findElement(
      By.className('area__status-icon-dropdown')
    );
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.area__status-menu__item', 1);
  }

  // The method for finding a link in a list and clicking on it
  async findAndClickOnLinInTheList(link, selector) {
    await this.waitListDate(selector, 1);
    const listOfLink = await this.driver.findElements(By.css(selector));
    let notFindeLink = true;
    for (let linkTag of listOfLink) {
      const linkText = await linkTag.getText();

      if ((await linkText.toLowerCase().trim()) === link.toLowerCase()) {
        await this.driver.wait(until.elementIsEnabled(linkTag), 10000);
        await linkTag.click();
        notFindeLink = false;
        await this.driver.sleep(500);
        break;
      }
    }
    if (notFindeLink) {
      throw new Error('It is not such link');
    }
  }

  // The method for navigating to the form for creating a custom status
  async goToCustomStatusCreateForm() {
    await this.driver.wait(
      until.elementLocated(By.css('.customize-status-btn')),
      10000
    );
    const statusBtn = this.driver.findElement(By.css('.customize-status-btn'));
    await this.driver.wait(until.elementIsEnabled(statusBtn), 10000);
    await statusBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.customize-menu')),
      10000
    );
    const cunstomizeStatus = await this.driver.findElements(
      By.css('.customize-menu__item')
    );
    await this.driver.wait(until.elementIsEnabled(cunstomizeStatus[0]), 10000);
    await this.driver.sleep(1000);
    await cunstomizeStatus[0].click();
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .form-invite.form-create')),
      10000
    );
  }

  // The method for closing the modal window of an area.
  async closeAreaModalWindow() {
    await this.driver.wait(until.elementLocated(By.id('btnCloseModal')), 10000);
    const popUp = await this.driver.findElement(By.css('.backdrop'));
    const closeBtn = await popUp.findElement(By.id('btnCloseModal'));
    await this.driver.wait(until.elementIsEnabled(closeBtn), 10000);
    await closeBtn.click();
    await this.driver.sleep(500);
  }

  // The method that can be used to change the window size. If we need
  async makeWindowsFormLower(size) {
    await this.driver.executeScript(`document.body.style.zoom='${size}%'`);
  }

  // For local use return path to the file that can be used for attachment to an issue or task
  fileReturn() {
    const currentDirectory = __dirname;
    console.log(currentDirectory, 'currentDirectory');
    const imagePath = path.join(currentDirectory, 'utils/Logo.png');
    return imagePath;
  }

  // find item in list and open three dot menu
  async findItemAndOpenThreeDotsMenu(item, selector) {
    const listOfItem = await this.driver.findElements(By.css(selector));
    for (const [index, task] of listOfItem.entries()) {
      // console.log(await task.getText(), index);
      if (item === (await task.getText())) {
        // console.log(index, 'index');
        const itemsInfoEl = await this.driver.findElements(By.css('.item-info-list'));
        const menuForClick = await itemsInfoEl[index].findElement(By.css('.dots-actions'));
        await this.driver.wait(until.elementIsEnabled(menuForClick), 10000);
        await menuForClick.click();
        await this.driver.sleep(500);
      }
    }
  }
  // Method for navigating through dashboard tabs.
  async goToDashboardTab(tabName) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.nav-list__item')),
      10000
    );
    const listOfTabs = await this.driver.findElements(
      By.css('.nav-list__item')
    );
    for (let tab of listOfTabs) {
      let tabForCheck = await tab.findElement(By.css('a')).getText();
      // console.log(tabForCheck, tabName);
      if ((await tabForCheck.trim().toLowerCase()) === tabName.toLowerCase()) {
        // console.log(tabForCheck, tabName);
        await tab.click();
        await this.driver.wait(
          until.elementLocated(By.css('.nav-list__link--active')),
          10000
        );
        return;
      }
    }
    throw new Error(
      'The tab you are looking for on the dashboard does not exist'
    );
  }
  // The method opens the room editing form in the view tab
  async openEditRoomFormViaThreeDots(room) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.css('.room-name')), 10000);
    const rooms = await this.driver.findElements(By.css('.room-name'));
    for (let item of rooms) {
      if (item) {
        // console.log(await item.getText(), room);
        
        if ((await item.getText()) === room) {
          await this.driver.wait(
            until.elementLocated(By.css('.menu-list-dots-wrapper')),
            10000
          );
          const menuBtn = await item.findElement(
            By.css('.menu-list-dots-wrapper')
          );
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          await menuBtn.click();
          break;
        }
      } else {
        throw new Error('Room is not created');
      }
    }
    await this.driver.wait(
      until.elementLocated(By.css('.editMenuList[editmenuroomopen]')),
      10000
    );
    const roomMenu = await this.driver.findElement(
      By.css('.editMenuList[editmenuroomopen]')
    );
    await this.driver.wait(until.elementLocated(By.id('editRoomBtn')), 10000);
    const editRoomBtn = await roomMenu.findElement(By.id('editRoomBtn'));
    await this.driver.wait(until.elementIsEnabled(editRoomBtn), 10000);
    await editRoomBtn.click();
  }
  //The method that allows you to select the number of entities to display on the page by default is 100, you can choose 10, 15, 20, 50, 100
  async selectNumberOfItemsPerPagination(number = '100') {
    await this.driver.executeScript('return document.readyState');
    const noPagination = await this.driver
      .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
      .catch(() => null);
    if (noPagination !== null) {
      const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();
      await this.driver.sleep(1000);
      const totalEl = await this.driver
        .findElement(By.className('total-item-text'))
        .getText();
      const numberEl = totalEl.split(' ');
      const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

      if (numberOfCompanies > 20) {
        await paginationDropDown.click();
        const paginationList = await this.driver.findElements(
          By.className('ng-option')
        );
        await this.findDateInDropDown(paginationList, number);
        await this.waitListDate('.company-name', 21);
        await this.driver.sleep(500);
      }
    }
  }
  //The method to check if the focus is on the first input element of a form
  async isFirstInputFocused(formSelector, text) {
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.css(formSelector)), 10000);
    const form = await this.driver.findElement(By.css(formSelector));
    await this.driver.wait(until.elementLocated(By.css(`${formSelector} input`)),10000);
    const firstInput = await form.findElement(By.css('input'));
    const activeElement = await this.driver.switchTo().activeElement();
    // console.log(await firstInput.getAttribute('id'), 'first', await activeElement.getAttribute('id'), 'second');
    const isFocused =
      (await firstInput.getId()) === (await activeElement.getId());
    if (isFocused) {
      console.log(text + ' work');
      return isFocused;
    }

    throw new Error(text + ' not work');
  }
  //The mathod that make click on element
  async clickElement(locator, unique = true, order = 0, wait = 0) {
    if (wait > 0) {
      await this.driver.sleep(wait);
    }
    let el;
    if (unique) {
      el = await this.driver.wait(until.elementLocated(By.css(locator)), 10000);
      await this.driver.wait(until.elementIsEnabled(el), 10000);
    } else {
      const elements = await this.driver.wait(
        until.elementsLocated(By.css(locator)),
        10000
      );
      el = elements[order];
      await this.driver.wait(until.elementIsEnabled(el), 10000);
    }
    await el.click();
  }
  //The method endless elements scroll
  async scrollTableToEnd(locator) {
    await this.driver.wait(until.elementLocated(By.css(locator)), 10000);
    const table = await this.driver.findElement(By.css(locator));

    await this.driver.actions().scroll(0, 0, 0, 0, table).perform();
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
      table
    );
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(
        By.css(`${locator} .ng-native-scrollbar-hider.ng-scroll-viewport`)
      ),
      10000
    );
    let container = await this.driver.findElement(
      By.css(`${locator} .ng-native-scrollbar-hider.ng-scroll-viewport`)
    );
    let previousHeight;
    let currentHeight = 0;

    do {
      const targetScrollPosition = (currentHeight * 110) / 100;
      previousHeight = currentHeight;
      await this.driver.executeScript(
        'arguments[0].scrollTop = arguments[1]',
        container,
        targetScrollPosition
      );
      await this.driver.sleep(1000);

      currentHeight = await this.driver.executeScript(
        'return arguments[0].scrollHeight',
        container
      );
      await this.driver.sleep(1000);
    } while (currentHeight > previousHeight);
    await this.driver.executeScript(
      'arguments[0].scrollTop += 50', 
      container
    );
  }
  //The method selected in list elements from array
  async checkElFromArrayInList(array, locator) {
    const listOfEl = await this.driver.findElements(
      By.className(locator)
    );
    for (const [index, el] of listOfEl.entries()) {
      if (array.includes(await el.getText())) {
        const threeDotsElement = await this.driver.findElements(By.css('.dots-actions'));
        const menuElement = await threeDotsElement[index];
        await this.driver.wait(until.elementIsEnabled(menuElement), 10000);
        await menuElement.click();
        await this.driver.wait(until.elementLocated(By.css('.dots-actions[editmenuopen]')),10000)
        const activeMenu = await this.driver.findElement(
          By.css('.dots-actions[editmenuopen]')
        );
        await this.driver.wait(until.elementIsEnabled(activeMenu), 10000);
        const menuEl = await activeMenu.findElement(By.id('selectItem'));
        await this.driver.wait(until.elementIsEnabled(menuEl, 10000));
        await menuEl.click();

        while ((await activeMenu.getAttribute('editmenuopen')) === true) {
          await this.driver.sleep(500);
        }
      }
    }
  }
  ////The check selected el counter
  async checkCounter(selectNumber){

    const counterEl = await this.driver.wait(until.elementLocated(By.css('.btns-multiselect-wrapper[ismultiselect="true"]')),1000).catch(()=>null)
    if(counterEl === null){
      console.log('Not select elements');
      return
    }
    else{
      const counter = await this.driver.findElement(By.css('.btns-multiselect-wrapper[ismultiselect="true"] .selected-item-text'));
      const counterText = await counter.getText();
      const counterNumber = counterText.split(':')[1].trim()
      if(selectNumber === Number(counterNumber)){
        console.log("Test passed");
        return
      }
      throw new Error('Test failed')
    }
  }
  // The method check the element is missing
  async checkMissingElement(locator, waitingTime=1000){
    const missingEl = await this.driver.wait(until.elementLocated(By.css(locator)),waitingTime).catch(() => null);
    if(missingEl === null){
      console.log('Element is missing');
      return true
    }
    console.log('Element find');
    return false
  }
  //The method for find element and get element text, or attrubute text
  async getElementText(locator, text=true, attr=false){
    await this.driver.wait(until.elementLocated(By.css(locator)),10000);
    const el = await this.driver.findElement(By.css(locator));
    if(text){
      const elText = await el.getText();
          
      if(elText.length>0 && elText===''){
        console.log('element has not text');
        return
      }
      return elText
    }
    if(attr){
      const attrText = await el.getAttribute(attr);
      
      if(attrText.length>0 && attrText===''){
        console.log('element has not attribute');
        return
      }
      return attrText
    }
  }
  //The method for clearing search input
  async clearSearchInput(){
    const inputWithText = await this.driver.findElement(By.css('.search-input'));
    let inputValue = await inputWithText.getAttribute('value');
   
    console.log(inputValue);
    
    await inputWithText.clear();
    const clearIcon = await this.driver.wait(until.elementLocated(By.css('.clear-icon')),10000).catch(()=>null);
    
    if(clearIcon !== null){
      await clearIcon.click();
    }
    let waitClear=0;
    while (inputValue.length > 0 || waitClear === 5) {
      const clearInput = await this.driver.findElement(By.css('.search-input'))
      inputValue = await clearInput.getAttribute('value');
      waitClear +=1;
    }
  }
  // The method which утеук text in search input 
  async enterTextInSearchInput(text, inputLocator = '.label-search' ){
    await this.driver.wait(until.elementLocated(By.css(inputLocator)),10000)
    const searchingFormInput = await this.driver.findElement(
      By.css(inputLocator)
    );
    await this.driver.wait(until.elementIsEnabled(searchingFormInput));
    await searchingFormInput.sendKeys(text);
  }
  // The method returns form error  or errors message
  async formErrorMsgArray(errorlocator='.error-message'){
    await this.driver.wait(until.elementsLocated(By.css(errorlocator)),10000);
    const errorElements = await this.driver.findElements(By.css(errorlocator));
    let errorArray =[]
    if(errorElements){
      for(let i=0; i<errorElements.length; i+=1){
        const errorMsg = await errorElements[i].getText();
        errorArray.push(errorMsg)
      }
      return errorArray
    }
    console.log('Form has not errors');
    return false
  }
}
module.exports = Base;
