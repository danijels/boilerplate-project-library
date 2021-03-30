const $getBookText = document.getElementById('get-book-text');
const $getBookSubmit = document.getElementById('get-book-submit');
const $newBookTitle = document.getElementById('new-book-title');
const $newBookAuthor = document.getElementById('new-book-author');
const $newBookSubmit = document.getElementById('new-book-submit');
const $bookList = document.getElementById('book-list');
const $deleteAllBooks = document.getElementById('delete-all-books');


const $bookDetail = document.getElementById('book-detail');
const $bookTitle = document.getElementById('book-title');
const $id = document.getElementById('current-book-id');
const $commentText = document.getElementById('comment-text');
const $submitComment = document.getElementById('comment-submit');
const $comments = document.getElementById('comments');
const $deleteOneBook = document.getElementById('delete-one-book');
const $deleteAllComments = document.getElementById('delete-all-comments');

const $messages = document.getElementById('messages');

async function getBooks() {
  const data = await fetch("/api/books", { method: 'GET' });
  const parsed = await data.json();
  $bookList.innerHTML = '';
  
  parsed.forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.onclick = () => showBook(book._id);
    bookItem.className = 'books';
    const format = book.commentcount == 1 ? 'comment' : 'comments';
    bookItem.innerText = `${book.title}, ${book.author}, ${book.commentcount} ${format}`;
    $bookList.appendChild(bookItem);
  })
};

async function showBook(passedId) {

  const data = await fetch(`/api/books/${passedId}`, { method: 'GET' });
  const book = await data.json();

  if (!book.title) {
    $bookDetail.style.visibility = 'hidden';
    $messages.style.visibility = 'visible';
    $messages.innerText = 'Sorry, we couldn\'t find this book...'
    return;
  }

  $messages.style.visibility = 'hidden';
  $bookDetail.style.visibility = 'visible';
  $bookTitle.innerText = `${book.title}, ${book.author}`;
  $id.innerText = book._id;

  const commentsList = book.comments || [];
  getComments(commentsList);
}

async function getComments(commentsArray) {
  $comments.innerHTML = '';
  
  commentsArray.forEach(comment => {
    const commentLi = document.createElement('li');
    commentLi.innerText = comment.content;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.id = comment._id;
    deleteButton.onclick = deleteComment;

    const time = document.createElement('span');
    time.className = 'time-tag';
    const date = new Date(comment.date);
    time.innerText = date.toLocaleDateString('en-GB');

    commentLi.appendChild(deleteButton);
    commentLi.appendChild(time);
    $comments.appendChild(commentLi);
  });
}

async function deleteComment(e) {
  const commId = e.target.id;
  const bookId = $id.innerText;

  const data = await fetch(`/api/books/${bookId}/comments/${commId}`, { method: "DELETE" });
  const parsed = await data.json();
  showBook(bookId);
  getBooks();
}

document.addEventListener("DOMContentLoaded", getBooks);

$newBookSubmit.onclick = async (e) => {
  e.preventDefault();

  $bookDetail.style.visibility = 'hidden';
  $messages.style.visibility = 'visible';

  const title = $newBookTitle.value;
  $newBookTitle.value = '';
  const author = $newBookAuthor.value;
  $newBookAuthor.value = '';

  const data = await fetch("/api/books", {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ "title": title, "author": author, "comments": [] })
  });
  const parsed = await data.json();
  getBooks();

  if (parsed.title) $messages.innerText = 'You successfully added the book.'
  else $messages.innerText = parsed;
}

$deleteAllBooks.onclick = async () => {
  $bookDetail.style.visibility = 'hidden';
  $messages.style.visibility = 'visible';
  const response = await fetch("/api/books", { method: 'DELETE' });
  const parsed = await response.json();
  if (parsed == 'complete delete successful') {
    $messages.innerText = 'You succesfully deleted the entire library.';
    getBooks();
  } else {
    $messages.innerText = 'Something went wrong. The books are not deleted. Please try again.';
    getBooks();
  }
}

$getBookSubmit.onclick = (e) => {
  e.preventDefault();
  showBook($getBookText.value);
}

$deleteOneBook.onclick = async (e) => {
  e.preventDefault();

  const data = await fetch(`/api/books/${$id.innerText}`, { method: "DELETE" });
  const parsed = await data.json();

  $bookDetail.style.visibility = 'hidden';
  $messages.innerText = parsed === 'delete successful' 
  ? 'The book was deleted successfully' 
  : 'Something went wrong. The book was not deleted. Please try again.';
  $messages.style.visibility = 'visible'; 
  getBooks();
}

$submitComment.onclick = async (e) => {
  e.preventDefault();

  const comm = $commentText.value;
  $commentText.value = '';
  const data = await fetch(`/api/books/${$id.innerText}`, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ "comment": comm })
  });

  const parsed = await data.json();

  if (parsed.title) {
    getComments(parsed.comments)
    getBooks();
  }
  else {
    $bookDetail.style.visibility = 'hidden';
    $messages.innerText = parsed;
    $messages.style.visibility = 'visible';
  }
}

$deleteAllComments.onclick = async (e) => {
  e.preventDefault();
  const id = $id.innerText;

  const data = await fetch(`/api/books/${id}/comments`, { method: 'DELETE' });
  const parsed = await data.json();

  if (parsed === 'successful') {
    getComments([]);
    getBooks();
  } 
}
