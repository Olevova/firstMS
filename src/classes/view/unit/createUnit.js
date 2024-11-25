const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const locatorUnit = require('../../../utils/locators/locatorRoom'); 
const locatorsCommon = require('../../../utils/locators/locatorsCommon'); 

class CreateUnit extends Base {
  async duplicateUnitInformation() {
    await this.driver.wait(
      until.elementLocated(
        locatorUnit.unitDragContainer
      ),
      10000
    );
    const units = await this.driver.findElements(
      locatorUnit.unitDragContainer
    );
    const floors = await this.driver.findElements(
      locatorUnit.floorItem
    );
    if ((await units.length) > 0 && (await floors.length) > 1) {
      this.duplicateUnitName = await units[0]
        .findElement(locatorUnit.unitNameWrapper)
        .getAttribute('title');
      const rooms = await units[0].findElements(locatorUnit.roomsListItem);
      this.duplicateUniRoomsNumber = await rooms.length;
      this.firstFloorName = await floors[0].getAttribute('title');
      this.secondFloorName = await floors[1].getAttribute('title');
      await floors[1].click();
    } else {
      throw new Error('Insufficient number of Units or floors');
    }
  }

  async findAndClickDuplicate(floorname, element) {
    await this.driver.wait(
      until.elementsLocated(
        locatorUnit.floorDuplicateFloorsListItem
      ),
      10000
    );
    const duplicateUnits = await this.driver.findElements(
      locatorUnit.floorDuplicateFloorsListItem
    );
    let notDuplicate = false;
    for (const duplicate of duplicateUnits) {
      const duplicateName = await duplicate.getText();

      if ((await duplicateName.trim()) === floorname) {
        await duplicate.click();
        await this.driver.wait(
          until.elementsLocated(
            locatorUnit.duplicateUnitsVariantItem,
            10000
          )
        );
        const unitsForDuplicate = await this.driver.findElements(
          locatorUnit.duplicateUnitsVariantItem
        );

        for (const unit of unitsForDuplicate) {
          console.log('in unit for clone', await unit.getText());
          if ((await unit.getText()) === element) {
            await this.driver.wait(until.elementIsVisible(unit), 10000);
            await unit.click();
            notDuplicate = true;
            return;
          }
        }
      }
    }

    if (!notDuplicate) {
      throw new Error('It has not such duplicate in this project');
    }
  }

  async createForm(driver) {
    const firstUnitForm = await driver
      .wait(
        until.elementLocated(
          locatorUnit.unitCreateUnitForm
        ),
        3000
      )
      .catch(() => null);
    if (firstUnitForm !== null) {
      const inputUnit = await firstUnitForm.findElement(
        locatorUnit.unitCreateUnitInput
      );
      await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    } else {
      await this.driver.wait(
        until.elementLocated(locatorUnit.unitCreateNewUnitBtn),
        10000
      );
      const createBtn = this.driver.findElement(locatorUnit.unitCreateNewUnitBtn);
      await this.driver.wait(until.elementIsEnabled(createBtn), 10000);
      await createBtn.click();
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.duplicateUnitName = '';
    this.duplicateUniRoomsNumber = null;
    this.firstFloorName = '';
    this.secondFloorUnitsNumber = null;
    this.duplicatedUnitForDeleting = '';
    this.firstElement = '';
    this.secondElement = '';
  }

  async createUnit(unit) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.wait(until.elementsLocated(By.css('head style')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(locatorUnit.unitAddUnitBtn), 10000);
    const addUnitBtn = await this.driver.findElement(locatorUnit.unitAddUnitBtn);
    await this.driver.wait(until.elementIsEnabled(addUnitBtn), 10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnitBtn).perform();
    await addUnitBtn.click();
    await this.createForm(this.driver);

    await this.driver.wait(
      until.elementLocated(locatorUnit.unitCreateUnitInput),
      10000
    );
    const unitInput = await this.driver.findElement(locatorUnit.unitCreateUnitInput);
    await unitInput.sendKeys(unit);
    await this.driver.wait(until.elementLocated(locatorUnit.unitCreateUnitSubmitBtn), 10000);
    const submitBtn = await this.driver.findElement(locatorUnit.unitCreateUnitSubmitBtn);
    await this.driver.wait(until.elementIsEnabled(submitBtn), 10000);
    await submitBtn.click();
    await this.notificationCheck()
  }

  async checkCreateUnit(unit) {
    await this.driver.sleep(1000);
    await this.checkCreateItem('.unit-name-wrapper p', unit);
  }

  async deleteUnit(unit) {
    await this.driver.wait(
      until.elementsLocated(locatorUnit.unitNameWithBtnWrapper),
      10000
    );
    const units = await this.driver.findElements(
      locatorUnit.unitNameWithBtnWrapper
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitName = await item.findElement(locatorUnit.unitNameText);
        if ((await unitName.getText()) === unit) {
          const menuBtn = await item.findElement(locatorUnit.unitMenuNameWithBtnWrapper);
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          noBtn = true;
          await menuBtn.click();
          const delUnitBtn = await this.driver.findElement(locatorUnit.unitDeleteBtn);
          await this.driver.wait(until.elementIsEnabled(delUnitBtn), 10000);
          this.driver.sleep(1000);
          await delUnitBtn.click();
          break;
        }
      }
    }

    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);

