const { createWebdriverChrome } = require('../webdriver');
const lambdaParameters = require('../lambdaAddParameters');
const LoginPage = require('../../classes/auth/login');
const CreateArea = require('../../classes/view/area/createArea');
const CreateRoom = require('../../classes/view/room/createRoom');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const config = require('../config');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;
 

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new Room(unique) with area', async () => {
    await lambdaParameters('create new Room(unique)', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createRoom.goToView(config.projectStatus);
      await createRoom.createUniqueRoomViaTemplate('_',config.templateBedroom1, config.editRoom);
      await createRoom.checkCreateNewRoom(config.editRoom);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'room_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Add Attachment to the task more than 4 files @T1d72849f', async () => {
    await lambdaParameters('Add Attachment to the task more than 4 files @T1d72849f', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);
    const deleteRoom = new CreateRoom(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    

    try {
      await addFile.goToView(config.projectStatus);
      await addFile.goToSelectTab(config.view);
      await addFile.findAreaInView();
        for (let i=0; i<5; i+=1){
            let fileForAttach
            if(i%2===0){
              fileForAttach = config.attachmentFileDoc;
            }
            else{
                fileForAttach = config.attachmentFilePhoto;
            }
          if(i>4){
            await addFile.addFile(fileForAttach, false);
          }
          else{
            await addFile.addFile(fileForAttach);
          }
        }
        const errorUpload = await addFile.formErrorMsgArray(config.locatorUploadFileAreaErrorCss);
        
        if(errorUpload.includes(config.filesAttachments)){
            console.log('test passed');  
        }
        else{throw new Error('Test failed')};
        await addFile.closeAreaModalWindow();
        await deleteRoom.deleteRoom(config.editRoom);
        await deleteRoom.notificationCheck();
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'area_attachment_4_file');
        throw error;
    }
  });

});
