const { By, until, error } = require('selenium-webdriver');
const Base = require('../../base');
const locatorRoom = require('../../../utils/locators/locatorRoom'); 
const locatorsCommon = require('../../../utils/locators/locatorsCommon'); 

class CreateRoom extends Base {

  async findeTwoItemForSequence(floors){
    for (let floor of floors){
        const areas = await floor.findElements(locatorRoom.roomsLiListItem);
        if( await areas.length > 1){
            const draggable = await areas[0];
            const droppable = await areas[1];
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
            return
        }
    }
  }

  async compareArraysOfObjects(arr1, arr2) {
    for (const obj1 of arr1) {
        const key = Object.keys(obj1)[0];
        const obj2 = arr2.find(obj => obj.hasOwnProperty(key));

        if (obj2) {
            const arr1Values = obj1[key].sort();
            const arr2Values = obj2[key].sort();
            if (JSON.stringify(arr1Values) !== JSON.stringify(arr2Values)) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}

  async addRoomInUnit(unit) {
    if (unit !== null) {
      const units = await this.driver.findElements(
        locatorRoom.unitNameWithBtnWrapper
      );

      let isRoomCreated = false;

      for (let i of units) {
        const unitName = await i.findElement(locatorRoom.unitNameText);
        if (i) {
          const itemText = await unitName.getText();
          if (itemText === unit) {
            console.log(`find ${unit}`);
            isRoomCreated = true;
            const addRoom = await unitName.findElement(locatorRoom.roomAddRoomButton);
            await this.driver.wait(until.elementIsEnabled(addRoom), 10000);
            await addRoom.click();
            break;
          }
        }
      }
      if (!isRoomCreated) {
        await this.driver.wait(until.elementLocated(locatorRoom.roomAddRoomButton), 10000);
        const addRoom = await this.driver.findElement(locatorRoom.roomAddRoomButton);
        await this.driver.wait(until.elementIsVisible(addRoom), 10000);
        await addRoom.click();
      }
    } else {
      throw new Error("It don't have a Unit to create a room");
    }
  }

  async findAndClickTemplate(driver, roomname, element) {
    const templateRoom = await driver.findElements(
      locatorRoom.roomDuplicateFloorRoomVariantsItem
    );
    let noteTemplate = false;
    for (const template of templateRoom) {
      const templateName = await template.getText();
      if (
        templateName.toLowerCase().trim() === roomname.toString().toLowerCase()
      ) {
        const editBtn = await template.findElements(locatorRoom.roomEditRoomIcon);
        await editBtn[+`${element}`].click();
        noteTemplate = true;
        break;
      }
    }

    if (!noteTemplate) {
      throw new Error('It has not such template in this project');
    }
  }

  async waitForElements(unit) {
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);

    await this.driver.wait(
      until.elementsLocated(
        locatorRoom.roomDuplicateFloorRoomVariantsItem
      ),
      10000
    );
  }


  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.roomNumberwithSameNameOnOneFloor = null;
    this.areaNumbersInTheRoomSWithTHeSameName = null;
    this.viewRoomName = [];
    this.floor = '';
    this.projectRoomName = [];
  }

