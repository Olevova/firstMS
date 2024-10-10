const { By, until } = require('selenium-webdriver');
const CreateRoom = require('../room/createRoom');

class RoomTemplate extends CreateRoom {
  async findAndClickTemplate(driver, roomname, element) {
    const templateRoom = await driver.findElements(
      By.css('.duplicate-floor-variants__item.rooms-variants__item')
    );
    let noteTemplate = false;
    for (const template of templateRoom) {
      const templateName = await template.getText();
      if (
        templateName.toLowerCase().trim() === roomname.toString().toLowerCase()
      ) {
        const editBtn = await template.findElements(By.css('.editRoom-icon'));
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
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.addRoomInUnit(unit);

    await this.driver.wait(
      until.elementsLocated(
        By.css('.duplicate-floor-variants__item.rooms-variants__item')
      ),
      10000
    );
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editTemplate(unit = null, roomname, newname) {
    await this.waitForElements(this.driver, unit);
    console.log('roomname', roomname);
    await this.findAndClickTemplate(this.driver, roomname, 0);

    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const templatePopUp = await this.driver.findElement(By.css('.backdrop'));
    // await this.driver.sleep(3000);
    await this.driver.wait(until.elementLocated(By.id('roomName')),10000);
    const templateInput = await this.driver.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(templateInput));
    await templateInput.clear();
    await this.driver.sleep(1000);
    await templateInput.sendKeys(newname);
    // await this.driver.sleep(1000);
    const saveTemplateBtn = await this.driver.findElement(By.id('btnInvite'));
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
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const templatePopUp = await this.driver.findElement(By.css('.backdrop'));
    const delBtn = await templatePopUp.findElement(By.id('btnDeleteProject'));
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
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.clickElement('.switchBtnEditTemplate');
    await this.driver.sleep(1000);

    const templatePopUp = await this.driver.findElement(By.css('app-room-form app-room-form .backdrop'));
    const templateInput = await this.driver.findElement(By.id('roomName'));
    await this.driver.wait(until.elementIsEnabled(templateInput));
    console.log('hereeee');
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
      // }
    // }

    await this.clickElement('#btnInvite');

  }
}

module.exports = RoomTemplate;
