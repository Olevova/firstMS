const config = require('../config');

const  {nanoid} = require('nanoid');
const { customAlphabet } = require('nanoid')
const numberNanoid = customAlphabet('1234567890', 10);
const nanoidCode = customAlphabet('abcdefgclmnprst', 4);

const email = config.email;
const password = config.password;
const superUserPayload={
  id: 1,
  role: "ROLE_SUPERADMIN",
  name: "Ben",
  email: "superadmin@gmail.com",
  countryCode: "+380",
  phone: "2222222222",
  company: null,
  projects: [],
  version: 1,
  currentCountryCode: "UA"
}

const companyPayload = {
  projects: [],
  name: config.companyName,
  address1: 'test street',
  address2: '12',
  state: config.newCompanyState,
  city: config.newCompanyCity,
  zipCode: config.newCompanyZip,
  countryCode: '+380',
  phoneNumber: `1214457991`,
  email: config.emailCA,
  subdomain: 'autotests',
  type: 'FLOORING',
  companyPlan: {
    id: 2,
    planName: config.newCompanyPlan,
    maxUsers: 10000,
    orderNumber: 1,
  },
};
const companyPayloadPlan = {
  projects: [],
  name: config.companyCheckPlane,
  address1: 'street plan',
  address2: '12',
  state: 'Alabama',
  city: config.newCompanyCity,
  zipCode: config.newCompanyZip,
  countryCode: '+380',
  phoneNumber: `1216667991`,
  email: 'testplan@gmail.com',
  subdomain: 'test plan',
  type: 'FLOORING',
  companyPlan: {
    id: 4,
    planName: config.newCompanyCustomPlan,
    maxUsers: 1000,
    orderNumber: 4,
  },
};
function randomCompanyPayload (){ return {
  projects: [],
  name: nanoid(6),
  address1: nanoid(7),
  address2: nanoid(2),
  state: config.newCompanyState,
  city: config.newCompanyCity,
  zipCode: config.newCompanyZip,
  countryCode: '+380',
  phoneNumber: `${numberNanoid(10)}`,
  email: `${nanoid(5)}@gmail.com`,
  subdomain: nanoid(6),
  type: 'ELECTRICAL',
  companyPlan: {
    id: 2,
    planName: config.newCompanyPlan,
    maxUsers: 10000,
    orderNumber: 1,
  },
}};

const userCaName = config.userCAName;
const adminUserPayload = {email: config.emailCA, role: "ROLE_ADMIN", projectIds: [], companyId: null};

const userCaNameParallel = config.taskTestUserCA;
const adminUserParallelPayload = {email: "haloyob321@luvnish.com", role: "ROLE_ADMIN", projectIds: [], companyId: null};

const userPMName = config.userPMName;
const PMUserPayload = {email: config.emailPM, role: "ROLE_PROJECT_MANAGER", projectIds: [], companyId: null};

const userPMNameParallel = config.taskTestUserPM;
const PMUserParallelPayload = {email: config.emailSUSecond, role: "ROLE_PROJECT_MANAGER", projectIds: [], companyId: null};

const userSUName = config.userSUName;
const SUUserPayload = {email: config.emailSU, role: "ROLE_EMPLOYEE", projectIds: [], companyId: null};

const userSUNameParallel = config.taskTestUserSU;
const SUUserParallelPayload = {email: "yalokix960@givehit.com", role: "ROLE_EMPLOYEE", projectIds: [], companyId: null};

const userSUNameTask = config.taskTestUser;
const SUUserTaskPayload = {email: config.taskTestUserEmail, role: "ROLE_EMPLOYEE", projectIds: [], companyId: null}

function ramdomProjectPayload (){
  return {
    company: { projects: [] },
    name: nanoid(6),
    publicKey: nanoidCode(4).toLowerCase(),
    address1: nanoid(6),
    address2: '22',
    state: 'Alabama',
    city: 'Auburn',
    zipCode: '32455',
    number: numberNanoid(4),
    clientName: nanoid(6),
    startDate: null,
    endDate: null,
  };
}

const projectPayloadMain = {
  company: { projects: [] },
  name: config.projectNameMain,
  publicKey: 'ROL3',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: '1311',
  clientName: 'red',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadDoneStatus = {
  company: { projects: [] },
  name: config.projectStatus,
  publicKey: 'RROJ',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: '32f',
  clientName: 'red',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadDone = {
  company: { projects: [] },
  name: "DONE",
  publicKey: 'OJR',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: '321f',
  clientName: 'red2',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadUnitEdit = {
  company: { projects: [] },
  name: config.projectNameEdit,
  publicKey: 'UN',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: 'UN',
  clientName: 'un client',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadCA = {
  company: { projects: [] },
  name: config.projectNameForCA,
  publicKey: 'CAT',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: '22ca',
  clientName: 'ca client',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadPM = {
  company: { projects: [] },
  name: config.projectNameForPM,
  publicKey: 'PMPR',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: 'pmtest',
  clientName: 'pm client',
  startDate: 1727730000000,
  endDate: null,
};

const projectPayloadSU = {
  company: { projects: [] },
  name: config.projectNameForSU,
  publicKey: 'SUT',
  address1: 'test adress',
  address2: '22',
  state: 'Alabama',
  city: 'Auburn',
  zipCode: config.newProjectZip,
  number: 'sutest',
  clientName: 'su client',
  startDate: 1727730000000,
  endDate: null,
};

const floor = [{floor2: 'floor%202'},{floor3: 'floor%203'}];
const floor2 =[{floor2: 'floor%202'}]
const unit = ['first','second']
const names = ['bedroom','loung']

const templatePayload = {
  areas: [
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'bed',
      changed: true,
    },
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'door',
      changed: true,
    },
  ],
  usageAmount: 1,
  name: null,
  subtitle: null,
};

const templatePayloadSecond = {
  areas: [
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'bed',
      changed: true,
    },
  ],
  usageAmount: 1,
  name: null,
  subtitle: null,
};
const roomPayload = {
  areas: [
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'bed',
      changed: true,
    },
  ],
  usageAmount: 1,
  name: 'bed',
  subtitle: null,
};

const roomPayloadSecond = {
  areas: [
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'bed',
      changed: true,
    },
    {
      areaWeight: 'MEDIUM',
      comments: [],
      files: [],
      history: [],
      name: 'lamp',
      changed: true,
    },
  ],
  usageAmount: 1,
  name: 'Kitchen',
  subtitle: null,
};

const taskPayload = {files:[],name:"Task1",status:"TO_DO",description:null,dueDate:null,member:{id:1180}}
const taskPayloadDone = {files:[],name:"Filter",status:"DONE",description:null,dueDate:null,member:{id:1180}}
const statusPayload = [
  {
    id: 5587,
    color: "#CBD1DA",
    name: "To Do",
    orderNumber: -3,
    defaultStatus: true,
    inUse: true
  },
  {
    id: 5588,
    color: "#37A702",
    name: "In Progress",
    orderNumber: -2,
    defaultStatus: true,
    inUse: true
  },
  {
    id: 5589,
    color: "#116A1F",
    name: "Done",
    orderNumber: -1,
    defaultStatus: true,
    inUse: false
  },
  {
    name: "color",
    color: "#E3443A",
    changed: true,
    orderNumber: 1,
    defaultStatus: false,
    error: false
  }
]


module.exports = {
  email,
  password,
  companyPayload,
  companyPayloadPlan,
  randomCompanyPayload,
  ramdomProjectPayload,
  projectPayloadMain,
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
  names,
  roomPayloadSecond,
  statusPayload,
  taskPayloadDone,
  projectPayloadDone
};
