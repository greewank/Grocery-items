// Selecting constants and functions

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// set up some variables
let editElement;
let editFlag = false;
let editId = "";

// EVENT LISTENERS
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);

// load items
window.addEventListener('DOMContentLoaded', setupItems);
// CALLBACK FUNCTION AND FUNCTIONS
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    createListItems(id, value);
    if (value && !editFlag){
        // display the alert
        displayAlert("Item added to the list", "success");
        // show-container
        container.classList.add('show-container');
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }  
    else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlert('Value is edited', 'success');
        // Editing the local storage
        editLocalStorage(editId, value);
        setBackToDefault();
    }
    else{
        displayAlert('Enter a value!', 'danger');
    }
}

// using functions for displaying all kinds of alerts
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert in 1.5s
    setTimeout(()=>{
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1500);
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    // list is the const declared in the 8th line DON'T CONFUSE IT
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem('list'); 
}

// delete function 
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    // this method removes that 'currentTarget' from the element which is the element to be deleted.
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert('Item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// edit function
function editItem(e){
    // console.log("Edited item");
    // This selects the grocery-item class
    const element = e.currentTarget.parentElement.parentElement;
    // editElement accesses the p tag with the title class.
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId= element.dataset.id;
    submitBtn.textContent = "Edit";
}
// set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = 'Submit';
}

// LOCAL STORAGE
function addToLocalStorage(id, value){
    // This is a shortcut for grocery = {id:id, value:value};
    const grocery = {id, value};
    let items = getLocalStorage(); 
    items.push(grocery);
    // setItems
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter((item) =>{
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map((item)=>{
        if (item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];
}
// localStorage API : The properties to be remembered are getItem, setItem, removeItem and save as strings.
// You need to save elements as strings. Example: an array needs to be converted to a string using JSON.stringify() function
// Example:
// localStorage.setItem('hello', JSON.stringify(['item','item2']));
// let hello = JSON.parse(localStorage.getItem('hello'));
// console.log(hello);
// localStorage.removeItem('hello');

// SETUP ITEMS
function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0){
        items.forEach((item) =>{
            createListItems(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

function createListItems(id, value){
        const element = document.createElement('article');
        // add class
        element.classList.add('grocery-item');
        // Instead of adding dataset id in html, we do it here in js
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="far fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

        // Since, edit and delete buttons don't exist in the main HTML page, we use something called event bubbling.
        // Also, we only have access to these buttons once element.innerHTML runs. Hence, we create functions only after we get access to them.

        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');
        editBtn.addEventListener('click', editItem);
        deleteBtn.addEventListener('click', deleteItem);
        
        // appending the list to the element
        list.appendChild(element);
    }
