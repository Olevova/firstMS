const { By, until, error } = require('selenium-webdriver');
const Base = require('../../base');

class CreateRoom extends Base {
  async addRoomInUnit(unit) {
    if (unit !== null) {
      const units = await this.driver.findElements(
        By.css('.unit-name-with-btn-wrapper')
      );

      let isRoomCreated = false;

      for (let i of units) {
        const unitName = await i.findElement(By.css('.unit-name-wrapper p'));
        if (i) {
          const itemText = await unitName.getText();
          if (itemText === unit) {
            console.log(`find ${unit}`);
            isRoomCreated = true;
            const addRoom = await unitName.findElement(By.id('addRoom'));
            await this.driver.wait(until.elementIsEnabled(addRoom), 10000);
            await addRoom.click();
            break;
          }
        }
      }
      if (!isRoomCreated) {
        await this.driver.wait(until.elementLocated(By.id('addRoom')), 10000);
        const addRoom = await this.driver.findElement(By.id('addRoom'));
        await this.driver.wait(until.elementIsVisible(addRoom), 10000);
        await addRoom.click();
      }
    } else {
      throw new Error("It don't have a Unit to create a room");
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async createTemplateRoomWithAreas(
    unit = null,
    room,
    first = false,
    areasNumber = 1
  ) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    if (!first) {
      await this.driver.wait(
        until.elementLocated(By.css('.add-floor-menu.add-room-menu')),
        10000
      );
      const addRoomMenu = await this.driver.findElement(
        By.css('.add-floor-menu.add-room-menu')
      );
      const createRoomBtn = await addRoomMenu.findElement(
        By.id('createNewRoom')
      );
      await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
      await this.driver.sleep(1000);
      await createRoomBtn.click();
    }
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const addRoomModal = this.driver.findElement(By.css('.backdrop'));
    const inputRoom = await addRoomModal.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await this.driver.sleep(500);
    await inputRoom.sendKeys(room);
    const addAreaBtn = await this.driver.findElement(By.id('addAreaField'));
    await this.driver.wait(until.elementIsEnabled(addAreaBtn), 10000);
    for (let click = 0; click < areasNumber; click += 1) {
      const idForArea = await click.toString();
      console.log(
        idForArea,
        'idForArea',
        `#${idForArea}[forminput="ROOM_AREA_NAME"]`
      );

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
    const saveBtn = addRoomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveBtn));
    await this.driver.sleep(1000);
    await saveBtn.click();
  }

