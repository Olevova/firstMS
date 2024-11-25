const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const path = require('path');
const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda,
} = require('../../utils/webdriver');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorMaterials = require('../../utils/locators/locatorMaterials');
const config = require('../../utils/config');

class CreateMaterials extends Base {
  async handleInputField(locator, value, isUpdate) {
    if (value) {
      const fieldEl = await this.driver.findElement(locator);
      if (isUpdate) {await fieldEl.clear();
        await this.driver.sleep(500);
      }
      await fieldEl.sendKeys(value);
    }
  }

  async attachFile(inputEl, file) {
    if (!withoutLambda && !isRunningInDocker && !isRunningInTeamCity) {
      console.log(__dirname, '__dirname');
      const filePath = path.join(__dirname, '..', '..', 'utils', 'files', file);
      console.log(filePath);
      await inputEl.sendKeys(filePath);
    } else if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
      const pathLambda = config.lambdaPathWindows + `${file}`;
      console.log('lambda', pathLambda);
      await inputEl.sendKeys(pathLambda);
    } else {
      const pathSel = config.lambdaPathDockerChrom + `${file}`;
      console.log('running in Selenium hub', pathSel);
      await inputEl.sendKeys(pathSel);
    }
  }

  async materialFormIsOpen() {
    const formOpen = await this.isFirstInputFocused(
      '.form-invite.form-create',
      'fail'
    ).catch(error => error);
    console.log(formOpen, 'formOpen');

    if ((await formOpen) === null) {
      throw new Error('Materials form not opened or first element not focused');
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async openMaterialsAddMaterialsForm() {
    await this.clickElement('#btnCreate');
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBackdropFormInvite),
      10000
    );
    const saveMaterialsBtn = await this.driver.findElement(
      locatorsCommon.baseBtnSubmitMobile
    );
    await this.driver.wait(until.elementIsEnabled(saveMaterialsBtn), 10000);
  }


  async fillOrUpdateMaterialsFields(
    options = {}
  ) {
    const {
      save = false,
      notification = true,
      tag,
      description = false,
      unit,
      supplier,
      area,
      submittalStatus,
      file = false,
      orderStatus,
      eta = false,
      grossQty = false,
      orderQty = false,
      orderDate = false,
      paymentStatus = false,
      receivedQty = false,
      location = false,
      materialNotes = false,
      fileSecondInput = false,
      isUpdate = false,
    } = options;
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    if (isUpdate) {
      await this.materialFormIsOpen();
    }
    await this.handleInputField(
      locatorMaterials.materialsTagElement,
      tag,
      isUpdate
    );
    await this.handleInputField(
      locatorMaterials.materialsDescriptionElement,
      description,
      isUpdate
    );

    if (unit) {
      const unitEl = await this.driver.findElement(
        locatorMaterials.materialsUnitElement
      );
      await this.driver.wait(until.elementIsEnabled(unitEl), 10000);
      await unitEl.click();
      await this.waitListDate('.material__unit-menu__text', 4);
      await this.driver.sleep(500);
      const unitList = await this.driver.findElements(
        locatorMaterials.materialUnitMenuText
      );
      await this.findDateInDropDown(unitList, unit);
    }
    await this.handleInputField(
      locatorMaterials.materialsSupplierElement,
      supplier,
      isUpdate
    );
    await this.handleInputField(
      locatorMaterials.materialsAreaElement,
      area,
      isUpdate
    );

    if (submittalStatus) {
      const submittalStatusEl = await this.driver.findElements(
        locatorMaterials.materialsSelectBtnElement
      );
      for (let i of submittalStatusEl) {
        const elText = await i.getText();
        if (elText.trim() === 'Not Submitted') {
          await i.click();
          await this.waitListDate('.material__unit-menu__item', 2);
          const submittalStatusList = await this.driver.findElements(
            locatorMaterials.materialUnitMenuItem
          );
          await this.findDateInDropDown(submittalStatusList, submittalStatus);
        }
      }
      
    }

    if(orderStatus){
      const submittalStatusEl = await this.driver.findElements(
        locatorMaterials.materialsSelectBtnElement
      );
      for (let i of submittalStatusEl) {
        const elText = await i.getText();
        if (elText.trim() === 'Not Ordered') {
          await i.click();
          await this.waitListDate('.material__unit-menu__item', 2);
          const orderStatusList = await this.driver.findElements(
            locatorMaterials.materialUnitMenuItem
          );
          await this.findDateInDropDown(orderStatusList, orderStatus);
        }
      }
    }
    if (file) {
      const fileEl = await this.driver.findElements(
        locatorMaterials.materialsFileInputMobile
      );
      await this.attachFile(fileEl[0], file);
    }
    await this.handleInputField(
      locatorMaterials.materialsEtaDateElement,
      eta,
      isUpdate
    );
    await this.handleInputField(
      locatorMaterials.materialsGrossQtyElement,
      grossQty,
      isUpdate
    );
    await this.handleInputField(
      locatorMaterials.materialsOrderQtyElement,
      orderQty,
      isUpdate
    );
    await this.handleInputField(
      locatorMaterials.materialsOrderDateElement,
      orderDate,
      isUpdate
    );

    if (paymentStatus) {
      const paymentStatusEl = await this.driver.findElement(
        locatorMaterials.materialsPaymentStatusElement
      );
      await this.driver.wait(until.elementIsEnabled(paymentStatusEl), 10000);
      await paymentStatusEl.click();
      await this.waitListDate(
        '[openmenu="true"] .material__unit-menu__item',
        2
      );
      const paymentStatusList = await this.driver.findElements(
        locatorMaterials.materialUnitMenuItemOpenMenu
      );
      await this.findDateInDropDown(paymentStatusList, paymentStatus);
    }
    await this.handleInputField(
      locatorMaterials.materialsReceivedQtyElement,
      receivedQty,
      isUpdate
    );

    if (location) {
      const locationEl = await this.driver.findElement(
        locatorMaterials.materialsStoredLocationElement
      );
      await locationEl.click();
      await this.waitListDate('.material__unit-menu__item', 2);
      const locationList = await this.driver.findElements(
        locatorMaterials.materialUnitMenuItem
      );
      await this.findDateInDropDown(locationList, location);
    }
    await this.handleInputField(
      locatorMaterials.materialsNotesElement,
      materialNotes,
      isUpdate
    );
    if (fileSecondInput) {
      const fileEl = await this.driver.findElements(
        locatorMaterials.materialsFileInputMobile
      );
      await this.attachFile(fileEl[1], file);
    }

    if (save) {
      const submitBtn = await this.driver.findElement(
        locatorsCommon.baseBtnSubmitMobile
      );
      await this.driver.actions().scroll(0, 0, 0, 0, submitBtn).perform();
      await this.clickElement('#btnSubmitMobile');
      if (notification) {
        await this.notificationCheck();
      }
    }
  }

  async deleteMaterials(materialsTag, id = false) {
    await this.waitListDate('.material-name', 1);
    await this.driver.wait(
      until.elementLocated(locatorMaterials.materialTableRow),
      10000
    );
    if (materialsTag) {
      this.findItemAndOpenThreeDotsMenu(materialsTag, '.material-name');
    }
    if (id) {
      this.findItemAndOpenThreeDotsMenu(id, '.material-id');
    }
    await this.clickElement('#deleteItem');
    await this.clickElement('#btnDeleteTask');

    await this.notificationCheck();
    await this.checkDeleteItem('.material-name', materialsTag);
  }

  async addCustomStatusInMaterials(unit, notification=true, payment = false, location = false, save=true ) {
    await this.materialFormIsOpen();
    const elementForChange = unit
      ? await this.driver.findElement(locatorMaterials.materialsUnitElement)
      : payment
      ? await this.driver.findElement(
          locatorMaterials.materialsPaymentStatusElement
        )
      : location
      ? await this.driver.findElement(
          locatorMaterials.materialsStoredLocationElement
        )
      : null;
    const text = unit ? unit : payment ? payment : location ? location : '';
    await this.driver.wait(until.elementIsEnabled(elementForChange), 10000);
    await elementForChange.click();
    await this.waitListDate('.material__unit-menu__text', 3);
    await this.driver.sleep(500);
    const addBtn = await this.driver.findElement(
      locatorMaterials.materialUnitMenuAddNew
    );
    await this.driver.wait(until.elementIsEnabled(addBtn), 10000);
    await addBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorMaterials.materialsCreateOptionInputDesk),
      10000
    );
    const inputText = await this.driver.findElement(
      locatorMaterials.materialsCreateOptionInputDesk
    );
    await inputText.sendKeys(text);
    if(save){
      await this.driver
      .findElement(locatorMaterials.materialCreateUnitBtnSave)
      .click();
    }
     if(notification){
      await this.notificationCheck();
     } 
    
  }

  async deletCustomStatusInMaterials(unit, payment = false, location = false) {
    await this.materialFormIsOpen();
    const elementForChange = unit
      ? await this.driver.findElement(locatorMaterials.materialsUnitElement)
      : payment
      ? await this.driver.findElement(
          locatorMaterials.materialsPaymentStatusElement
        )
      : location
      ? await this.driver.findElement(
          locatorMaterials.materialsStoredLocationElement
        )
      : null;
    await this.driver.wait(until.elementIsEnabled(elementForChange), 10000);
    await elementForChange.click();
    await this.waitListDate('.material__unit-menu__text', 4);
    await this.driver.sleep(1000);
    const dropdownElements = await this.driver.findElements(
      locatorMaterials.materialUnitMenuItem
    );
    const checkEl = unit
      ? unit
      : payment
      ? payment
      : location
      ? location
      : null;
    if (checkEl === null) {
      throw new Error('Has not element for delete');
    }
    for (let el of dropdownElements) {
      const textEl = await el.findElement(
        locatorMaterials.materialUnitMenuText
      );      
      if ((await textEl.getText()) === checkEl) {
        const delBtn = await el.findElement(locatorMaterials.materialMenuDeleBtn).click();
        await this.notificationCheck();
        return;
      }
    }
    throw new Error('Not delete materials element');
  }

  async updateMaterialStatus(materialElement, targetStatus, isSubmittalStatus) {
    const listStatus = await materialElement.findElements(locatorMaterials.materialsStatusTableEl);
    const statusElement = isSubmittalStatus ? listStatus[0] : listStatus[1];
    await statusElement.click();
  
    await this.waitListDate('.material-colored-status-td[openmenu] .material-status-menu__item', 3);
    const statuses = await this.driver.findElements(locatorMaterials.materialsStatusInTableMenu);
  
    for (let el of statuses) {
      if ((await el.getText()) === targetStatus) {
        await el.click();
        await this.notificationCheck();
        return;
      }
    }
  
    throw new Error(`Status "${targetStatus}" not found in the menu`);
  }

  async changeMaterialsStatusInTable(options = {}) {
    const { materials = false, submittalStatus, orderStatus } = options;
  
    await this.waitListDate('.item-info-list', 1);
    const materialsList = await this.driver.findElements(locatorsCommon.baseItemInfoList);
  
    console.log(await materialsList.length);
    const targetStatus = submittalStatus || orderStatus;
  
    if (!materials) {
      await this.updateMaterialStatus(materialsList[0], targetStatus, submittalStatus);
      return;
    }
    for (let materialEl of materialsList) {
      const materialText = await materialEl.findElement(locatorMaterials.materialsName);
      if (await materialText.getText() === materials) {
        await this.updateMaterialStatus(materialEl, targetStatus, submittalStatus);
        return;
      }
    }
  }
  
  async checkMaterialsStatusInTable(materials){
    await this.waitListDate('.item-info-list', 1);
    const materialsList = await this.driver.findElements(locatorsCommon.baseItemInfoList);
    for(let el of materialsList){
      const materialText = await el.findElement(locatorMaterials.materialsName);
      const text = await materialText.getText();
      console.log(text, "text", materials);
      
      if(await text.trim() === materials){
        let statuses = {}
        const listStatus = await el.findElements(locatorMaterials.materialsStatusTableEl);
        statuses['Submittal'] = await listStatus[0].getText();
        statuses['Order'] = await listStatus[1].getText();
        return statuses
      }
    }
    throw new Error('Not such materials tag')
  }

  async waitFilterInputFull(element){
  const filterInputElement = await element; 
  let inputValue = await filterInputElement.getAttribute('value');
  let counter = 0;
  while (Number(inputValue) < 0 && counter < 3) {
    counter += 1;
    await this.driver.sleep(1000);
    inputValue = await filterInputElement.getAttribute('value');  
  }
  if (counter >= 3) {
    throw new Error("Filter input did not reset within the allowed attempts.");
  }
  }

  async filterMaterials(submittal, order, payment) {
    const filterForm = await this.driver.findElement(locatorsCommon.baseFilterForm);
    const filterFormBtn = await this.driver.findElement(locatorsCommon.baseFilterBtn);

    await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
    await filterFormBtn.click();

    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseFilterForm),
      10000
    );
    
    const inputButtons = await this.driver.findElements(locatorMaterials.materialsSelectBtnElement);
  
    const processFilter = async (filterValue, buttonIndex, input=false) => {
      if (!filterValue) return;
      if(input){
        const filterBtn = await this.driver.findElement(locatorMaterials.materialsPaymentInput);
        await this.driver.wait(until.elementIsEnabled(filterBtn), 10000);
        await filterBtn.click();
        await this.waitListDate('.material-unit-btn-wrapper[openmenu] .material__unit-menu__item', 2);
        await this.findAndClickOnLinInTheList(filterValue, '.material-unit-btn-wrapper[openmenu] .material__unit-menu__item');
      }
      else{
        const filterBtn = inputButtons[buttonIndex];
        await this.driver.wait(until.elementIsEnabled(filterBtn), 10000);
        await filterBtn.click();
    
        await this.waitListDate('.material-unit-btn-wrapper[openmenu] .material__unit-menu__item', 5);
        await this.findAndClickOnLinInTheList(filterValue, '.material-unit-btn-wrapper[openmenu] .material__unit-menu__item');
    
        const inputs = await this.driver.findElements(locatorMaterials.materialsSelectBtnElement);
        await this.waitFilterInputFull(inputs[buttonIndex]);
      }
     
    };
  
    try {
      await processFilter(submittal, 0);
      await processFilter(order, 1);
      await processFilter(payment, false, true);
    } catch (error) {
      console.error("Error processing filters:", error);
      throw error;
    }
    await filterFormBtn.click();
    while ((await filterForm.getAttribute('visible')) === 'true') {
      await this.driver.sleep(1000);
    }
  }

  async sortMaterialsById(max=true, returnArray=false){
    await this.clickElement('.table-sort-icon-btn');
    await this.waitListDate('.material-id',2);
    const idNumber = [];
    const id = await this.driver.findElements(locatorMaterials.materialsIdElements);
    for(let el of id){
      const number = await el.getText();
      idNumber.push(number);
    }
    if(returnArray){
      return idNumber
    }
    if(max){
      console.log(idNumber);
      return idNumber.every((val, i, array) => i === 0 || val > array[i - 1]);
    }
    else{
      console.log(idNumber);
      return idNumber.every((val, i, array) => i === 0 || val < array[i - 1]);
    }
  }

  
}

module.exports = CreateMaterials;
