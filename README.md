These tests are configured to be used with a Webdriver that is launched through Docker Compose. 
To use them on a local machine without Docker Compose, you need to install the Webdriver locally 
and modify the settings in the webdriver.js file, specifically by commenting out the line ".usingServer("http://selenium-hub:4444/wd/hub").

Instruction:
clone the Git repository to your PC
install (npm init)
running (npm run test)

Selenium tests for the 1 milestone include:

1	Log In the Colorjob as Super admin	super admin
2	Log Out the Colorjob as Super admin	super admin
3	Create new company	super admin
4	Update Company Details (company name) via the tab settings	super admin
5	Remove the company via the tab settings	super admin
6	Create project on the projects list	super admin
7	Update Project Details (project name) on Project settings page	super admin
8	Remove project on the projects list	super admin
9	Invite user(employee) on the users list	super admin
10	Remove user(employee) on the users list	super admin
11	Forgot password employee test	employee
12	Update own User Details company admin	company admin
13	Create project on the projects list by the Company Admin via Create Project button	company admin
14	Edit Project Details (project name) by the Company Admin through the three dots menu on Projects List	company admin
15	Remove project on the projects list by the Company Admin through the three dots menu on Projects List	company admin
16	Update own User Details employee	employee
17	Invite user(Company Admin) by the company admin	company admin
18	Remove user(Company Admin) by the company admin through the three dots menu on Users List	company admin


Selenium tests for the 2 milestone include:

1	Create task in the project by "Create task" Button	super admin
2	Searching by name task in the project	super admin
3	Edit task via  (...) Menu (task name)	super admin
4	Remove task via  (...) Menu	super admin
5	Сhange task status 	super admin
6	Delete Multiple Tasks 	super admin
7	Filter tasks by the Status	super admin
8	Sort tasks by number	super admin
9	Pagination by the Number of Entities per Page	super admin
10	Pagination by the button	super admin
11	Pagination by the arrow	super admin
12	Create new Task by the employee 	employee
13	Update Task Details by the employee via  (...) Menu	employee
14	Remove task by the employee via  (...) Menu	employee
15	Add attachment to the Task  (image png if testing location and txt file if testing in docker)	super admin

Selenium tests for the 3 milestone include:

1	Add Floor	super admin
2	Edit Floor	super admin
3	Delete Floor	super admin
4	Create First Unit/Create Unit via Add unit button	super admin
5	Update Unit	super admin
6	Delete Unit	super admin
7	Create Unique Room	super admin
8	Update Unique Room with check "Save as a template"	super admin
9	Delete Area when Detaching template	super admin
10	Delete Unique Room	super admin
11	Changing the floor sequence	super admin
12	Changing the Units sequence	super admin
13	Duplicate Floor	super admin
14	Delete duplicate Floor	super admin
15	Create Room based on Template	super admin
16	Editing a room based on a template (update template room)	super admin
17	Delete Room based on a template (delete template room)	super admin

Selenium tests for the 4 milestone include :
1	Change Status of the Area from "To Do" to "In progress"	super admin
2	"Displaying Area details by clicking on the area in a View tab

"	super admin
3	Change the status of the area from  "In Progress" to "To Do"	super admin
4	Change the status of the area from "Done "to "In Progress" 	super admin
5	Changing the progress status of the area by clicking on the progress status bar.	super admin
6	Change Progress Status of the Area by Btn(-)	super admin
7	Closing the Area pop-up by clicking the close button (X) in a View tab	super admin
8	Change Status of the Area in a Project Progress tab from "To Do" to "In progress"	super admin
9	"Displaying Area details by clicking on the area cube in a Project Progress tab
"	super admin
10	Change the status of the area from  "In Progress" to "To Do" in a Project Progress tab	super admin
11	Change the status of the area from "Done "to "In Progress" in a Project Progress tab	super admin
12	Changing the progress status of the area by clicking on the progress status bar of area in a Project Progress tab	super admin
13	Change Progress Status of the Area by Btn(-) in a Project Progress tab	super admin
14	Closing the Area pop-up by clicking the close button (X) in a Project Progress tab	super admin
15	Editing the room template via the Add Room menu	super admin
16	Delete Room template  via the Add Room menu	super admin
17	Duplicate unit between floors	super admin
18	Deleting a duplicated unit between floors.	super admin
19	Сheck changes of Project Progress(%) when changing status of Area from To Do to In Progress	super admin
20	Сheck changes of Project Progress(%) when changing Progress status of Area (change to %)	super admin
21	Сheck changes of Project Progress(%) when changing status of Area from In Progress to Done	super admin
22	Сheck changes of Project Progress(%) when progress is 100% and adding New room with Area	super admin
23	Сheck changes of Project Progress(%) when progress is 100% and removing room with Area	super admin

Selenium tests for the 5 milestone include:

1	Add comment to the Area on the view tab	super admin
2	Edit comment in the Area on the view tab	super admin
3	Delete comment in the Area on the view tab	super admin
4	"Checking the change on the History tab after changing status progress
of the Area on the view tab"	super admin
5	Add attachment to comment (image png if testing location and txt file if testing in docker)	super admin
6	Delete attachment within the comment in the Area	super admin
7	Mention User (Company Admin) in the comment 	super admin
8	Delete mention user (Company Admin) from the comment	super admin

Selenium tests for the 6 milestone include:

1	Create Custom Status	super admin
2	Edit Custom Status	super admin
3	Detach the custom status from the area and then delete it	super admin
4	Add a custom status to the area and try to delete it	super admin
5	Filter Floors on Project Progress table	super admin
6	Reset Floors Filter on Project Progress table	super admin

Selenium tests for the 7 milestone include:

1	Add weight to the Area and check project progres(medium to large)	super admin
2	Change weight to the Area and check project progres(lage to medium)	super admin
3	Check rooms grouping by name when rooms are on different units and with different Areas within the one floor	super admin
4	Receive notification about mentioning in the comment within the Area
	super admin to the company admin
5	Receive notification about assigning in the Task	employee to the company admin
6	Receive notification about assigning in the Task by assign to himself (company admin)	company admin

Selenium tests for the 8 milestone include:

1	Check the counter of avaliable invitations when Inviting new user within the Company 	project manager
2	Check suggested room name when creating the room based on Template	project manager
3	Check suggested template name when creating the room and save as Template	project manager
4	Update Plan on Edit company form	super admin
5	Check Users within the Company on Company Details	super admin
6	Create a unique room with an already existing Room name	project manager

Selenium tests add in the 10 milestone include:

1	Verification of Pagination and Pagination Counter upon User Invitation to the project, Task Assignment to the User, and User Removal from the Project
2	Detach Template when Updating a template room 
3	Removing the company with projects via (...) menu
4	Removing the company with user via  (...) menu
5	Removing the company with user and project via  (...) menu
6	Create a project with duplicated 20 units with 4 template rooms with 9 areas

Selenium tests add in the 12 milestone include:

1  Customize status - delete status
2  Edit unit name double click
3  The triangle indicating the presence of comments/attachments is displayed in invalid color on Area cube

Selenium tests add in the 12 milestone include:

1  Verification about cursor in first field of item creation forms
2  Hide completed projects in the chrom browser
3  Infinity scroll on My open tasks (for CA, PM, Stand. User)
4  Infinity scroll on Projects for superadmin
5  See all button on Dashboard
6  Project  and Company opening by ID and Name (for super admin)
7  Task opening by ID and Name