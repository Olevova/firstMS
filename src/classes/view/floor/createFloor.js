const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const locatorFloor = require('../../../utils/locators/locatorRoom'); 
const locatorsCommon = require('../../../utils/locators/locatorsCommon'); 

class CreatFloor extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.duplicateFloorTitle = '';
    this.floorList = [];
    this.floorListAfterResetFilter = [];
    this.filterItem = '';
    this.firstElement = '';
    this.secondElement = '';
  }

  async createFloor(floor) {
    await this.driver.wait(until.elementLocated(locatorFloor.floorAddFloorBtn), 10000);
    const addFloorBtn = await this.driver.findElement(locatorFloor.floorAddFloorBtn);
    await this.driver.wait(until.elementIsEnabled(addFloorBtn), 10000);
    await addFloorBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorFloor.florrCreateNewFloorBtn),
      10000
    );
    const creatNewFloorBtn = await this.driver.findElement(
      locatorFloor.florrCreateNewFloorBtn
    );
    await creatNewFloorBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorFloor.floorCreateFloorInput),
      10000
    );
    const floorInput = await this.driver.findElement(locatorFloor.floorCreateFloorInput);
    await floorInput.sendKeys(floor);
    const submitBtn = await this.driver.findElement(locatorFloor.floorSubmitBtn);
    await submitBtn.click();
  }

  async checkFloorCreation(floor) {
    await this.notificationCheck();
    await this.checkCreateItem('.cdk-drag .floor-item', floor);
  }

  async deleteFloor(floor) {
    await this.driver.wait(
      until.elementsLocated(locatorFloor.floorItem),
      10000
    );
    const floors = await this.driver.findElements(
      locatorFloor.floorItem
    );
    for (let item of floors) {
      if (item) {
        if ((await item.getText()) === floor) {
          await item.click();
          await this.driver.sleep(1000);
          const treeDots = await item.findElement(locatorFloor.floorMenuListFloorOpen);
          await this.driver.wait(
            until.elementLocated(locatorFloor.floorMenuListFloorOpen),
            10000
          );

          await this.driver.wait(until.elementIsEnabled(treeDots), 10000);
          await treeDots.click();
          break;
        }
      } else {
        throw new Error('Floor is not created');
      }
    }

    await this.driver.wait(
      until.elementLocated(locatorFloor.floorDeleteFloorBtn),
      10000
    );
    const delBtn = await this.driver.findElement(locatorFloor.floorDeleteFloorBtn);
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000).click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseDelStatusProjectBtnId),
      10000
    );
    const confirmDeleteBtn = await this.driver.findElement(
      locatorsCommon.baseDelStatusProjectBtnId
    );
    await this.driver.sleep(1000);
    await confirmDeleteBtn.click();
  }

  async checkDeleteFloor(floor) {
    await this.notificationCheck();
    await this.checkDeleteItem('.cdk-drag.floor-item', floor);
  }

  async duplicateFloor(floor='default') {
    await this.driver.wait(
      until.elementsLocated(locatorFloor.floorItem),
      10000
    );
    const floors = await this.driver.findElements(
      locatorFloor.floorItem
    );
    const addFloorBtn = await this.driver.findElement(locatorFloor.floorAddFloorBtn)
    await this.driver.wait(until.elementIsEnabled(addFloorBtn), 10000);
    await addFloorBtn.click();
    await this.driver.wait(until.elementLocated(locatorFloor.floorAddFloorMenuWithBtnWrapper),10000);
    await this.driver.sleep(2000);
    const duplicateBlock = await this.driver.wait(until.elementLocated(locatorFloor.floorDuplicateFloorVariantsList),3000).catch(()=>null);
    if (duplicateBlock===null){
      throw new Error('The project has no Floor for duplicate')

    }
    const duplicateList = await duplicateBlock.findElements(locatorFloor.floorDuplicateFloorVariantsItem)
    if(floor==='default'){
      await this.driver.wait(until.elementIsEnabled(duplicateList[0]),10000);

      this.duplicateFloorTitle = await duplicateList[0].getText() + " #2";
      await duplicateList[0].click();
      
    }
   
    else{
      this.duplicateFloorTitle = floor + " #2";
      this.findAndClickOnLinInTheList(floor,'.duplicate-floor-variants__item');

    }
    await this.notificationCheck();
    await this.checkCreateItem('.cdk-drag .floor-item', this.duplicateFloorTitle)
    console.log(this.duplicateFloorTitle, 'Duplicate floor title');
    return this.duplicateFloorTitle
  }
  
  async editFloor(floor, newfloor) {
    await this.driver.wait(
      until.elementsLocated(locatorFloor.floorItem),
      10000
    );
    const floors = await this.driver.findElements(
      locatorFloor.floorItem
    );
    for (let item of floors) {
      if (item) {
        if ((await item.getText()) === floor) {
          await item.click();
          await this.driver.sleep(1000);
          const treeDots = await item.findElement(locatorFloor.floorMenuListFloorOpen);
          await this.driver.wait(
            until.elementLocated(locatorFloor.floorMenuListFloorOpen),
            10000
          );
          await this.driver.wait(until.elementIsEnabled(treeDots), 10000);
          await treeDots.click();

          await this.driver.wait(
            until.elementLocated(locatorFloor.floorEditFloorBtn),
            10000
          );
          const editBtn = await this.driver.findElement(locatorFloor.floorEditFloorBtn);
          await this.driver
            .wait(until.elementIsEnabled(editBtn), 10000)
            .click();
          await this.driver.wait(until.stalenessOf(editBtn), 10000);
          break;
        }
      } else {
        throw new Error('Floor is not created');
      }
    }

    await this.driver.wait(
      until.elementLocated(locatorFloor.floorFormEditFloor),10000
    );
    const form = await this.driver.findElement(
      locatorFloor.floorFormEditFloor
    );
    const inputFloor = await form.findElement(locatorsCommon.baseInputCreateItem);
    await this.driver.wait(until.elementIsEnabled(inputFloor), 10000);
    await inputFloor.clear();
    await this.driver.sleep(500);
    await inputFloor.sendKeys(newfloor);

    const saveBtn = await form.findElement(locatorFloor.floorSaveEditFloorBtn);
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
  }

  async checkFloorInProjectProgressTab() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
        locatorFloor.floorsListItemTitle
      ),
      10000
    );
    const floors = await this.driver.findElements(
      locatorFloor.floorsListItemTitle
    );
    if ((await floors.length) < 1) {
      throw new Error('Project has no Floors');
    }
    for (let floor of floors) {
      const floorName = await floor.getAttribute('title');
      this.floorList.push(floorName);
    }
    console.log(this.floorList);
  }
  async filterByFirstRoom() {
    await this.driver.wait(until.elementLocated(locatorFloor.floorFilterFloors), 10000);
    const filterBtn = await this.driver.findElement(locatorFloor.floorFilterFloors);
    await this.driver.wait(until.elementIsEnabled(filterBtn), 10000);
    await filterBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorFloor.floorFiltersListVisible),
      10000
    );
    const floorsCheckBox = await this.driver.findElements(
      By.css('.filters-list__item')
    );
    this.filterItem = await floorsCheckBox[0].getText();
    await this.driver.wait(
      until.elementsLocated(locatorFloor.floorFiltersListCheckboxContainer),
      10000
    );

    const checkBoxs = await this.driver.findElements(
      locatorFloor.floorFiltersListCheckboxContainer
    );
    await this.driver.wait(until.elementIsEnabled(checkBoxs[0]), 10000);
    await checkBoxs[0].click();
    await this.driver.findElement(locatorsCommon.baseBtnFilterCss).click();
  }

  async checkOfFilterOperationByFloors() {
    await this.driver.wait(
      until.elementLocated(locatorFloor.floorFiltersListHidden),
      10000
    );
    await this.driver.sleep(500);
    const filterFloorForCheck = await this.driver.findElements(
      locatorFloor.floorsListDisplayFlex
    );
    const titleOfFilterFloor = await filterFloorForCheck[0].getAttribute(
      'title'
    );
    console.log(titleOfFilterFloor, filterFloorForCheck.length, this.filterItem);
    if (
      titleOfFilterFloor === this.filterItem &&
      filterFloorForCheck.length === 1
    ) {
      console.log('Floor filter is working');
    } else {
      throw new Error('Filter is not working');
    }
    // await this.driver.sleep(1000);
  }
  async resetFilterAndCheckResult() {
    await this.driver.wait(
      until.elementLocated(
        locatorFloor.floorResetFilterBtn
      ),
      10000
    );
    const resetFilterBtn = await this.driver.findElement(
      locatorFloor.floorResetFilterBtn
    );
    await resetFilterBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorFloor.floorResetFilterAmountFilters),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(
        locatorFloor.floorsListItemTitle
      ),
      10000
    );
    const floors = await this.driver.findElements(
      locatorFloor.floorsListItemTitle
    );
    if ((await floors.length) < 1) {
      throw new Error('Project has no Floors');
    } else {
      for (let floor of floors) {
        let name = await floor.getAttribute('title');
        this.floorListAfterResetFilter.push(name);
      }
      if (
        JSON.stringify(this.floorListAfterResetFilter) ===
        JSON.stringify(this.floorListAfterResetFilter)
      ) {
        console.log('Reset filter works');
      } else {
        throw new Error('Reset filter does not work');
      }
    }
  }

  async sequenceChange(){
   
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    const numberOfItems =await this.driver.wait(until.elementsLocated(locatorFloor.floorItem),10000);
    if(await numberOfItems === null){
        throw new Error('Insufficient quantity of items')
    };
    const floors = await this.driver.findElements(locatorFloor.floorItem);
    
    const draggable = await floors[0];
    const droppable = await floors[1];
    this.firstElement = await draggable.getText();
    this.secondElement = await droppable.getText();
    
    const start = await this.getCoordinates(droppable);
    console.log(start);
    const actions = this.driver.actions({ async: true });
    await this.driver.actions().move({ origin: draggable }).perform();
    await this.driver.actions().press().perform();
    await actions.move({x: Math.round(start.x), y: Math.round(start.y)}).pause(1000).perform();
    await actions.release().perform();
    await this.driver.sleep(1000);
    
}
async checkSequence(){
    const afterChange = await this.driver.findElements(locatorFloor.floorItem);
    if(await afterChange[0].getText() === this.secondElement && 
    await afterChange[1].getText()  === this.firstElement){
        console.log("Changing the floor sequence was successfully");
        return
    }
    throw new Error('Changing the floor sequence was failed')
}

}

module.exports = CreatFloor;