    const modal = await this.driver.findElement(locatorsCommon.baseBackdrop);
    const confirmDelBtn = await modal.findElement(locatorsCommon.baseDelStatusProjectBtnId);
    await this.driver.sleep(2000);
    await this.driver.wait(until.elementIsEnabled(confirmDelBtn), 10000);
    await confirmDelBtn.click();
  }

  async checkDeleteUnit(unit) {
    await this.notificationCheck();
    await this.checkDeleteItem('.unit-name-wrapper p', unit);
  }

  async duplicateUnitBetweenFloor() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.duplicateUnitInformation();

    await this.driver.wait(until.elementLocated(locatorUnit.unitAddUnitBtn), 10000);
    await this.driver.wait(
      until.elementLocated(
        locatorUnit.unitDragContainer
      ),
      10000
    );
    await this.driver.sleep(2000);
    const unitsOfSecondFloor = await this.driver.findElements(
      locatorUnit.unitDragContainer
    );
    this.secondFloorUnitsNumber = await unitsOfSecondFloor.length;
    const addUnit = await this.driver.findElement(locatorUnit.unitAddUnitBtn);
    await this.driver.wait(until.elementIsEnabled(addUnit));
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    await addUnit.click();

    await this.driver.sleep(2000);
    await this.findAndClickDuplicate(
      this.firstFloorName,
      this.duplicateUnitName
    );
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.waitListDate(
      '.cdk-drag[cdkdragpreviewcontainer="parent"]',
      this.secondFloorUnitsNumber + 1
    );

    const unitsAll = await this.driver.findElements(
      locatorUnit.unitDragContainer
    );
    if (this.secondFloorUnitsNumber < (await unitsAll.length)) {
      const unitsName = await this.driver.findElements(
        locatorUnit.unitNameWithBtnWrapper
      );
      for (const unit of unitsName) {
        const unitTitle = await unit
          .findElement(locatorUnit.unitNameWrapper)
          .getAttribute('title');
        if (await unitTitle.startsWith(this.duplicateUnitName)) {
          this.duplicatedUnitForDeleting = await unitTitle;
          console.log(await unitTitle);
          console.log('Unit was duplicate succesful');
          await this.driver.sleep(500);
          return;
        }
      }
    }
    throw new Error('Duplicate not work');
  }

  async duplicateUnit() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(until.elementLocated(locatorUnit.unitAddUnitBtn), 10000);
    const addUnit = await this.driver.findElement(locatorUnit.unitAddUnitBtn);
    await this.driver.wait(until.elementIsEnabled(addUnit));
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    await addUnit.click();
    await this.driver.wait(
      until.elementLocated(locatorUnit.roomAddFloorMenuCss),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorUnit.unitDuplicateUnitsListsWrapper),
      10000
    );
    const floorList = await this.driver.findElements(
      locatorUnit.floorDuplicateFloorsListItem
    );
    await floorList[0].click();
    await this.driver.wait(
      until.elementLocated(locatorUnit.unitDuplicateUnitsVariantsList),
      10000
    );
    await this.waitListDate('.duplicate-units-variants__item', 1);
    const unitsList = await this.driver.findElements(
      locatorUnit.duplicateUnitsVariantItem
    );
    const unitsForDuplicate = await unitsList[0];
    const unitsTitle = await unitsForDuplicate.getText()
    await this.driver.wait(until.elementIsEnabled(unitsForDuplicate), 10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();

    await unitsForDuplicate.click();
    await this.driver.executeScript('return document.readyState');
    await this.notificationCheck();
    await this.driver.sleep(1000);
    return unitsTitle;
  }

  async deleteDuplicateUnit() {
    await this.driver.wait(until.elementLocated(locatorUnit.unitAddUnitBtn), 10000);
    await this.driver.wait(
      until.elementLocated(
        locatorUnit.unitDragContainer
      ),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(locatorUnit.unitNameWithBtnWrapper),
      10000
    );
    const units = await this.driver.findElements(
      locatorUnit.unitNameWithBtnWrapper
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitName = await item
          .findElement(locatorUnit.unitNameWrapper)
          .getAttribute('title');
        if ((await unitName) === this.duplicatedUnitForDeleting) {
          console.log(
            await unitName,
            'unit name for del',
            this.duplicatedUnitForDeleting
          );

          const menuBtn = await item.findElement(locatorUnit.unitMenuNameWithBtnWrapper);
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          noBtn = true;
          await menuBtn.click();
          const menu = await this.driver.findElement(
            locatorUnit.unitEditMenuList
          );

          const delUnitBtn = await this.driver.findElement(locatorUnit.unitDeleteBtn);
          await this.driver.wait(until.elementIsEnabled(delUnitBtn), 10000);
          this.driver.sleep(500);
          await delUnitBtn.click();
          this.driver.sleep(500);
          break;
        }
      }
    }

    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);

    const modal = await this.driver.findElement(locatorsCommon.baseBackdrop);
    const confirmDelBtn = await modal.findElement(locatorsCommon.baseDelStatusProjectBtnId);
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsEnabled(confirmDelBtn), 10000);
    await confirmDelBtn.click();
    await this.notificationCheck();
    const unitsAfterDeleteUnit = await this.driver.findElements(
      locatorUnit.unitNameWrapper
    );
    for (const unit of unitsAfterDeleteUnit) {
      if (
        (await unit.getAttribute('title')) === this.duplicatedUnitForDeleting
      ) {
        throw new Error('Unit duplicate is not delete');
      }
    }
    console.log('Unit Duplicate deleted succesful');
    await this.driver.sleep(1000);
  }

  async editUnit(unit, newUnit) {
    await this.driver.wait(
      until.elementsLocated(locatorUnit.unitNameWithBtnWrapper)
    );
    const units = await this.driver.findElements(
      locatorUnit.unitNameWithBtnWrapper
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitName = await item.findElement(locatorUnit.unitNameText);
        if ((await unitName.getText()) === unit) {
          const menuBtn = await item.findElement(locatorUnit.unitMenuNameWithBtnWrapper);
          await this.driver.wait(until.elementIsEnabled(menuBtn));
          noBtn = true;
          await menuBtn.click();

          const editUnitBtn = await this.driver.findElement(locatorUnit.unitBtnEdit);
          await this.driver.wait(until.elementIsEnabled(editUnitBtn), 10000);
          await editUnitBtn.click();
          break;
        }
      }
    }
    await this.driver.wait(
      until.elementLocated(
        locatorUnit.unitUnitForm
      ),
      10000
    );
    const unitForm = await this.driver.findElement(
      locatorUnit.unitUnitForm
    );
    const inputUnit = await unitForm.findElement(locatorUnit.unitEditUnitInput);
    await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    await inputUnit.clear();
    await this.driver.sleep(1000);
    await inputUnit.sendKeys(newUnit);
    await unitForm.findElement(locatorUnit.unitEditUnitBtnSave).click();
    await this.driver.sleep(1000);
  }

  async editUnitByClick(unit, newUnit) {
    await this.driver.wait(
      until.elementsLocated(locatorUnit.unitNameWithBtnWrapper)
    );
    const units = await this.driver.findElements(
      locatorUnit.unitNameWithBtnWrapper
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitNameEl = await item.findElement(locatorUnit.unitNameText);
        const unitName = await unitNameEl.getText();
        // console.log(unitName, unit, unitName.toLowerCase().trim() === unit.toLowerCase());
        if ((unitName.toLowerCase().trim()) === unit.toLowerCase()) {
          await this.driver.actions().doubleClick(unitNameEl).perform()
          noBtn = true;
          await this.driver.wait(
            until.elementLocated(
              locatorUnit.unitUnitForm
            ),
            10000
          );
          
          break;
        }
      }
    }
    const unitForm = await this.driver.findElement(
      locatorUnit.unitUnitForm
    );
    const inputUnit = await unitForm.findElement(locatorUnit.unitEditUnitInput);
    await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    await inputUnit.clear();
    await this.driver.sleep(1000);
    await inputUnit.sendKeys(newUnit);
    await unitForm.findElement(locatorUnit.unitEditUnitBtnSave).click();
    await this.driver.sleep(1000);
  }

  async sequenceChange(){
   
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    const numberOfItems = await this.driver.wait(until.elementsLocated(locatorUnit.unitNameWithBtnWrapper),10000).catch(()=>null);
    if(await numberOfItems === null){
        throw new Error('Insufficient quantity of items')
    };
    const units = await this.driver.findElements(locatorUnit.unitNameWithBtnWrapper);
    
    const draggable = await units[0];
    const droppable = await units[1];
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
    const afterChange = await this.driver.findElements(locatorUnit.unitNameWithBtnWrapper);
    if(await afterChange[0].getText() === this.secondElement && 
    await afterChange[1].getText()  === this.firstElement){
        console.log("Changing the Units sequence was successfully");
        return
    }
    throw new Error('Changing the Units sequence was failed')
}
}

module.exports = CreateUnit;