  async createRoom(unit = null, room, first = false) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    if (!first) {
      await this.driver.wait(
        until.elementLocated(By.css('.add-floor-menu.add-room-menu')),
        10000
      );
      const addRoomMenu = await this.driver.findElement(
        By.css('.add-floor-menu.add-room-menu')
      );
      const createRoomBtn = await addRoomMenu.findElement(
        By.id('createNewRoom')
      );
      await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
      await this.driver.sleep(1000);
      await createRoomBtn.click();
    }
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const addRoomModal = this.driver.findElement(By.css('.backdrop'));
    const inputRoom = await addRoomModal.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await inputRoom.sendKeys(room);
    const saveBtn = addRoomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveBtn));
    await this.driver.sleep(1000);
    await saveBtn.click();
  }

  async createUniqueRoomViaTemplate(unit = null, templatename, newroom) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(By.css('.add-floor-menu')),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(By.css('.duplicate-floor-variants__item')),
      10000
    );

    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(By.css('.backdrop'), 10000));
    const roomNameInput = await this.driver.findElement(By.id('roomName'));
    await roomNameInput.click();
    await this.driver.sleep(1000);
    await roomNameInput.clear();
    await roomNameInput.sendKeys(newroom);
    const detuchBtn = await this.driver.findElement(By.css('.detach-btn'));
    await this.driver.wait(until.elementIsEnabled(detuchBtn), 10000);
    await detuchBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.checkbox-container')),
      10000
    );
    const btnCreateRoom = await this.driver.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(btnCreateRoom), 10000);
    await btnCreateRoom.click();
  }

  async createRoomViaTemplate(unit = null, templatename, newroom) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(By.css('.add-floor-menu')),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(By.css('.duplicate-floor-variants__item')),
      10000
    );
    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(By.css('.backdrop'), 10000));
    const roomNameInput = await this.driver.findElement(By.id('roomName'));
    await roomNameInput.click();
    await this.driver.sleep(1000);
    await roomNameInput.clear();
    await roomNameInput.sendKeys(newroom);

    const btnCreateRoom = await this.driver.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(btnCreateRoom), 10000);
    await btnCreateRoom.click();
  }

  async addSubtitleToTheRoom(subtitle) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.id('roomSubtitle')), 10000);
    const subtitleInput = await this.driver.findElement(By.id('roomSubtitle'));
    await this.driver.wait(until.elementIsEnabled(subtitleInput));
    await subtitleInput.clear();
    await subtitleInput.sendKeys(subtitle);
    await this.driver.sleep(500);
    const saveBtn = await this.driver.findElement(By.id('btnInvite'));
    await saveBtn.click();
  }

  async changeRoomTitle(roomtitle, save=false) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.id('roomName')), 10000);
    const roomtitleInput = await this.driver.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(roomtitleInput));
    await roomtitleInput.clear();
    await this.driver.sleep(500);
    await roomtitleInput.sendKeys(roomtitle);
    await this.driver.sleep(500);
    if(save){
      const saveBtn = await this.driver.findElement(By.id('btnInvite'));
      await saveBtn.click();
    }
  }

  async createUniqueRoomByDetachingTemplate() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const detuchBtn = await this.driver.findElement(By.css('.detach-btn'));
    await this.driver.wait(until.elementIsEnabled(detuchBtn), 10000);
    await detuchBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.checkbox-container')),
      10000
    );
    const saveBtn = await this.driver.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
  }

  async getArrayOfAreasInRoomModalForm(
    locator = '.area-form-dragIcon-with-input-wrapper .form-input-modal'
  ) {
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
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
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.css('app-unit-block.cdk-drag.ng-star-inserted'))
    );
    const unitList = await this.driver.findElements(
      By.css('app-unit-block.cdk-drag.ng-star-inserted')
    );
    for (let unit of unitList) {
      const findUnitName = await unit.findElement(By.css('.unit-name-wrapper'));
      // console.log(await findUnitName.getAttribute("title"));
      if ((await findUnitName.getAttribute('title')) === unitName) {
        const RoomList = await unit.findElements(By.css('app-room-block'));
        for (let room of RoomList) {
          const findRoomName = await room.findElement(
            By.css('.room-arrow-with-name-wrapper')
          );
          if ((await findRoomName.getAttribute('title')) === roomName) {
            let areas = [];
            const listOfAreas = await room.findElements(
              By.css('li.room-areas-list__item span:nth-of-type(2)')
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
      until.elementLocated(By.css('.room-arrow-with-name-wrapper'))
    );

    await this.checkCreateItem('.room-arrow-with-name-wrapper', room);
  }

  async checkSuggestedTemplateName(unit = null, room) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(By.css('.add-floor-menu.add-room-menu')),
      10000
    );
    const addRoomMenu = await this.driver.findElement(
      By.css('.add-floor-menu.add-room-menu')
    );
    const createRoomBtn = await addRoomMenu.findElement(By.id('createNewRoom'));
    await this.driver.wait(until.elementIsEnabled(createRoomBtn), 10000);
    await this.driver.sleep(1000);
    await createRoomBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const addRoomModal = this.driver.findElement(By.css('.backdrop'));
    const inputRoom = await addRoomModal.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(inputRoom), 10000);
    await inputRoom.sendKeys(room);
    const checkUpdateThisRoom = await addRoomModal.findElement(
      By.className('checkbox')
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const templateName = await addRoomModal.findElement(By.id('templateName'));
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
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.addRoomInUnit(unit);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(By.css('.add-floor-menu')),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(By.css('.duplicate-floor-variants__item')),
      10000
    );

    await this.findAndClickOnLinInTheList(
      templatename,
      '.duplicate-floor-variants__item'
    );
    await this.driver.wait(until.elementLocated(By.css('.backdrop'), 10000));
    const roomNameInput = await this.driver.findElement(By.id('roomName'));
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
      .wait(until.elementLocated(By.id('roomNameError')), 3000)
      .catch(() => null);
    if (formError) {
      const erorrMessageElement = await this.driver.findElement(
        By.id('roomNameError')
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
}

module.exports = CreateRoom;
