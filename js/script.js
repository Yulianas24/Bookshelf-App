popup =  document.getElementById('popup-input');
popup_edit =  document.getElementById('popup-edit');
let index = -1;
let books = [];

const RENDER_EVENT = 'render_books';
const STORAGE_KEY = 'books';

const search = document.getElementById('search');
search.addEventListener('input', function () {
  appendData(search.value);
});

window.onload = () => {
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadData(){
  if (localStorage[STORAGE_KEY] !== undefined){
    books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
}

document.addEventListener(RENDER_EVENT, function () {
  loadData();
  const belum_dibaca = document.getElementById('belum_dibaca');
  const sudah_dibaca = document.getElementById('sudah_dibaca');
  belum_dibaca.innerHTML = '';
  sudah_dibaca.innerHTML = '';
  for (const book of books){
    if(book.isComplete === true){
      sudah_dibaca.append(showBook(book));
    } else {
      belum_dibaca.append(showBook(book));
    }
  }
});

function appendData(text){
  const belum_dibaca = document.getElementById('belum_dibaca');
  const sudah_dibaca = document.getElementById('sudah_dibaca');
  belum_dibaca.innerHTML = '';
  sudah_dibaca.innerHTML = '';
  for (const book of books){
    if(book['title'].toLowerCase().search(text.toLowerCase()) != -1){
      if(book.isComplete === true){
        sudah_dibaca.append(showBook(book));
      } else {
        belum_dibaca.append(showBook(book));
      }
    }
  }
}
function openPopup(popup){
  popup.style.display = 'block';
}
function closePopup(popup){
  popup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const add_book_form = document.getElementById('add_book_form');
  add_book_form.addEventListener('submit', function(e){
    e.preventDefault();
    addBook();
    popup.style.display = 'none';
    add_book_form.reset();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  const edit_book_form = document.getElementById('edit_book_form');
  edit_book_form.addEventListener('submit', function(e){
    e.preventDefault();
    books[index].title = title.value;
    books[index].author = author.value;
    books[index].year = year.value;
    popup_edit.style.display = 'none';
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
});

function addBook(){
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const id = +new Date();
  const newBook = generateBook(id,title,author,year,false);
  books.push(newBook);
  saveData();
}

function generateBook(id, title, author, year, isComplete){
  return {
    id, title, author, year, isComplete
  }
}

function showBook(bookObject) {
  const row = document.createElement('tr');
  row.id = bookObject.id;
  
  const data_title = document.createElement('td');
  data_title.innerText = bookObject.title;

  const data_author = document.createElement('td');
  data_author.innerText = bookObject.author;

  const data_year = document.createElement('td');
  data_year.innerText = bookObject.year;

  const action = document.createElement('td');

  const swapButton = document.createElement('button');
  swapButton.classList.add('swap');
  swapButton.addEventListener('click', function () {
    swapItem(bookObject.id);
  });

  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.addEventListener('click', function () {
    editItem(bookObject.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', function () {
    deleteItem(bookObject.id);
  });

  action.append(swapButton, editButton, deleteButton);
  row.append(data_title,data_author,data_year, action);
  return row;
}

function swapItem(id){
  for (const book of books){
    if (book.id === id && book.isComplete === false){
      book.isComplete = true;
    } else if(book.id === id && book.isComplete === true) {
      book.isComplete = false;
    }
  }
  saveData();
  search.value = '';
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteItem(id){
  let conf = window.confirm("Apakah ada yakin?");
  for (const index in books){
    if (books[index].id === id && conf === true){
      books.splice(index,1);
    }
  }
  saveData();
  search.value = '';
  document.dispatchEvent(new Event(RENDER_EVENT));
}

const title = document.getElementById('edit_title');
const author = document.getElementById('edit_author');
const year = document.getElementById('edit_year');

function editItem(id) {
  openPopup(popup_edit);
  for (const book  in books){
    if (books[book].id === id){
      index = book;
      title.value = books[book].title; 
      author.value = books[book].author; 
      year.value = books[book].year; 
    }
  }
}


