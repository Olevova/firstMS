const config = require('./../config');
const baseUrl = config.baseUrl;
const baseUrlDev = config.baseUrlDev;
const {
  login,
  createCompany,
  createUser,
  createMultipleProjects,
  createProjectWithDetails,
  createSUUser,
  addTasksToProject
} = require('./api');

const {
  email,
  password,
  companyPayload,
  companyPayloadPlan,
  randomCompanyPayload,
  projectPayloadMain,
  projectPayloadDoneStatus,
  projectPayloadUnitEdit,
  projectPayloadCA,
  projectPayloadPM,
  projectPayloadSU,
  floor,
  floor2,
  unit,
  templatePayload,
  templatePayloadSecond,
  roomPayload,
  taskPayload,
  taskPayloadDone,
  superUserPayload,
  userCaName,
  adminUserPayload,
  userCaNameParallel,
  adminUserParallelPayload,
  userPMName,
  PMUserPayload,
  userPMNameParallel,
  PMUserParallelPayload,
  userSUName,
  SUUserPayload,
  userSUNameParallel,
  SUUserParallelPayload,
  userSUNameTask,
  SUUserTaskPayload,
  statusPayload,
  projectPayloadDone
} = require('./testData');

const firstCompany = randomCompanyPayload();

console.log(baseUrl, 'baseUrl');

if(baseUrl !== baseUrlDev){
(async () => {
  try {
    const loginRes = await login(email, password);
    const jsessionId = loginRes.cookies;
    console.log('Session ID:', loginRes.cookies, 'Super User version', loginRes.versionOfSU);
    const su = await createSUUser(email,superUserPayload, loginRes.versionOfSU);
    console.log('SU data:', su);
    if (jsessionId) {
      const firstCompanyId = await createCompany(firstCompany);
      await createCompany(companyPayloadPlan);
      await createMultipleProjects(firstCompanyId, 20);
      let companyId = await createCompany(companyPayload);

      console.log(companyId, 'companyId');
      console.log('start create and fill projects');

      const mainProjectId = await createProjectWithDetails(
         companyId,
         projectPayloadMain,
         floor, 
         unit,
         templatePayload,
         roomPayload, 
         SUUserTaskPayload,
         userSUNameTask,
         taskPayload,
         3, 
         1,
         null,
         null
      );

      const projectDone = await createProjectWithDetails(
        companyId,
        projectPayloadDone,
        floor2,
        unit.slice(0,1),
        templatePayloadSecond,
        null,
        null,
        null,
        null,
        null,
        1,
        null,
        2
      );
      
      const projectDoneStatusId = await createProjectWithDetails(
        companyId,
        projectPayloadDoneStatus,
        floor2,
        unit.slice(0,1),
        templatePayloadSecond,
        null,
        adminUserPayload,
        userCaName,
        taskPayload,
        22,
        1,
        null,
        2
      );

      const projectUnitEditId = await createProjectWithDetails(
        companyId,
        projectPayloadUnitEdit,
        floor2,
        unit,
        null,
        roomPayload,
        null,
        null,
        null,
        0,
        1,
        statusPayload,
        3
      );

      const projectCAId = await createProjectWithDetails(
        companyId,
        projectPayloadCA,
        floor2,
        unit,
        templatePayload,
        null,
        adminUserParallelPayload,
        userCaNameParallel,
        null,
        0,
        1,
        null,
        null
      );

      const projectPMId = await createProjectWithDetails(
        companyId,
        projectPayloadPM,
        floor2,
        unit,
        templatePayload,
        roomPayload,
        PMUserPayload,
        userPMName,
        taskPayload,
        3,
        1,
        null,
        null
      );

      const projectSUId = await createProjectWithDetails(
        companyId,
        projectPayloadSU,
        floor2,
        unit,
        templatePayload,
        null,
        SUUserPayload,
        userSUName,
        taskPayload,
        2,
        1,
        null,
        null
      );
      const pmUserId = await createUser(PMUserParallelPayload.email, PMUserParallelPayload, companyId, userPMNameParallel,
         [mainProjectId, projectDoneStatusId, projectUnitEditId, projectCAId, projectPMId, projectSUId]);
      await createUser(SUUserParallelPayload.email, SUUserParallelPayload, companyId, userSUNameParallel,
        [mainProjectId, mainProjectId, projectDoneStatusId, projectSUId, projectCAId]);
      await addTasksToProject(mainProjectId,taskPayloadDone, 1, pmUserId.id );
      await addTasksToProject(projectPMId,taskPayloadDone, 1, pmUserId.id, 'Filter')
    }
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
  }
})();
}
