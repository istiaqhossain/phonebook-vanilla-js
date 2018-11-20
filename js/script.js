"use strict";

// Pending Features:
// Error Msg

// Define Variables
var contactList = [];
var storage = localStorage.getItem('md_istiaq_hossain_phonebook');

if(storage !== null){
	contactList = JSON.parse(storage);
}

var updateIndex = 0;
var startIndex = 0;
var endIndex = 0;

var addContact = document.querySelector('.addContact');
var saveContact = document.querySelector('.saveContact');
var popUpContainer = document.querySelector('.popup-container') ;
var popUpClose = document.querySelector('.popup-close') ;

var listBody = document.querySelector('.list_body') ;
var showNumber = document.querySelector('.show_number') ;
var count = document.querySelector('.count') ;
var startCount = document.querySelector('.start_count') ;
var endCount = document.querySelector('.end_count') ;
var listingPagination = document.querySelector('.listing_pagination') ;

var firstName = document.querySelector('#first_name') ;
var lastName = document.querySelector('#last_name') ;
var address = document.querySelector('#address') ;
var phoneNumber = document.querySelector('#phone_number') ;

// Add Eventlistener
addContact.addEventListener('click',togglePopUp);
popUpClose.addEventListener('click',togglePopUp);
saveContact.addEventListener('click',updateContactList);
showNumber.addEventListener('change',() => {    
	resetIndex();
	generatePagination();
	renderContacts();   
});

// Functions
generatePagination();
setShowingNumber();
renderContacts();

// Reset Index
function resetIndex(){
	startIndex = 0;
	endIndex = 0;
}

// Call pagination
function callPagination(page_index){
	listingPagination.querySelectorAll('ul li a').forEach(function(element){
		element.classList.remove('active');
	});
	listingPagination.querySelector('ul li a[data-paginate="'+page_index+'"]').classList.add('active');

	setShowingNumber();
	renderContacts();
}

// Set Showing Number
function setShowingNumber(){
	let currentPaginate = ( listingPagination.querySelector('.active') ) ? parseInt(listingPagination.querySelector('.active').innerHTML) : '';
	let currentShowNum = showNumber.value;

	if(currentPaginate == 1){
		startIndex = startCount.innerHTML = currentPaginate;
		endIndex = endCount.innerHTML = currentShowNum;
	}else{
		let newCount = currentPaginate * currentShowNum;
		startIndex = startCount.innerHTML = newCount - currentShowNum + 1;
		endIndex = endCount.innerHTML = (newCount > contactList.length ) ? contactList.length : newCount;
	}
}

// Generate Pagination
function generatePagination(){

	let paginate = Math.ceil(contactList.length / showNumber.value);

	let content = '';
	content += '<ul>';
	for (let i = 1; i <= paginate; i++) {
		let paginate_class = '';
		if(i == 1){
			paginate_class = 'active';
		}
		content += '<li><a href="javascript:void(0);" data-paginate="'+i+'" class="'+paginate_class+'" onClick="callPagination('+i+')">';		
		content += i;		
		content += '</a></li>';
	}
	content += '</ul>';

	listingPagination.innerHTML = content;
}

// Store ContactList
function storeContactList(){
	localStorage.setItem('md_istiaq_hossain_phonebook',JSON.stringify(contactList));
}

// Toggle PopUp
function togglePopUp(){
	let flag = popUpContainer.classList.contains('popup-visible');

	if(!flag){
		popUpContainer.classList.add('popup-visible');
	}else{
		resetInputs();
		popUpContainer.classList.remove('popup-visible');
	}
}

// GENERATE ID
function generateID(){
	return new Date().getTime();
}

// Update Contact List
function updateContactList(){
	let buttonState = saveContact.innerHTML;
	
	if(validateInputs() == false){
		return false;
	}

	if(buttonState === 'Save Contact'){
		let contact = {
			ID : generateID(),
			firstName : firstName.value,
			lastName : lastName.value,
			address : address.value,
			phoneNumber : phoneNumber.value,
		};

		contactList.push(contact);

	}else{
		var permission = confirm("Want to update?");

		if(permission == true){
			let obj = contactList[updateIndex];
			
			obj.firstName = firstName.value;
			obj.lastName = lastName.value;
			obj.address = address.value;
			obj.phoneNumber = phoneNumber.value;

			contactList[updateIndex] = obj;
		}
	}

	togglePopUp();

	storeContactList();

	generatePagination();

	setShowingNumber();

	renderContacts();
}

