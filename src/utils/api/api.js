const axios = require('axios');
const config = require('./../config');
const { customAlphabet } = require('nanoid')
const numberNanoid = customAlphabet('1234567890', 10);
const {ramdomProjectPayload} = require('./testData');
console.log(config.baseUrlBackend);

const apiClient = axios.create({
  baseURL: config.baseUrlBackend,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
  withCredentials: true,
});

function setAuthHeader(jsessionId) {
  apiClient.defaults.headers.common['Cookie'] = jsessionId;
}

async function login(email, password) {
  const url = `${config.baseUrlBackend}/login`;
  console.log('url', url);
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('remember_me', 'off');

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Accept: 'application/json',
      },
      withCredentials: true,
    });  
    const cookies = response.headers['set-cookie'].join(';').split(';')[0];
    console.log('Cookies:', cookies, response.data, 'res');
    setAuthHeader(cookies);
    const versionOfSU = response.data.version
    return {cookies, versionOfSU} ;
  } catch (error) {
    console.error(
      'Error:',
      error.message
    );
  }
}


async function checkUser(userMail){
  try {
    const response = await apiClient.get('/api/user/list');
    const data = response.data;
    const userExists = data.content.find(
        user => user.email === userMail
      );
    return userExists || false
  } catch (error) {
    console.error(
      'Error:',
      error.message
    );
  }
}

async function firstUserByRole(role){
  try {
    const response = await apiClient.get('/api/user/list');
    const data = response.data;
      const firstUserExist = data.content.find(
        user => user.role === role
      );
      console.log(firstUserExist, 'userExists');
      return firstUserExist || false
  } catch (error) {
    console.error(
      'Error:',
       error.message
    );
  }
}

async function createSUUser(userEmail, createData, version){
  const user = await checkUser(userEmail);
  const userId = user;
  console.log(user, 'user');
  if(!userId){
    try {
      const userData = {...createData, version}
      const userResponse = await apiClient.put('/api/user',userData);
      console.log(userResponse);
      return userResponse.data
    } catch (error) {
      console.error(
        'Error:',
        error
      );
    }
  }
  return userId
}

