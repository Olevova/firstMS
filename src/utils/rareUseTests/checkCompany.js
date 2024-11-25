const axios = require('axios');

const email = 'superadmin@gmail.com';
const password = 'colorjob';
const companyPayload = {
    projects: [],
    name: "bigbig",
    address1: "newbig",
    address2: "12",
    state: "Alabama",
    city: "Khmelnitskiy",
    zipCode: "29111",
    countryCode: "+380",
    phoneNumber: "1214457991",
    email: "big@gmail.com",
    subdomain: "bigbig",
    type: "ELECTRICAL",
    companyPlan: {
        id: 2,
        planName: "Starter",
        maxUsers: 5,
        orderNumber: 1,
    }
};

const projectPayload = {
    company:{projects:[]},
                        name:"newnew",
                        publicKey:"NEW7",
                        address1:"rewwwwww",
                        address2:"eeeeee",
                        state:"Alabama",
                        city:"big",
                        zipCode:"56555",
                        number:"4444",
                        clientName:"grtttt",
                        startDate:1727730000000,
                        endDate:null
                    }

async function login(email, password){
    const url = 'https://dev-backend.colorjob.terenbro.com/login'; 

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('remember_me', 'off');

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Accept': 'application/json',
            },
            withCredentials: true,
        });

        
        const cookies = response.headers['set-cookie'].join(';').split(';')[0];
        console.log('Куки:', cookies);
        return cookies;
    } catch (error) {
        console.error('Помилка:', error.response ? error.response.data : error.message);
    }
};

async function checkCompanyExists(companyName, jsessionId) {
    const url = 'https://dev-backend.colorjob.terenbro.com/api/company/list';
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'cookie': jsessionId,
    };
  
    try {
      const response = await axios.get(url, { headers });
      const data = response.data;
  
      console.log(data.content, 'response');
      
      const companyExists = data.content.some(company => company.name === companyName);
  
      if (companyExists) {
        console.log(`Company "${companyName}" exists.`);
      } else {
        console.log(`Company "${companyName}" does not exist. Create it.`);
      }
    } catch (error) {
      console.error('List companies error:', error);
    }
  }

async function createCompany(companyData,jsessionId){
    const urlCompanyCreate = 'https://dev-backend.colorjob.terenbro.com/api/company';
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'cookie': jsessionId,
      };

      try {
       const response =  await axios.post(urlCompanyCreate, companyData, {headers});
       console.log(response.data);
       return response.data.id
      } catch (error) {
        console.log(error);
        
      }
}

async function createProject(companyId, jsessionId, projectData) {
    const urlForProject = `https://dev-backend.colorjob.terenbro.com/api/project?companyId=${companyId}`;
    console.log(urlForProject, 'urlForProject');
    
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'cookie': jsessionId,
      };
      try {
        const response =  await axios.post(urlForProject, projectData, {headers});
        console.log(response.data, response.data.id, 'res');
        return response.data.id
      } catch (error) {
        console.log(error);
        
      }

}

async function createFloorInProject(projectId, jsessionId) {
    
    const urlForProject = `https://dev-backend.colorjob.terenbro.com/api/floor?projectId=${projectId}&floorName=floor%203`;
    console.log(urlForProject, 'urlForProject');
    
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'cookie': jsessionId,
        'Content-Type': 'application/json'
      };
      try {
        const response =  await axios.post(urlForProject,{} ,{headers});
        console.log(response.data);
        return response.data.id
      } catch (error) {
        console.log(error);
        
      }

}

  (async () => {
    const jsessionId = await login(email, password);
    if (jsessionId) {
        await checkCompanyExists('Назва вашої компанії', jsessionId);

        const companyId = await createCompany(companyPayload, jsessionId)
        if(companyId){
           const projectId =  await createProject(companyId, jsessionId, projectPayload);
           if(projectId){
                await createFloorInProject(projectId, jsessionId )
           }
        }
      }
  })();