// Rander Contacts
function renderContacts(){
	let content = '';

	let noOfContact = contactList.length;

	count.innerHTML = noOfContact;

	let contactRange = '';

	if(startIndex > 0 && endIndex > 0){
		contactRange = range(startIndex-1, endIndex-1);
	}


	let counter = 0;

	for(let i = 0; i < noOfContact; i++){
		
		let contactKey = getContactIndex(contactList[i].ID);

		let haveKey = contactRange.includes(contactKey);

		if(contactList[i] && counter < showNumber.value){

			if(Array.isArray(contactRange) && haveKey == false){
				continue;
			}

			let date = new Date(contactList[i].ID).toDateString();
			content += '<li>';
				content += '<ul>';
					content += '<li data-column="First Name">'+contactList[i].firstName+'</li>';
					content += '<li data-column="Last Name">'+contactList[i].lastName+'</li>';
					content += '<li data-column="Address">'+contactList[i].address+'</li>';
					content += '<li data-column="Phone Number">'+contactList[i].phoneNumber+'</li>';
					content += '<li data-column="Created At">'+date+'</li>';
					content += '<li data-column="Action">';
						content += '<a href="javascript:void(0);" onClick="editContact('+contactList[i].ID+')" class="edit-list"><img src="img/edit.png" /></a>';
						content += '<a href="javascript:void(0);" onClick="deleteContact('+contactList[i].ID+')" class="delete-list"><img src="img/delete.png" /></a>';
					content += '</li>';
				content += '</ul>';
			content += '</li>';

			counter++;
		}
		
	}

	listBody.innerHTML = content;
}

// Get The INDEX 
function getContactIndex(ID){
	let contactIndex = undefined;
	contactList.forEach(function(item, index, array) {
		if(item.ID == ID){
			contactIndex = index;
		}
	});

	return contactIndex;
}

// Edit Contact
function editContact(ID){
	updateIndex = getContactIndex(ID);	

	firstName.value = contactList[updateIndex].firstName;
	lastName.value = contactList[updateIndex].lastName;
	address.value = contactList[updateIndex].address;
	phoneNumber.value = contactList[updateIndex].phoneNumber;
	saveContact.innerHTML = 'Update Contact';

	togglePopUp();
}

// Delete Contact
function deleteContact(ID){
	let index = getContactIndex(ID);	
	var permission = confirm("Want to delete?");
	
	if(permission == true){
		contactList.splice(index,1);

		storeContactList();

		generatePagination();

		setShowingNumber();

		renderContacts();	
	}
	
}

// Generate ID
function generateID(){
	return new Date().getTime();
}


// reset Inputs
function resetInputs(){
	firstName.value = '';
	firstName.classList.remove('field-error');

	lastName.value = '';
	lastName.classList.remove('field-error');

	address.value = '';
	address.classList.remove('field-error');

	phoneNumber.value = '';
	phoneNumber.classList.remove('field-error');

	saveContact.innerHTML = 'Save Contact';
}

// Validate Inputs
function validateInputs(){
	let flag = true;
	if(firstName.value.length == 0){
		flag = false;
		firstName.classList.add('field-error');
	}else{
		firstName.classList.remove('field-error');
	}

	if(lastName.value.length == 0){
		flag = false;
		lastName.classList.add('field-error');
	}else{
		lastName.classList.remove('field-error');
	}

	if(address.value.length == 0){
		flag = false;
		address.classList.add('field-error');
	}else{
		address.classList.remove('field-error');
	}

	if(phoneNumber.value.length == 0){
		flag = false;
		phoneNumber.classList.add('field-error');
	}else{
		phoneNumber.classList.remove('field-error');
	}

	return flag;
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}