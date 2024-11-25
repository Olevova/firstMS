const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const locatorsCommon = require('../../../utils/locators/locatorsCommon');
const locatorRoom = require('../../../utils/locators/locatorRoom'); 
const fs = require('fs');
const path = require('path');
const {
    isRunningInDocker,
    isRunningInTeamCity,
    inDocker,
    withoutLambda
  
  } = require('../../../utils/webdriver');
const config = require('../../../utils/config');
const { elementLocated } = require('selenium-webdriver/lib/until');


class CreateArea extends Base {

  async attachFileToArea(file, locator='#fileInput'){
    const inputFile = await this.driver.findElement(By.css(locator));
    if (!withoutLambda && !isRunningInDocker && !isRunningInTeamCity)  {
      console.log(__dirname, '__dirname');
      const filePath = path.join(__dirname, '..','..','..', 'utils', 'files', file);
      console.log(filePath);
      await inputFile.sendKeys(filePath);
    } else if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
      const pathLambda = config.lambdaPathWindows + `${file}`
      console.log('lambda', pathLambda);
      await inputFile.sendKeys(pathLambda);
    } else {
      const pathSel = config.lambdaPathDockerChrom + `${file}`
      console.log('running in Selenium hub', pathSel);
      await inputFile.sendKeys(pathSel);
    }
  }


