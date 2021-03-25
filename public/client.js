const getBookText = document.getElementById('get-book-text');
const getBookSubmit = document.getElementById('get-book-submit');
const newBookText = document.getElementById('new-book-text');
const newBookSubmit = document.getElementById('new-book-submit');
const bookList = document.getElementById('book-list');
const deleteAllBooks = document.getElementById('delete-all-books');


const bookDetail = document.getElementById('book-detail');
const bookTitle = document.getElementById('book-title');
const id = document.getElementById('current-book-id');
const commentText = document.getElementById('comment-text');
const submitComment = document.getElementById('comment-submit');
const comments = document.getElementById('comments');
const deleteOneBook = document.getElementById('delete-one-book');

const messages = document.getElementById('messages');

async function getBooks() {
  const data = await fetch("/api/books", { method: 'GET' });
  const parsed = await data.json();
  bookList.innerHTML = '';

  parsed.forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.onclick = () => showBook(book._id);
    bookItem.className = 'books';
    const format = book.commentcount == 1 ? 'comment available' : 'comments available';
    bookItem.innerText = `${book.title}, ${book.commentcount} ${format}`;
    bookList.appendChild(bookItem);
  })
};

async function showBook(passedId) {

  const data = await fetch(`/api/books/${passedId}`, { method: 'GET' });
  const book = await data.json();
  messages.style.visibility = 'hidden';
  bookDetail.style.visibility = 'visible';
  bookTitle.innerText = book.title;
  id.innerText = book._id;

  const commentsList = book.comments || [];
  comments.innerHTML = '';
  commentsList.forEach(comment => {
    const commentLi = document.createElement('li');
    commentLi.innerText = comment;
    comments.appendChild(commentLi);
  });
}

document.addEventListener("DOMContentLoaded", getBooks);

newBookSubmit.onclick = async (e) => {
  e.preventDefault();

  bookDetail.style.visibility = 'hidden';
  messages.style.visibility = 'visible';

  const title = newBookText.value;
  newBookText.value = '';
  const data = await fetch("/api/books", {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ "title": title })
  });
  const parsed = await data.json();
  getBooks();

  if (parsed.title) messages.innerText = 'You successfully added the book.'
  else messages.innerText = parsed;
}

deleteAllBooks.onclick = async () => {
  bookDetail.style.visibility = 'hidden';
  messages.style.visibility = 'visible';
  const response = await fetch("/api/books", { method: 'DELETE' });
  const parsed = await response.json();
  if (parsed == 'complete delete successful') {
    messages.innerText = 'You succesfully deleted the entire library.';
    getBooks();
  } else {
    messages.innerText = 'Something went wrong. The books are not deleted. Please try again.';
    getBooks();
  }
}

getBookSubmit.onclick = (e) => {
  e.preventDefault();
  showBook(getBookText.value);
}

deleteOneBook.onclick = async (e) => {
  e.preventDefault();

  const data = await fetch(`/api/books/${id.innerText}`, { method: "DELETE" });
  const parsed = await data.json();

  bookDetail.style.visibility = 'hidden';
  messages.innerText = parsed === 'delete successful' 
  ? 'The book was deleted successfully' 
  : 'Something went wrong. The book was not deleted. Please try again.';
  messages.style.visibility = 'visible'; 
}

submitComment.onclick = async (e) => {
  e.preventDefault();

  const comm = commentText.value;
  commentText.value = '';
  const data = await fetch(`/api/books/${id.innerText}`, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ "comment": comm })
  });
  const parsed = await data.json();

  if (parsed.title) {
    const newComm = document.createElement('li');
    newComm.innerText = comm;
    comments.appendChild(newComm);
    getBooks();
  } 
}