  async createTemplateRoomWithAreas(
    unit = null,
    room,
    first = false,
    areasNumber = 1
  ) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    if (!first) {
      await this.driver.wait(
        until.elementLocated(locatorRoom.roomAddRoomMenu),
        10000
      );
      const addRoomMenu = await this.driver.findElement(
        locatorRoom.roomAddRoomMenu
      );
      const createRoomBtn = await addRoomMenu.findElement(
        locatorRoom.roomCreateRoomBtn
      );
      await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
      await this.driver.sleep(1000);
      await createRoomBtn.click();
    }
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const addRoomModal = this.driver.findElement(locatorsCommon.baseBackdrop);
    const inputRoom = await addRoomModal.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await this.driver.sleep(500);
    await inputRoom.sendKeys(room);
    const addAreaBtn = await this.driver.findElement(locatorRoom.roomAddAreaField);
    await this.driver.wait(until.elementIsEnabled(addAreaBtn), 10000);
    for (let click = 0; click < areasNumber; click += 1) {
      const idForArea = await click.toString();

      const areaInput = await this.driver.findElement(
        By.css(`input[forminput="ROOM_AREA_NAME"][id="${idForArea}"]`)
      );
      await this.driver.sleep(500);
      await areaInput.sendKeys(click + 'area');
      await this.driver.sleep(500);
      await addAreaBtn.click();
      await this.driver.sleep(500);
    }
    const checkUpdateThisRoom = await addRoomModal.findElement(
      By.className('checkbox')
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const saveBtn = addRoomModal.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveBtn));
    await this.driver.sleep(1000);
    await saveBtn.click();
  }

  async createRoom(unit = null, room, first = false) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    if (!first) {
      await this.driver.wait(
        until.elementLocated(locatorRoom.roomAddRoomMenu),
        10000
      );
      const addRoomMenu = await this.driver.findElement(
        locatorRoom.roomAddRoomMenu
      );
      const createRoomBtn = await addRoomMenu.findElement(
        locatorRoom.roomCreateRoomBtn
      );
      await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
      await this.driver.sleep(1000);
      await createRoomBtn.click();
    }
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const addRoomModal = this.driver.findElement(locatorsCommon.baseBackdrop);
    const inputRoom = await addRoomModal.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await inputRoom.sendKeys(room);
    const saveBtn = addRoomModal.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveBtn));
    await this.driver.sleep(1000);
    await saveBtn.click();
  }

  async createUniqueRoomViaTemplate(unit = null, templatename, newroom) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomAddFloorMenuCss),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(locatorRoom.floorDuplicateFloorVariantsItem),
      10000
    );

    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop, 10000));
    const roomNameInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await roomNameInput.click();
    await this.driver.sleep(1000);
    await roomNameInput.clear();
    await roomNameInput.sendKeys(newroom);
    const detuchBtn = await this.driver.findElement(locatorRoom.roomDetachBtn);
    await this.driver.wait(until.elementIsEnabled(detuchBtn), 10000);
    await detuchBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomCheckboxContainer),
      10000
    );
    const btnCreateRoom = await this.driver.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(btnCreateRoom), 10000);
    await btnCreateRoom.click();
  }

  async createRoomViaTemplate(unit = null, templatename, newroom) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomAddFloorMenuCss),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(locatorRoom.floorDuplicateFloorVariantsItem),
      10000
    );
    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop, 10000));
    const roomNameInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await roomNameInput.click();
    await this.driver.sleep(1000);
    await roomNameInput.clear();
    await roomNameInput.sendKeys(newroom);

    const btnCreateRoom = await this.driver.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(btnCreateRoom), 10000);
    await btnCreateRoom.click();
  }

  async addSubtitleToTheRoom(subtitle) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(locatorRoom.roomSubtitle), 10000);
    const subtitleInput = await this.driver.findElement(locatorRoom.roomSubtitle);
    await this.driver.wait(until.elementIsEnabled(subtitleInput));
    await subtitleInput.clear();
    await subtitleInput.sendKeys(subtitle);
    await this.driver.sleep(500);
    const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnInvite);
    await saveBtn.click();
  }

  async changeRoomTitle(roomtitle, save=false) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(locatorRoom.roomNameInput), 10000);
    const roomtitleInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(roomtitleInput));
    await roomtitleInput.clear();
    await this.driver.sleep(500);
    await roomtitleInput.sendKeys(roomtitle);
    await this.driver.sleep(500);
    if(save){
      const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnInvite);
      await saveBtn.click();
    }
  }

  async createUniqueRoomByDetachingTemplate() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const detuchBtn = await this.driver.findElement(locatorRoom.roomDetachBtn);
    await this.driver.wait(until.elementIsEnabled(detuchBtn), 10000);
    await detuchBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomCheckboxContainer),
      10000
    );
    const saveBtn = await this.driver.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
  }

  async getArrayOfAreasInRoomModalForm(
    locator = '.area-form-dragIcon-with-input-wrapper .form-input-modal'
  ) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    await this.driver.wait(until.elementsLocated(By.css(locator)), 10000);
    const areaList = await this.driver.findElements(By.css(locator));
    let areaArray = [];
    for (let area of areaList) {
      const areaTitle = await area.getAttribute('value');
      console.log(areaTitle);
      areaArray.push(areaTitle);
    }
    return areaArray;
  }

  async findRoomAndGetAreasArray(unitName, roomName) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(locatorRoom.unitBlock)
    );
    const unitList = await this.driver.findElements(
      locatorRoom.unitBlock
    );
    for (let unit of unitList) {
      const findUnitName = await unit.findElement(locatorRoom.unitNameWrapper);
      if ((await findUnitName.getAttribute('title')) === unitName) {
        const RoomList = await unit.findElements(locatorRoom.roomBlock);
        for (let room of RoomList) {
          const findRoomName = await room.findElement(
            locatorRoom.roomArrowNameWrapper
          );
          if ((await findRoomName.getAttribute('title')) === roomName) {
            let areas = [];
            const listOfAreas = await room.findElements(
              locatorRoom.roomAreasListItemSecond
            );
            for (let area of listOfAreas) {
              areas.push(await area.getText());
            }
            return areas;
          }
        }
        console.log(`There is not ${roomName} room in the unit`);
        return null;
      }
    }
  }

  async checkCreateNewRoom(room) {
    await this.notificationCheck();
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomArrowNameWrapper)
    );

    await this.checkCreateItem('.room-arrow-with-name-wrapper', room);
  }

  async checkSuggestedTemplateName(unit = null, room) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomAddRoomMenu),
      10000
    );
    const addRoomMenu = await this.driver.findElement(
      locatorRoom.roomAddRoomMenu
    );
    const createRoomBtn = await addRoomMenu.findElement(locatorRoom.roomCreateRoomBtn);
    await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
    await this.driver.sleep(1000);
    await createRoomBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const addRoomModal = this.driver.findElement(locatorsCommon.baseBackdrop);
    const inputRoom = await addRoomModal.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await inputRoom.sendKeys(room);
    const checkUpdateThisRoom = await addRoomModal.findElement(
      By.className('checkbox')
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const templateName = await addRoomModal.findElement(locatorRoom.templateName);
    await this.driver.wait(until.elementIsEnabled(templateName));
    const suggestName = templateName.getAttribute('value');
    if ((await suggestName) && (await suggestName) === room) {
      console.log('room name was suggested as template name, test passed');
      return;
    } else {
      console.log(suggestName, room);
      throw new Error('test failed, check screenshot');
    }
  }

  async checkSuggestedRoomName(unit = null, templatename) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomAddFloorMenuCss),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(locatorRoom.floorDuplicateFloorVariantsItem),
      10000
    );

    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop, 10000));
    const roomNameInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(roomNameInput), 10000);
    const suggestName = roomNameInput.getAttribute('value');
    if ((await suggestName) && (await suggestName) === templatename) {
      console.log('template name was suggested as room name, test passed');
      return;
    } else {
      console.log(suggestName, room);
      throw new Error('test failed, check screenshot');
    }
  }

  async checkValidationOfRoomName() {
    const formError = await this.driver
      .wait(until.elementLocated(locatorRoom.roomNameError), 3000)
      .catch(() => null);
    if (formError) {
      const erorrMessageElement = await this.driver.findElement(
        locatorRoom.roomNameError
      );
      const errorMessage = erorrMessageElement.getText();
      console.log(await erorrMessageElement.getText(), ':error text');
      if ((await errorMessage) === 'Room with such name already exists') {
        console.log('test check validation passed');
        return;
      }

      throw new Error('You have error, check screenshot');
    } else {
      throw new Error('You have error, check screenshot');
    }
  }

  async roomGroupingWithSameNameInViewTab() {
    await this.driver.wait(
      until.elementsLocated(locatorRoom.roomsListItem),
      10000
    );
    const rooms = await this.driver.findElements(locatorRoom.roomsListItem);
    const floorActive = await this.driver.findElement(
      locatorRoom.floorActiveItem
    );
    this.floor = await floorActive.getAttribute('title');
    for (const room of rooms) {
      const roomName = await room
        .findElement(locatorRoom.roomArrowNameWrapper)
        .getAttribute('title');
      const areas = await room.findElements(
        locatorRoom.roomAreasListItemSecond
      );

      const existingRoom = this.viewRoomName.find(obj =>
        Object.keys(obj).includes(roomName)
      );
      if (!existingRoom) {
        const newObj = {};
        newObj[roomName] = [];
        for (let area of areas) {
          const areaName = await area.getText();
          if(newObj[roomName].includes(areaName)){
            continue
          } else{
            newObj[roomName].push(areaName);
          }
          
        }
        this.viewRoomName.push(newObj);
      } else {
        for (let area of areas) {
          const areaName = await area.getText();
          if (existingRoom[roomName].includes(areaName)){
            continue
          } else{
            existingRoom[roomName].push(areaName);
          }
          
        }
      }
    }
  }
  async checkGroupingInProjectProgressTab() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(locatorRoom.areaProgressList),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorRoom.roomList),
      10000
    );
    const allRoomsList = await this.driver.findElements(
      locatorRoom.roomListRooms
    );
    
    for (let room of allRoomsList) {
        const roomName = await room.findElement(locatorRoom.roomName).getText();
        const existingRoomProject  = this.projectRoomName.find(obj=>Object.keys(obj).includes(roomName));
        if(!existingRoomProject){
          const  newObj = {};
          newObj[roomName] = [];
          const areasList = await room.findElements(locatorRoom.roomAreasList);
          for (let area of areasList){
          const areaName = await area.getText();
          newObj[roomName].push(areaName)
          // console.log(newObj[roomName], 'obj');
        }
        this.projectRoomName.push(newObj);
        }
    }

    const result = await this.compareArraysOfObjects(this.projectRoomName,this.viewRoomName )
    console.log(this.projectRoomName,'project-tab', this.viewRoomName,'view-tab', result);
    if(result){
        console.log("room grouping work");
    } else {
      throw new Error('room grouping not work check screenshot');
    }
    
    this.driver.sleep(1000);
  }

  async deleteRoom(room) {
    await this.driver.wait(until.elementsLocated(locatorRoom.roomName), 10000);
    const rooms = await this.driver.findElements(locatorRoom.roomName);
    for (let item of rooms) {
      if (item) {
        // console.log(await item.getText());
        if ((await item.getText()) === room) {
          await this.driver.wait(
            until.elementLocated(locatorsCommon.baseMenuListDotsWrapper),
            10000
          );
          const menuBtn = await item.findElement(
            locatorsCommon.baseMenuListDotsWrapper
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
      until.elementLocated(locatorsCommon.baseEditMenuListOpen),
      10000
    );
    const roomMenu = await this.driver.findElement(
      locatorsCommon.baseEditMenuListOpen
    );
    const deleteRoomBtn = await roomMenu.findElement(locatorRoom.roomDeleteRoomBtn);
    await this.driver.wait(until.elementIsEnabled(deleteRoomBtn), 10000);
    await deleteRoomBtn.click();
  }

  async checkDeleteFloor(room) {
    await this.notificationCheck();
    await this.checkDeleteItem('.room-arrow-with-name-wrapper', room);
  }

  async editTemplate(unit = null, roomname, newname) {
    await this.waitForElements(this.driver, unit);
    console.log('roomname', roomname);
    await this.findAndClickTemplate(this.driver, roomname, 0);

    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const templatePopUp = await this.driver.findElement(locatorsCommon.baseBackdrop);
    await this.driver.wait(until.elementLocated(locatorRoom.roomNameInput),10000);
    const templateInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(templateInput));
    await templateInput.clear();
    await this.driver.sleep(1000);
    await templateInput.sendKeys(newname);
    const saveTemplateBtn = await this.driver.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveTemplateBtn));
    await saveTemplateBtn.click();
    await this.notificationCheck();
  }

  async checkTemplateInList(unit = null, newname) {
    await this.waitForElements(this.driver, unit);
    await this.checkCreateItem(
      '.duplicate-floor-variants__item.rooms-variants__item',
      newname
    );
  }

  async deleteTemplate(unit = null, newname) {
    await this.waitForElements(this.driver, unit);
    await this.findAndClickTemplate(this.driver, newname, 1);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const templatePopUp = await this.driver.findElement(locatorsCommon.baseBackdrop);
    const delBtn = await templatePopUp.findElement(locatorsCommon.baseDelStatusProjectBtnId);
    await this.driver.wait(until.elementIsEnabled(delBtn));
    await delBtn.click();
    await this.notificationCheck();
  }

  async checkDeleteTemplate(unit = null, newname) {
    await this.waitForElements(this.driver, unit);
    await this.checkDeleteItem(
      '.duplicate-floor-variants__item.rooms-variants__item',
      newname
    );
  }

  async createTemplateRoomViaLinkEditTemplateInAddRoomForm(roomName) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.clickElement('.switchBtnEditTemplate');
    await this.driver.sleep(1000);

    const templatePopUp = await this.driver.findElement(locatorRoom.roomAppRoomBackdrop);
    const templateInput = await this.driver.findElement(locatorRoom.roomNameInput);
    await this.driver.wait(until.elementIsEnabled(templateInput));
    await this.waitListDate('.form-input-modal',2)
    const areasInput = await this.driver.findElements(
      By.css('.form-input-modal')
    );
    const lenghtArea = areasInput.length
        await areasInput[lenghtArea-1].clear();
        await this.driver.sleep(1000);
        await areasInput[lenghtArea-1].sendKeys(roomName);
        await this.driver.sleep(1000);
        
        await this.driver.sleep(1000);
        await this.clickElement('app-room-form app-room-form #btnInvite');
        
        await this.notificationCheck();

    await this.clickElement('#btnInvite');

  }

  async sequenceRoomChange(){
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(2000)
    const numberOfItems =await this.driver.wait(until.elementsLocated(locatorRoom.floorItemDrag),10000);
            if(await numberOfItems === null){
                throw new Error('Insufficient quantity of items')
            };
            const floors = await this.driver.findElements(locatorRoom.roomDropList);
            await this.findeTwoItemForSequence(floors)
    }

    async getRoomWithAreas(roomElement) {
      const roomTitle = await roomElement.findElement(locatorRoom.roomName).getAttribute('title');
      const areas = await roomElement.findElements(locatorsCommon.baseNgStarInserted);
      const areaTitles = await Promise.all(areas.map(area => area.getAttribute('title')));
      return { [roomTitle]: areaTitles };
  }

   async findRoomAndCheckPositionInPT(roomName=false, position='left'){
    this.roomsWithAreasInProjectProgressTab = [];
      await this.driver.wait(until.elementLocated(locatorRoom.roomsListProgressProjectTab),10000);
      let roomsListInProjectProgress = await this.driver.findElements(locatorRoom.roomsListProgressProjectTab);
      for (const room of roomsListInProjectProgress){
        const roomWithAreas = await this.getRoomWithAreas(room);
        this.roomsWithAreasInProjectProgressTab.push(roomWithAreas);
      }
      await this.clickElement('.customize-status-btn');
      await this.findAndClickOnLinInTheList('Room Position','.customize-menu__item');
      roomsListInProjectProgress = await this.driver.findElements(locatorRoom.roomsListProgressProjectTab);
      if(!roomName){
        position==='left' ? await roomsListInProjectProgress[1].findElement(locatorRoom.roomArrowLeft).click() 
        : await roomsListInProjectProgress[1].findElement(locatorRoom.roomArrowRight).click()  
      }
      else{
        for (const room of roomsListInProjectProgress){
          this.roomNameForChange  = await room.findElement(locatorRoom.roomName).getAttribute('title');
          if(roomName.trim() === this.roomNameForChange){
            position ==='left' ? await room.findElement(locatorRoom.roomArrowLeft).click() 
            : await room.findElement(locatorRoom.roomArrowRight).click();
            break;  
          }
        }
      }
      console.log(this.roomsWithAreasInProjectProgressTab);
      await this.clickElement('#btnAddUsers');
      await this.notificationCheck();
   } 

   async checkRoomPositionInPT(roomName = false, position = 'left') {
    const roomsListInProjectProgress = await this.driver.findElements(locatorRoom.roomsListProgressProjectTab);
    let roomTitle, areas, index;

    if (!roomName) {
        index = position === 'left' ? 0 : 2;
        roomTitle = await roomsListInProjectProgress[index].findElement(locatorRoom.roomName).getAttribute('title');
        areas = await roomsListInProjectProgress[index].findElements(locatorsCommon.baseNgStarInserted);
    } else {
        index = this.roomsWithAreasInProjectProgressTab.findIndex(i => i.hasOwnProperty(roomName));
        if (index === -1) throw new Error(`Room ${roomName} not found in project progress tab.`);
        
        roomTitle = await roomsListInProjectProgress[position === 'left' ? index - 1 : index + 1].findElement(locatorRoom.roomName).getAttribute('title');
        areas = await roomsListInProjectProgress[position === 'left' ? index - 1 : index + 1].findElements(locatorsCommon.baseNgStarInserted);
    }

    const roomWithAreas = { [roomTitle]: await Promise.all(areas.map(area => area.getAttribute('title'))) };
    const originalRoomWithAreas = JSON.stringify(this.roomsWithAreasInProjectProgressTab[roomName ? index : 1]);
    const roomWithAreasAfterChange = JSON.stringify(roomWithAreas);

    if (roomWithAreasAfterChange === originalRoomWithAreas) {
        console.log('Test passed successfully');
    } else {
        console.error(`Test failed. Expected: ${originalRoomWithAreas}, Got: ${roomWithAreasAfterChange}`);
        throw new Error('Test failed');
    }
  }    

}

module.exports = CreateRoom;