dateCreater(dataString, time){
  const dateArray  = dataString.split(/[\s,:]+/);
  const monthNames = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const month = monthNames[dateArray[0]];
  const day = parseInt(dateArray[1]);
  const year = parseInt(dateArray[2]);
  let hour = parseInt(dateArray[3]);
  const minute = parseInt(dateArray[4]);
  
  if (hour === 12 && dateArray[5] === 'AM') {
      hour = 0;
  } else if (hour !== 12 && dateArray[5] === 'PM') {
      hour += 12;
  }
  
  const date = new Date(year, month, day, hour, minute);
  if((time-date)/(1000 * 60) <= 2){
      console.log((time-date)/(1000 * 60));
      return true
  }
  console.log((time-date)/(1000 * 60));
  false
}

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.selectStatusName = '';
    this.statusNowInViev = '';
    this.progress = '0 %';
    this.changingTime=null
  }

  async addAreaInRoomWithoutCreatingTemplate(area) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const roomModal = await this.driver.findElement(locatorsCommon.baseBackdrop);
    const firstAreaInput = await roomModal.findElement(
      locatorRoom.areaNameInput
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await this.driver.sleep(1000);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(1000);
    const saveAndUpdateBtnv = await roomModal.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async addAreaInRoom(area) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const roomModal = await this.driver.findElement(locatorsCommon.baseBackdrop);
    await this.driver.wait(
      until.elementLocated(locatorRoom.templateUpdateTemolate),
      10000
    );
    const checkUpdateThisRoom = await roomModal.findElement(
      locatorRoom.areaCheckbox
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const firstAreaInput = await roomModal.findElement(
      locatorRoom.areaNameInput
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await this.driver.sleep(500);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(500);
    const templateName = await roomModal.findElement(locatorRoom.templateName);
    await this.driver.wait(until.elementIsEnabled(templateName));
    await templateName.clear();
    await this.driver.sleep(500);
    await templateName.sendKeys(area);
    await this.driver.sleep(500);
    const saveAndUpdateBtnv = await roomModal.findElement(locatorsCommon.baseBtnInvite);
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async checkCreateArea(room, area) {
    await this.notificationCheck();
    const rooms = await this.driver.findElements(locatorRoom.roomsListItem);
    for (let item of rooms) {
      if (item) {
        console.log(
          await item.findElement(locatorRoom.roomName).getText(),
          room
        );
        if (
          (await item.findElement(locatorRoom.roomName).getText()) === room
        ) {
          const areaList = await item.findElement(
            locatorRoom.roomAreasListItem
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
    throw new Error('Not such room');
  }

  async returnAreaColor(unit, room, area) {
    await this.waitListDate('app-unit-block', 1);
    const attrCheck = unit.toLowerCase();
    await this.driver.wait(
      until.elementLocated(
        By.css(`app-unit-block .unit-name-wrapper[title=${attrCheck}]`)
      ),
      10000
    );
    const units = await this.driver.findElements(locatorsCommon.baseAppUnits);
    for (let unitEl of units) {
      const checkUnit = await unitEl.findElement(locatorRoom.unitNameWrapper);
      console.log((await checkUnit.getAttribute('title')).toLowerCase(), unit.toLowerCase() );
      
      if ((await checkUnit.getAttribute('title')).toLowerCase() === unit.toLowerCase()) {
        const roomBlock = await unitEl.findElements(locatorRoom.roomBlock);
        for (let roomEl of roomBlock) {
          const roomName = await roomEl.findElement(
            locatorRoom.roomArrowNameWrapper
          );
          if ((await roomName.getAttribute('title')) === room) {
            const areasBlock = await roomEl.findElements(
              locatorRoom.roomAreasListItem
            );
            for (let areaEl of areasBlock) {
              const areaName = await areaEl.findElement(
                locatorRoom.areaBoxWithName
              );
              if ((await areaName.getText()) === area) {
                const colorEl = await areaName.findElement(
                  locatorRoom.areaBoxStatus
                );
                const color = await colorEl.getAttribute('style');
                return color;
              }
            }
          }
        }
      }
    }
  }

  async deleteArea(area) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const roomModal = await this.driver.findElement(locatorsCommon.baseBackdrop);
    await this.driver.wait(
      until.elementLocated(locatorRoom.templateDetachBtn),
      10000
    );
    const detachBtn = await roomModal.findElement(locatorRoom.templateDetachBtn);
    await this.driver.wait(until.elementIsEnabled(detachBtn, 10000));
    await this.driver.sleep(1000);
    await detachBtn.click();
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaFormRow),
      10000
    );
    const areaInput = this.driver.findElement(
      locatorRoom.areaFormRow
    );
    const areaName = await areaInput.findElement(
      locatorRoom.areaNameInput
    );
    console.log(await areaName.getAttribute('value'), 'area');
    if ((await areaName.getAttribute('value')) === area) {
      const delBtn = await areaInput.findElement(locatorRoom.areaDeleteAreaBtn);
      await this.driver.wait(until.elementIsEnabled(delBtn), 10000);
      await delBtn.click();
      const saveAndUpdateBtnv = await roomModal.findElement(locatorsCommon.baseBtnInvite);
      await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
      await saveAndUpdateBtnv.click();
    } else {
      throw new Error('Not such area');
    }
  }

  
  async checkNumberCommentsAndAttachmens(){
    await this.driver.wait(until.elementLocated(By.css('app-area-form .backdrop app-activity-area')),10000);
    await this.driver.sleep(1000);
    const commentsEl = await this.driver.findElements(locatorRoom.areaCommentsList);
    
    let commentsCounter = 0;
    let attachmentCounter = 0;
    for(let comment of commentsEl){
      let commentTextElements = await comment.findElements(locatorRoom.areaCommentText);
      let attachmentElements = await comment.findElements(locatorRoom.areaFileItem);
      if(commentTextElements.length > 0){
          commentsCounter += 1;
      } 
      if(attachmentElements.length > 0){
        attachmentCounter += 1
      }
    }
      return {
        comments: commentsCounter,
        attachment: attachmentCounter
      }

  }

  async addComment(comment) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(500);
    await this.driver.wait(
      until.elementsLocated(locatorRoom.areaListItem),
      10000
    );
    const areas = await this.driver.findElements(
      locatorRoom.areaListItem
    );
    await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);

    await areas[0].click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaEditor),
      10000
    );
    const commentArea = await this.driver.findElement(
      locatorRoom.areaEditor
    );
    await commentArea.click();
    this.driver.wait(until.elementLocated(locatorRoom.areaSaveCommentBtn), 10000);
    const saveBtn = await this.driver.findElement(locatorRoom.areaSaveCommentBtn);
    await commentArea.sendKeys(comment);
    await this.driver.wait(until.elementIsVisible(saveBtn), 10000);
    await saveBtn.click();
    let counter=null;
    let saveBtnEnable = true;
    while(counter < 2000){
      saveBtnEnable = await this.driver.findElement(locatorRoom.areaSaveCommentBtn).isDisplayed();
      if (!saveBtnEnable){
        saveBtnEnable = false
        break
      }
      await this.driver.sleep(50);
      counter += 100
    }
    if(saveBtnEnable){
      console.log('Save button did not disappear within 2 seconds');
      return false;
    }
    await this.notificationCheck();
    await this.driver.sleep(500);
    return true
  }

  async editComment(oldcomment, newcomment) {
    const allComments = await this.driver.findElements(
      locatorRoom.areaCommentInnerItem
    );
    const commentText = await allComments[0].findElement(locatorsCommon.baseParagraf);
    const textOfComment = await commentText.getText();
    if (oldcomment !== textOfComment) {
      throw new Error("Can't find your for edit");
    }
    console.log(await textOfComment);
    const editBtn = await allComments[0].findElement(
     locatorRoom.areaMenuListEditCommentOpen
    );
    await editBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaEditMenuList, 10000)
    );
    const commentMenu = await this.driver.findElement(
      locatorRoom.areaEditMenuList
    );
    await this.driver.wait(until.elementIsEnabled(commentMenu), 10000);
    await commentMenu.findElement(locatorRoom.unitBtnEdit).click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaCommentInputDate),
      10000
    );
    await this.driver.sleep(1000);
    const commentInput = await this.driver.findElements(
      By.css('.ql-editor[contenteditable="true"]')
    );
    await commentInput[1].clear();
    await commentInput[1].sendKeys(newcomment);
    const activeEditForm = await this.driver.findElement(
      By.css('.editorWrapper[open="true"]')
    );
    const saveBtn = await activeEditForm.findElement(
      locatorRoom.areaSaveCommentBtn
    );
    await saveBtn.click();
    await this.notificationCheck();
  }
  async deleteComment(commentsdel) {
    const allComments = await this.driver.findElements(
      locatorRoom.areaCommentInnerItem
    );
    const commentText = await allComments[0].findElement(locatorsCommon.baseParagraf);
    const textOfComment = await commentText.getText();
    if (commentsdel !== textOfComment) {
      throw new Error("Can't find item for delete");
    }
    const editBtn = await allComments[0].findElement(
     locatorRoom.areaMenuListEditCommentOpen
    );
    await editBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaEditMenuList, 10000)
    );
    const commentMenu = await this.driver.findElement(
      locatorRoom.areaEditMenuList
    );
    await this.driver.wait(until.elementIsEnabled(commentMenu), 10000);
    await commentMenu.findElement(locatorRoom.unitDeleteBtn).click();
    await this.notificationCheck();
  }

  async deleteFile(file) {
    await this.waitListDate('.files-container .ng-star-inserted', 1);
    const listOfFiles = await this.driver.findElements(locatorRoom.areaListOfFilesItem);
    console.log(await listOfFiles.length);
    
    for (let fileEl of listOfFiles){
      const fileName = await fileEl.findElement(locatorRoom.areaFileNameTime).getText();
      if(await fileName.toLowerCase().trim() === file.toLowerCase().trim()){
        await fileEl.findElement(locatorRoom.areaMenuListEditCommentOpen).click();
        await this.driver.wait(until.elementLocated(locatorRoom.areaEditMenuList),10000);
        const menu = await this.driver.findElement(locatorRoom.areaEditMenuList);
        const delBtn = await menu.findElement(locatorRoom.unitDeleteBtn)
        await delBtn.click();
        await this.notificationCheck();
        return
      }
    }
    throw new Error('File not find')
  }

  async checkFileAreaTabEmpty(){
    const fileContainer = await this.driver.findElement(locatorRoom.areaFileContainerEmpty);
    await this.driver.wait(until.elementTextContains(fileContainer, 'No files have been added yet'),10000)
  }

  async openAreasWithComment() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(locatorRoom.areaListItem),
      10000
    );
    const areas = await this.driver.findElements(
      locatorRoom.areaListItem
    );
    await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);

    await areas[0].click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaEditor),
      10000
    );
    await this.driver.wait(until.elementsLocated(locatorRoom.areaCommentInnerItem),10000)
  }

  async addFileToComment(comment, file='JavaScript.png'){
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000)
    console.log(__dirname, 'dirName');
    const files = fs.readdirSync(__dirname);
    await this.driver.wait(until.elementsLocated(locatorRoom.areaListItem), 10000);
    const areas = await this.driver.findElements(locatorRoom.areaListItem);
    await this.driver.wait(until.elementIsEnabled(areas[0]),10000)
    await areas[0].click();
    await this.driver.wait(until.elementLocated(locatorRoom.areaEditor),10000);
    const commentArea = await this.driver.findElement(locatorRoom.areaEditor);
    await commentArea.click();
    this.driver.wait(until.elementLocated(locatorRoom.areaSaveCommentBtn),10000);
    const saveBtn = await this.driver.findElement(locatorRoom.areaSaveCommentBtn);
    await commentArea.sendKeys(comment);
    await this.attachFileToArea(file);
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsVisible(saveBtn),10000);
    await saveBtn.click();
    await this.notificationCheck();
    }

    async addFile( file='JavaScript.png',notification=true, locator='#fileInputMobile'){
      await this.attachFileToArea(file,locator);
      if(notification) {
        await this.notificationCheck();
      }
      }

  async checkAttachment(filename){
      console.log(filename, 'filename');
      await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
      await this.driver.executeScript('return document.readyState');
      await this.findAndClickOnLinInTheList('Files','.area-details-tabs-list__link');
      const imgArray =  await this.driver.wait(until.elementsLocated(locatorRoom.areaFileNameTime),5000).catch(()=>null);
      
      if(imgArray === null){
          console.log('Has not attachments');
          return
      }
    const attacheFiles = await this.driver.findElements(locatorRoom.areaFileNameTime);

      let filesTitle = [];
    for (let file of attacheFiles) {
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
  

  async checkAttachmentInComments(filename){
      let fileAdded = false
      const commentsElNotFound = await this.driver.wait(until.elementsLocated(locatorRoom.areaCommentsList),3000).catch(() => null);
      if(commentsElNotFound === null){
          return fileAdded
      }
      const commentsEl = await this.driver.findElements(locatorRoom.areaCommentsList);
      
      for(let el of commentsEl){
          const fileName = await el.findElement(locatorRoom.areaFileNameTime);
          if(await fileName.getText() === filename ){
              console.log("File added successful");
              fileAdded=true
              return fileAdded
          }
      }
      return fileAdded
  }

  async hoverAreaAndCheckCommentsAndAttachments(comments = 0, attach = 0) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
        locatorRoom.areaProgresListStatusToDo
      ),
      10000
    );
    const areaElements = await this.driver.findElements(
     locatorRoom.areaProgressList
    );
    const firstArea = await areaElements[0];
    await this.driver.actions().move({ origin: firstArea }).perform();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaModalMini),
      10000
    );
    const informAreaWindow = await firstArea.findElement(
      locatorRoom.areaModalMini
    );
    const commentsEl = await informAreaWindow.findElement(
      locatorRoom.areaCommentsWrapper
    );
    const commentsNumber = await commentsEl.getText();
    const attachEl = await informAreaWindow.findElement(
      locatorRoom.areaFileWrapper
    );
    const attacheNumber = await attachEl.getText();
    // console.log(commentsNumber, 'comments',comments , attacheNumber, 'attach', attach);
    if (comments === +commentsNumber && +attacheNumber === attach) {
      console.log(
        `Test passed, area has ${commentsNumber} comment(s) and ${attacheNumber} attachment(s)`
      );
      return;
    }
    throw new Error('Test failed, check screenshot');
    // await this.driver.sleep(10000);
  }
  async hoverAreaAndCheckCommentsAndAttachmentsNew() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
       locatorRoom.areaProgressList
      ),
      10000
    );
    await this.driver.wait(until.elementLocated(locatorRoom.areaHasComments),10000);
    const areaElementWithAttachmentAndComment = await this.driver.findElement(
      locatorRoom.areaHasComments
    );
    const attachmenTrue = await this.driver.findElement(locatorRoom.areaHasAttachment).catch(()=>null);
    await this.driver.wait(until.elementIsEnabled(areaElementWithAttachmentAndComment),10000);
    await this.driver.executeScript("arguments[0].click();", areaElementWithAttachmentAndComment);
    const commentObj = await this.checkNumberCommentsAndAttachmens();
    console.log(commentObj)
    if(commentObj.attachment>0 && attachmenTrue){
      if(commentObj.comments > 0){
        console.log(
          `Test passed, area has ${commentObj.comments} comment(s) and ${commentObj.attachment} attachment(s)`
        );
        return;
      }
    } else if (commentObj.comments > 0) {
      console.log(
        `Test passed, area has ${commentObj.comments} comment(s)`
      );
      return;
    }
    throw new Error('Test failed, check screenshot');
  }

  async findeAreaInTheTable(status = false) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
        locatorRoom.areaProgresListStatusToDo
      ),
      10000
    );
    let areaElements;
    if(status){
      areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item[status="${status}"]`))
    }
    else{
      areaElements = await this.driver.findElements(
        locatorRoom.areaProgresListStatusToDo
      );
    }
    
    if (areaElements.length === 0) {
      throw new Error('It has no area with status To Do');
    }
    for (let i of areaElements) {
      const stEl = await i.getAttribute('status');
    }
    const firstArea = areaElements[0];

    console.log(
      await firstArea.getAttribute('status'),
      await firstArea.getAttribute('area-name')
    );
    this.selectStatusName = await firstArea.getAttribute('area-name');
    await firstArea.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaStatusBtn),
      10000
    );
    await this.driver.sleep(2000);
  }

  async closeAreaPopUpAndCheckStatusInPogress(status = '-3') {
    const areaStatus = await this.driver.findElement(
      locatorRoom.areaStatusBtn
    );
    const statusOfArea = await areaStatus.getText();
    this.statusNow = await statusOfArea.trim();
    const popUp = await this.driver.findElement(locatorsCommon.baseBackdrop);
    const closeBtn = await popUp.findElement(locatorsCommon.baseBtnCloseModal);
    await this.driver.wait(until.elementIsEnabled(closeBtn), 10000);
    await closeBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
        By.css(`.area-progress-list-areas__item[status="${status}"]`)
      ),
      10000
    );
    const areaElements = await this.driver.findElements(
      By.css(`.area-progress-list-areas__item[status="${status}"]`)
    );
    const firstArea = await areaElements[0];
    if ((await firstArea.getAttribute('status-name')) !== this.statusNow) {
      throw new Error('Close area Pop-up not work, check screenshot');
    }
  }

  async checkStartProgressProjectPercent(){
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      locatorRoom.roomProjectProgress
    );
    this.progress= parseInt(await projectProgres.getText(), 10);
    console.log(`Start project percent status: ${this.progress} %`);
    return this.progress
   };

  async findAreaInView(status = '-3') {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(locatorRoom.areaListItem),
      10000
    );

    const areas = await this.driver.findElements(
      By.css(`[areastatus='${status}']`)
    );
    const firstArea = await areas[0];
    if (!(await firstArea)) {
      throw new Error('It has not area with status To Do');
    }
    console.log(
      await firstArea.getAttribute('areastatus'),
      await firstArea.getText()
    );
    await firstArea.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaStatusBtn),
      10000
    );
  }

  async changeStatusToDoOnInProgress() {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(locatorRoom.areaStatusMenuItem);
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      locatorRoom.floorStatusProgress
    );
    if ((await statusProgressProcent.getText()) !== '0%') {
      throw new Error('Progress Status Procent must be 0%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeColorProgressStatusByClick() {
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaDetailsProgress),
      10000
    );
    const statusProgressElements = await this.driver.findElements(
      locatorRoom.areaStatusProgress
    );
    const fifthProcentEl = await statusProgressElements[4];
    await this.driver.wait(until.elementIsEnabled(fifthProcentEl), 10000);
    await fifthProcentEl.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaBtnConfirm),
      10000
    );
    const confirmBtn = this.driver.findElement(locatorRoom.areaBtnConfirm);
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      locatorRoom.floorStatusProgress
    );
    if ((await statusProgressProcent.getText()) !== '50%') {
      throw new Error('Progress Status Procent must be 50%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeColorProgressStatusByBtn() {
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaDetailsProgress),
      10000
    );
    const statusProgressBtns = await this.driver.findElements(
      By.css('.change-status-progress-btn')
    );
    const minusBtn = await statusProgressBtns[0];
    await this.driver.wait(until.elementIsEnabled(minusBtn), 10000);
    await minusBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorRoom.areaBtnConfirm),
      10000
    );
    const confirmBtn = this.driver.findElement(locatorRoom.areaBtnConfirm);
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      locatorRoom.floorStatusProgress
    );
    if ((await statusProgressProcent.getText()) !== '90%') {
      throw new Error('Progress Status Procent must be 90%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeStatusInProgressOnDone() {
    const selectStatus = await this.driver.findElement(
      locatorRoom.areaStatusBtn
    );
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(locatorRoom.areaStatusMenuItem);
    await this.findDateInDropDown(await statusElements, 'Done');
    await this.notificationCheck();
    await this.checkAreaStatus('DONE');
  }

  async changeStatusDoneOnInProgress() {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(locatorRoom.areaStatusMenuItem);
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      locatorRoom.floorStatusProgress
    );
    if ((await statusProgressProcent.getText()) !== '100%') {
      throw new Error('Progress Status Procent must be 100%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeStatusInProgressOnToDo() {
      const selectStatus = await this.driver.findElement(
      locatorRoom.areaStatusBtn
    );
    await this.clickAreaStatusDropdown();

    const statusElements = this.driver.findElements(locatorRoom.areaStatusMenuItem);
    await this.driver.sleep(1000);
    await this.findDateInDropDown(await statusElements, 'To Do');
    await this.notificationCheck();
    await this.checkAreaStatus('TO_DO');
  }

  async closeAreaPopUpAndCheckStatusInView() {
   
    const areaName = await this.driver.findElement(
      locatorRoom.areaDetailsName
    );
    const titleOfArea = await areaName.getText()
    this.statusNowInViev = await titleOfArea.trim();
    await this.closeAreaModalWindow();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(locatorRoom.areaListItem),
      10000
    );
    const areas = await this.driver.findElements(By.css("[areastatus='-3'] + span"));
    const firstArea = await areas[0];
    const firstAreaText = await firstArea.getText()
    if (await firstAreaText.trim() !== this.statusNowInViev) {
      throw new Error('Close area Pop-up not work, check screenshot');
    }
   
  }
 
  async closeAreaAndCheckProgress(properties = 'increase') {
    await this.closeAreaModalWindow();
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      locatorRoom.roomProjectProgress
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber > nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async comparisonOfProgress(properties = 'increase') {
    const projectProgres = await this.driver.findElement(
      locatorRoom.roomProjectProgress
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber >= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async changeStatusOnCustomStatus(customyStatus) {
    await this.clickAreaStatusDropdown();
    const statusElements = this.driver.findElements(locatorRoom.areaStatusMenuItem);
    await this.findDateInDropDown(await statusElements, customyStatus);
    await this.notificationCheck();
    await this.checkAreaStatus(customyStatus);
  }

  async checkHistory(status){
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    this.changingTime =new Date();
    await this.findAndClickOnLinInTheList('History','.area-details-tabs-list__link');
    await this.waitListDate('.top-line', 1);
    const historyInform = await this.driver.findElements(locatorRoom.areaTopLine);
    const time = await historyInform[0].findElement(locatorRoom.areaTimestamp).getText();
    const areaStatus = await this.driver.findElement(locatorRoom.areaChanges).getText();
    console.log(time,'time', this.changingTime);
    if(!this.dateCreater(time, this.changingTime) || status.toLowerCase() !== await areaStatus.toLowerCase() ){
            throw new Error ('History not work')
    }
    console.log("History works");
    await this.driver.sleep(1000)
}

async checkDeleteArea(roomName, area){
  await this.notificationCheck();
  await this.driver.wait(until.elementsLocated(locatorRoom.roomsListItem), 10000);
  const rooms = await this.driver.findElements(locatorRoom.roomsListItem);

  for (let item of rooms) {
    if (item) {
      if (
        (await item.findElement(locatorRoom.roomName).getText()) === roomName
      ) {
        const areaList = await item.findElement(
          locatorRoom.roomAreasListItem
        );
        await this.driver.wait(until.elementIsVisible(areaList), 10000);
        if ((await areaList.getText()) === area) {
          throw new Error('Area is not delete');
         
        } else {
          console.log(`Area ${area} is delete`);
          return;
        }
      }
    }
  }

}

async addUser(username) {
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
  await this.driver.executeScript('return document.readyState');
  await this.driver.sleep(1000);
  await this.driver.wait(
    until.elementsLocated(locatorRoom.areaListItem),
    10000
  );
  const areas = await this.driver.findElements(
    locatorRoom.areaListItem
  );
  await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);
  await areas[0].click();
  await this.driver.wait(
    until.elementLocated(locatorRoom.areaEditor),
    10000
  );
  const commentArea = await this.driver.findElement(
    locatorRoom.areaEditor
  );
  await commentArea.click();
  this.driver.wait(until.elementLocated(locatorRoom.areaSaveCommentBtn), 10000);
  const saveBtn = await this.driver.findElement(locatorRoom.areaSaveCommentBtn);
  const userMeetBtn = await this.driver.findElement(locatorRoom.areaQlFormats);
  await userMeetBtn.click();
  await this.driver.wait(
    until.elementLocated(locatorRoom.areaMentionList),
    10000
  );
  const userList = await this.driver.findElement(locatorRoom.areaMentionList);
  await this.driver.wait(until.elementIsVisible(userList), 1000);
  const user = await userList.findElement(locatorRoom.areaUserMention);
  const users = await userList.findElements(locatorsCommon.baseParagraf);
  if(username){
   await this.findDateInDropDown(users, username)
  }
  else{
    await user.click();
  }
  await this.driver.wait(until.elementIsVisible(saveBtn), 10000);
  await saveBtn.click();
  await this.notificationCheck();
}

async goToUserList() {
  const allComments = await this.driver.findElements(
    locatorRoom.areaCommentInnerItem
  );
  const commentText = await allComments[0].findElement(locatorsCommon.baseParagraf);
  const userName = await commentText
    .findElement(locatorRoom.areaSpanMention)
    .getAttribute('data-value');
  const linkUser = await commentText.findElement(locatorRoom.areaSpanMention);
  console.log(userName);
  let areaNameWithMentionUser = await this.driver.findElement(locatorRoom.areaNameWithMentionUser);
  const areaName = await areaNameWithMentionUser.getText()
  await linkUser.click();
  await this.driver.wait(
    until.elementLocated(locatorsCommon.baseUserListSettingsTitle),
    10000
  );
  const userSettings = await this.driver.findElement(
    locatorsCommon.baseUserListSettingsTitle
  );
  await this.driver.wait(until.elementIsVisible(userSettings), 10000);
  let userSettingsName = '';
  let counter;
  while (userSettingsName.length <= 0 || counter <= 3) {
    userSettingsName = await userSettings.getText();
    setTimeout(() => (counter += 1), 1000);
  }
  console.log(
    await userSettingsName.toLowerCase(),
    await userName.toLowerCase().trim(),
  );
  if (
    (await userName.toLowerCase().trim()) ===
    (await userSettingsName.toLowerCase().trim())
  ) {
    console.log('its user setting page, test run successful');
  } else {
    throw new Error('test fall');
  }
  return areaName
}

async deleteUserFromComment(commentsdel) {
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
  await this.driver.executeScript('return document.readyState');
  await this.driver.sleep(500);
  await this.driver.wait(
    until.elementsLocated(locatorRoom.areaListItem),
    10000
  );
  const areas = await this.driver.findElements(
    locatorRoom.areaListItem
  );
  await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);
  await areas[0].click();
  await this.driver.wait(
    until.elementLocated(locatorRoom.areaMention),
    10000
  );
  const user = await this.driver.findElement(
    locatorRoom.areaMention
  );
  await this.driver.wait(until.elementIsVisible(user), 10000);
  console.log(await user.getAttribute('data-value'), 'user');
  await this.driver.wait(
    until.elementLocated(locatorRoom.areaEditor),
    10000
  );
  const allComments = await this.driver.findElements(
    locatorRoom.areaCommentInnerItem
  );
  const commentText = await allComments[0].findElement(
    By.css('.mention span[contenteditable="false"]')
  );
  const textOfComment = await commentText.getText();
  console.log(textOfComment, 'textOfComment', commentsdel);
  if (commentsdel !== textOfComment) {
    throw new Error("Can't find search element");
  }
  const editBtn = await allComments[0].findElement(
   locatorRoom.areaMenuListEditCommentOpen
  );
  await editBtn.click();
  await this.driver.wait(
    until.elementLocated(locatorRoom.areaEditMenuList, 10000)
  );
  const commentMenu = await this.driver.findElement(
    locatorRoom.areaEditMenuList
  );
  await this.driver.wait(until.elementIsEnabled(commentMenu), 10000);
  await commentMenu.findElement(locatorRoom.unitDeleteBtn).click();
  await this.notificationCheck();
}

async getAllDefaultAreaStatusesInProjectProgressTab(){
  await this.waitListDate('.area-progress-list-areas__item[status]', 1);
  const areas = await this.driver.findElements(locatorRoom.areaProgressListWithStatus);
  console.log(await areas.length);
  const areaStatuses = { };
  for(let area of areas){
    const status = await area.getAttribute('status-name');
    if (areaStatuses.hasOwnProperty(status)){
      areaStatuses[status] +=1
    } else areaStatuses[status] = 1;
  }
  return areaStatuses
}

async getAllStatusesOfFilterStatusScale(){
  await this.waitListDate('.view-area-status__item', 3);
  const filterStatuses = await this.driver.findElements(locatorsCommon.baseStatusScaleCss);

  const statusPercentages = {};
  for (let status of filterStatuses) {
      const text = await status.getText();
      const match = text.match(/^(.+?)\s*\((\d+(\.\d+)?)%\)$/);
      if (match) {

          const statusText = match[1].trim(); 
          const percentage = parseFloat(match[2]);
          statusPercentages[statusText] = percentage;
      }
  }
  return statusPercentages;
}

async verifyStatusPercentageConsistency() {
  const areaStatuses = await this.getAllDefaultAreaStatusesInProjectProgressTab();
  const totalAreas = Object.values(areaStatuses).reduce((sum, count) => sum + count, 0);
  const statusPercentages = await this.getAllStatusesOfFilterStatusScale();

  for (let status in areaStatuses) {
      const count = areaStatuses[status];
      const calculatedPercentage = ((count / totalAreas) * 100).toFixed(1);
      const actualPercentage = statusPercentages[status];

      if (actualPercentage && Math.abs(calculatedPercentage - actualPercentage) <= 0.1 ) {
          console.log(`Status "${status}" is consistent: ${calculatedPercentage}% matches ${actualPercentage}%`);
      } else {
          throw new Error(`Status "${status}" is inconsistent: ${calculatedPercentage}% does not match ${actualPercentage}%`);
      }
  }
}
}
module.exports = CreateArea;
