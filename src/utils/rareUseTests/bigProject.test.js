const { createWebdriverChrom } = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateProject = require('../../classes/project/createProject');
const CreateRoom = require('../../classes/view/room/createRoom');
const CreateUnit = require('../../classes/view/unit/createUnit');
const makeScreenshot = require('../makeScreenShot');
const RoomTemplate = require('../../classes/view/room/roomTemplate');
const DuplicateUnit = require('../../classes/view/unit/duplicateUnit');
const DuplicateFloor = require('../../classes/view/floor/duplicateFloor');
const CreateTask = require('../../classes/task/createTask');
const { describe } = require('mocha');
const config = require('../config');
const { customAlphabet, nanoid  } = require('nanoid');

describe('Create, edit and remove project in the chrom browser, test-cases #5,19,12', async () => {
  // here add parameters for creation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Створюємо функцію для генерації ID довжиною 2 символи з використанням лише букв
  const nanoidLettersOnly = customAlphabet(alphabet, 2);
  let driverChrome = null;

  const newProjectName = '1' + nanoidLettersOnly(2);
  const newProjectkey = 'A'+ nanoidLettersOnly(2);
  const newProjectNumber = nanoid(2);
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newCompanyProjectBelong = 'Performance TST';
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';
  const newEditName = 'testProjectEdit';

  const newTaskDueData = '15.12.2024';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  // it('create new big project', async () => {
  //   // time and site or lochalhost there tests are going
  //   // console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   // const logginPageTest = new LoginPage(driverChrome, 'http://localhost:4200/login');
  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const createProjectTest = new CreateProject(driverChrome);
  //   const createRoom = new CreateRoom(driverChrome);
  //   const createUnit = new CreateUnit(driverChrome);
  //   const roomTemplate = new RoomTemplate(driverChrome);
    

  //   await logginPageTest.openLoginForm();
  //   await logginPageTest.fillEmailInput(config.email);
  //   await logginPageTest.fillPasswordInput(config.password);
  //   await logginPageTest.checkSaveForFuture();
  //   await logginPageTest.login(config.urlhomePageForCheck);
  //   // await logginPageTest.login('http://localhost:4200/system/dashboard');

  //   try {
  //     await createProjectTest.goToCreateProjectForm();
  //     await createProjectTest.fillCreateProjectFields(
  //       newProjectName,
  //       newProjectkey,
  //       newProjectNumber,
  //       newCompanyProjectBelong,
  //       newProjectStreet,
  //       newProjectApp,
  //       newProjectState,
  //       newCompanProjectCity,
  //       newProjectZip,
  //       newProjectClientName,
  //       startDate,
  //       eneDate
  //     );
  //     await createUnit.goToView(newProjectName);
  //     await createUnit.createUnit(newProjectName);
  //     await createUnit.checkCreateUnit(newProjectName);
  //     await createRoom.createTemplateRoomWithAreas('_','room',true , 10);
  //     await roomTemplate.checkTemplateInList('_', 'room');
      
  //     // await createProjectTest.chekCreationOfNewProject(newProjectName);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'project_create');
  //     throw error;
  //   }
  // });

  it('create room templates', async () => {
    // time and site or lochalhost there tests are going
    // console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    // const logginPageTest = new LoginPage(driverChrome, 'http://localhost:4200/login');
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const createUnit = new CreateUnit(driverChrome);
    const roomTemplate = new RoomTemplate(driverChrome);
    const duplicateUnit = new DuplicateUnit(driverChrome);
    const duplicateFloorInProject = new DuplicateFloor(driverChrome);
    const createTask = new CreateTask(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    
    // await logginPageTest.login('http://localhost:4200/system/dashboard');
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createTask.goToCreateTasksForm('Performance');
      for(let i = 0; i < 20; i += 1){
        const taskName = "t" + i;
        const taskDescription = 'description'+ i
        await createTask.fillCreateTask(
          taskName,
          taskDescription,
          newTaskDueData,
          'perfom PM'
        );
        await createTask.notificationCheck('id','mainErrorText')
      }
      // await createUnit.goToView('1GV(25 Water street)', 'ca');
      // for(let i = 0; i < 1; i += 1){
      //   const tempRoomName = 'tr'+ i
      //   await roomTemplate.createRoomViaTemplate('_', 'room', tempRoomName );
      //   await driverChrome.sleep(500);
      // }
      // for(let i = 0; i < 1; i +=1){
      //   const uniqueRoomName = 'ur'+ i
      //   await createRoom.createUniqueRoomViaTemplate('_', 'room',uniqueRoomName);
      //   await driverChrome.sleep(500);
      // }
      // console.log("duplicate units");
      // for(let i = 0; i < 50; i +=1){
      //   await duplicateUnit.duplicateUnit();
      // }
      // console.log("duplicate floors");
      for(let i = 24; i < 80; i += 1){
      await duplicateFloorInProject.duplicateFloor();
      }

      // await createProjectTest.chekCreationOfNewProject(newProjectName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  
});
