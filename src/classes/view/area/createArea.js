const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const path = require('path');

class CreateArea extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async addAreaInRoomWithoutCreatingTemplate(area){
    await this.driver.wait(
      until.elementLocated(By.css(".backdrop")),
      10000
    );
    const roomModal = await this.driver.findElement(
      By.css(".backdrop")
    );
    const firstAreaInput = await roomModal.findElement(
      By.css('.form-input-modal[placeholder="Area Name"]')
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await this.driver.sleep(1000);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(1000);
    const saveAndUpdateBtnv = await roomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async addAreaInRoom(area){
    await this.driver.wait(
      until.elementLocated(By.css(".backdrop")),
      10000
    );
    const roomModal = await this.driver.findElement(
      By.css(".backdrop")
    );
    await this.driver.wait(
      until.elementLocated(By.id('updateTemplate')),
      10000
    );
    const checkUpdateThisRoom = await roomModal.findElement(
      By.className('checkbox')
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const firstAreaInput = await roomModal.findElement(
      By.css('.form-input-modal[placeholder="Area Name"]')
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await this.driver.sleep(500);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(500);
    const templateName = await roomModal.findElement(By.id('templateName'));
    await this.driver.wait(until.elementIsEnabled(templateName));
    await templateName.clear();
    await this.driver.sleep(500);
    await templateName.sendKeys(area);
    await this.driver.sleep(500);
    const saveAndUpdateBtnv = await roomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async checkCreateArea(room, area) {
   await this.notificationCheck();
    const rooms = await this.driver.findElements(By.css('.rooms-list__item'));
    for (let item of rooms) {
      if (item) {
        console.log(await item.findElement(By.className('room-name')).getText(), room);
        if (
          
          
          (await item.findElement(By.className('room-name')).getText()) === room
        ) {
          const areaList = await item.findElement(
            By.css('.room-areas-list__item')
          );
          await this.driver.wait(until.elementIsVisible(areaList), 10000);
          if ((await areaList.getText()) === area) {
            console.log(`Area ${area} is created`);
            return;
          } else {
            throw new Error('Area is not created');
          }
        }
      }
    }
    throw new Error("Not such room")
  }

  async returnAreaColor(unit, room, area){
    await this.waitListDate('app-unit-block', 1);
    await this.driver.wait(until.elementLocated(By.css(`app-unit-block .unit-name-wrapper[title=${unit}]`)),10000);
    const units = await this.driver.findElements(By.css("app-unit-block"));
    for (let unitEl of units){
      const checkUnit = await unitEl.findElement(By.css(`.unit-name-wrapper`));
      if(await checkUnit.getAttribute('title') === unit){
        const roomBlock = await unitEl.findElements(By.css('app-room-block'));
        for(let roomEl of roomBlock){
          const roomName = await roomEl.findElement(By.css('.room-arrow-with-name-wrapper'));
          if(await roomName.getAttribute('title')===room){
            const areasBlock = await roomEl.findElements(By.css('.room-areas-list__item'));
            for(let areaEl of areasBlock){
              const areaName = await areaEl.findElement(By.css('.area-box-with-name-wrapper'));
              if(await areaName.getText() === area){
                const colorEl = await areaName.findElement(By.css('.area-box-status'));
                const color = await colorEl.getAttribute('style');
                return color
              }
            }
          }
        }
      }
    }
    // const checkUnit = await this.driver.findElement(By.css(`app-unit-block .unit-name-wrapper[title=${unit}]`));


  }
}
module.exports = CreateArea;