async function createUser(userEmail, createData, companyId, userName, projectIds=[]){
  const user = await checkUser(userEmail);
  const userId = user.id
  if(!userId){
    const userData = {...createData, companyId, projectIds};
    console.log(userData);
    try {
      await apiClient.post('/api/user/invite', userData);
      const newUser = await checkUser(userEmail);
      const userEditPayload = {...newUser, name: userName, countryCode: "+380", phone: `${numberNanoid(10)}`};
      const userResponse = await apiClient.put('/api/user',userEditPayload);
      console.log(userResponse.data , "last res");
      return userResponse.data
    } catch (error) {
      console.error(
        'Error:',
        error.message
      );
    }
  }
  return userId
}
  
  async function checkCompanyExists(companyName) {
    try {
      const response = await apiClient.get('/api/company/list');
      const data = response.data;
      const companyExists = data.content.find(
        company => company.name === companyName
      );
      return companyExists ? companyExists.id : false
    } catch (error) {
      console.error('List companies error:', error);
    }
  }

  async function checkProjectExists(projectName) {  
    try {
      const response = await apiClient.get('/api/project/list');
      const data = response.data;
      const projectExists = data.content.find(
        project => project.name === projectName
      );
      return projectExists ? projectExists.id : false
    } catch (error) {
      console.error('List projecrs error:', error);
    }
  }
  
  async function createCompany(companyData) {
    try {
    const companyId = await checkCompanyExists(companyData.name);
    if(!companyId){   
      const response = await apiClient.post('/api/company', companyData);
      return response.data.id;
    } 
    return companyId
    }
    catch (error) {
      console.log(error, 'error');
    }
  }
  
  async function createProject(companyId, projectData) {
    try {
      const projectId = await checkProjectExists(projectData.name);
      if (!projectId) {
        const response = await apiClient.post(
          `/api/project?companyId=${companyId}`,
          projectData
        );
        return response.data.id;
      }
      return projectId;
    } catch (error) {
      console.log(error);
    }
  }
   
   async function createFloorInProject(projectId, floor) {
    try {
      const response = await apiClient.post(`/api/floor?projectId=${projectId}&floorName=${floor}`);
      return response.data.id;
    } catch (error) {
      console.log(error, 'error');
    }
  }
  
  
  async function unitCreate(floorId, unit) {
    try {
      const response = await apiClient.post(`/api/unit?floorId=${floorId}&unitName=${unit}`);
      console.log(response.data);
      return response.data.id;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function templateCreate(unitId, templateName, templatePayload) {
    try {
      const payLoad = { ...templatePayload, name: templateName };
      const response = await apiClient.post(
        `/api/room?unitId=${unitId}&templateName=${templateName}`,
        payLoad
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function roomCreate(unitId, roomPayload) {
    try {
      const response = await apiClient.post(`/api/room?unitId=${unitId}`, roomPayload);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function taskCreate(projectId, taskPayload) {
    try {
      const formData = new FormData();
      formData.append('task', JSON.stringify(taskPayload));
      const response = await apiClient.post(
        `/api/task?projectId=${projectId}`,
        formData
      );
      console.log(response.data);
      return response.data.id;
    } catch (error) {
      console.log(error);
    }
  }

  async function addTasksToProject(
    projectId,
    taskPayload,
    number,
    userId,
    name = null
  ) {
    console.log(userId, 'userId');

    for (let i = 0; i < number; i++) {
      let payload = {
        ...taskPayload,
        name: `Task${i}`,
        member: {
          ...taskPayload.member,
          id: userId,
        },
      };
      if (name) {
        payload = {
          ...taskPayload,
          name: `${name}`,
          member: {
            ...taskPayload.member,
            id: userId,
          },
        };
      }
      await taskCreate(projectId, payload, userId);
    }
  }
  

  async function addStatusToProject(projectId, statusId, statusPayload) {
    try {
    const statusAdd = statusPayload.map((item,index) => (item.id ? {...item, id:statusId+index
    }: {...item}));
   
      const response = await apiClient.put(`/api/project/${projectId}/areaStatus`, statusAdd);
    } catch (error) {
      console.log(error);
    }
  }


  async function companyDelete(companyId){
    
    try {
      const response = await axios.delete(`/api/company?companyIds=${companyId}`);
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  async function processUnit(unitId, name, templatePayload, roomPayload) {
  await templateCreate(unitId, name, templatePayload);
  await roomCreate(unitId, roomPayload);
}

  async function changeAreaStatus(areaId, statusNumber='12387') {
    try {
      const timestamp = Date.now();
      const response = await apiClient.put(`/api/area/${areaId}/status?timestamp=${timestamp}&statusId=${statusNumber}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);  
    }
  }

  async function createMultipleProjects(companyId, numProjects) {
    for (let i = 0; i < numProjects; i++) {
      const projectData = ramdomProjectPayload();  
  
      try {
        const projectId = await createProject(companyId, projectData);
        if (projectId) {
          console.log(`Create ${i + 1} project with ID: ${projectId}`);
        } else {
          console.log(`Project ${i + 1} exist.`);
        }
      } catch (error) {
        console.error(`Error with project ${i + 1}:`, error);
      }
    }
  }

async function createProjectWithDetails(
  companyId,
  projectPayload,
  floorPayload,
  unitPayloads,
  templatePayload = null,
  roomPayloads = null,
  userPayload = null,
  userName=null,
  taskPayload = null,
  numOfTasks = 0,
  specifiedFloorIndex=null,
  statusCreatePayload=null,
  changeAreaStatusNumber=null
) {
  try {
    const projectId = await createProject(companyId, projectPayload);
    console.log(`Project created: ${projectId}`);
    let userId;
    let floorIds = [];
    let templates = [];
    let rooms =[];

    for(let i= 0; i < floorPayload.length; i++){
      const floorName = Object.values(floorPayload[i])[0];
      const floorId = await createFloorInProject(projectId, floorName);
      console.log(`Floor created in project ${projectId}: ${floorId}`);
      const floorDate = floorId;
      floorIds.push(floorDate);
    }
    if (specifiedFloorIndex < 0 || specifiedFloorIndex >= floorIds.length+1) {
      throw new Error(`Specified floor index ${specifiedFloorIndex} is out of bounds.`);
    }
    console.log(specifiedFloorIndex, 'specifiedFloorIndex');
    
    const specifiedFloorId = floorIds[specifiedFloorIndex-1];
    console.log(specifiedFloorId, 'specifiedFloorId', floorIds);
    
    for (let i = 0; i < unitPayloads.length; i++) {
      console.log(specifiedFloorId, 'specifiedFloorId');
      const unitId = await unitCreate(specifiedFloorId-1, unitPayloads[i]);
      const unitIdSecond = await unitCreate(specifiedFloorId, unitPayloads[i]);
      console.log(`Unit created in floor ${specifiedFloorIndex + 1}: ${unitId}`);

      if (templatePayload) {
        const templateCreated = await templateCreate(unitId, `Bedroom ${i + 1}`, templatePayload);
        console.log(`Template created: ${templateCreated}`);
        templates.push(templateCreated);
      }
      if(roomPayloads){
        const roomId = await roomCreate( unitId, roomPayloads);
        const roomIdSecond = await roomCreate(unitIdSecond, roomPayloads);
        rooms.push(roomId)
      }
    }
    
    if (userPayload) {
      userId = await createUser(userPayload.email, userPayload, companyId, userName, [projectId]);
      console.log(`User created: ${userId}`);
    }
    if (taskPayload && numOfTasks > 0) {
      console.log(userId, 'userId', numOfTasks, 'numOfTasks');
      if(!userId){
        await firstUserByRole('ROLE_ADMI')
      }
      await addTasksToProject(projectId, taskPayload, numOfTasks, userId.id);
      console.log(`Tasks added to project ${projectId}`);
    }
    let statusId
    if(templates.length>0){
        console.log(templates, 'templates');
        
        statusId = templates[0].areas[0]
      }
    else if(rooms.length >0 && !statusId){
        console.log(rooms, 'rooms')
        statusId = rooms[0].areas[0]
      }
    if(statusCreatePayload){
      await addStatusToProject(projectId, statusId.status.id ,statusCreatePayload);
    }
    if(changeAreaStatusNumber){

      console.log(statusId);
      
      await changeAreaStatus(statusId.id, statusId.status.id+changeAreaStatusNumber);
    }
    return projectId;
  } catch (error) {
    console.error('Error during project creation:', error.message);
    throw error;
  }

}

  module.exports = {
    login,
    checkCompanyExists,
    createCompany,
    createProject,
    createFloorInProject,
    unitCreate,
    templateCreate,
    roomCreate,
    taskCreate,
    companyDelete,
    checkProjectExists,
    createUser,
    processUnit,
    changeAreaStatus,
    addTasksToProject,
    addStatusToProject,
    createMultipleProjects,
    createProjectWithDetails,
    createSUUser
  };