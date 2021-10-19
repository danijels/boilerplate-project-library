const $newBookTitle = document.getElementById('new-book-title');
const $newBookAuthor = document.getElementById('new-book-author');
const $newBookSubmit = document.getElementById('new-book-submit');
const $bookList = document.getElementById('book-list');
const $currBooks = document.getElementById('curr-books');
const $totalBooks = document.getElementById('total-books');
const $nextBooks = document.getElementById('next-books');
const $prevBooks = document.getElementById('prev-books');
const $deleteAllBooks = document.getElementById('delete-all-books');


const $bookDetail = document.getElementById('book-detail');
const $bookTitle = document.getElementById('book-title');
const $id = document.getElementById('current-book-id');
const $commentText = document.getElementById('comment-text');
const $submitComment = document.getElementById('comment-submit');
const $comments = document.getElementById('comments');
const $currComments = document.getElementById('curr-comments');
const $totalComments = document.getElementById('total-comments');
const $nextComments = document.getElementById('next-comments');
const $prevComments = document.getElementById('prev-comments');
const $deleteOneBook = document.getElementById('delete-one-book');
const $deleteAllComments = document.getElementById('delete-all-comments');

const $messages = document.getElementById('messages');

/*================Common functions===================*/
function toggleDisabled($curr, $total, $next, $prev) {
    if ($curr.innerText === '1') $next.disabled = true;
    else $next.disabled = false;
    if ($total.innerText === $curr.innerText) $prev.disabled = true;
    else $prev.disabled = false;
}

function showError(message) {
    $bookDetail.style.visibility = 'hidden';
    $messages.innerText = message;
    $messages.style.visibility = 'visible';
}

/*===========Book list related events and functions===============*/

async function getBooks() {
    const data = await fetch("/api/books", { method: 'GET' });
    const parsed = await data.json();

    const dataTotal = await fetch('/api/books/count');
    let total = await dataTotal.json();
    total = Math.ceil(Number(total) / 10);

    if (!parsed.error && !total.error) {
        $currBooks.innerText = '1';
        $totalBooks.innerText = total || '1';

        makeList(parsed);
    } else showError(parsed.error);
    
};

function makeList(list) {
    $bookList.innerHTML = '';
    
    list.forEach(book => {
      const bookItem = document.createElement('li');
      bookItem.onclick = () => showBook(book._id);
      bookItem.className = 'books';
      bookItem.id = book._id;
      const format = book.commentcount == 1 ? 'comment' : 'comments';
      bookItem.innerHTML = `<p class="title">${book.title}</p> <p class="author">${book.author}</p> <p>${book.commentcount} ${format}</p>`;
      $bookList.appendChild(bookItem);
    });

    toggleDisabled($currBooks, $totalBooks, $nextBooks, $prevBooks); 
}

document.addEventListener("DOMContentLoaded", async () => {
    getBooks();
});

$newBookSubmit.onclick = async (e) => {
    e.preventDefault();

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

    if (parsed.title) {
        getBooks();
        showBook(parsed._id);
    }   else if (parsed.error) showError(parsed.error);
}

$nextBooks.onclick = async (e) => {
    e.preventDefault();
    const all = document.getElementsByClassName('books');
    const firstId = all[0].id;

    const data = await fetch(`/api/books/next/${firstId}`);
    const parsed = await data.json();

    if (!parsed.error) {
        makeList(parsed);

        $currBooks.innerText = Number($currBooks.innerText) - 1;
        toggleDisabled($currBooks, $totalBooks, $nextBooks, $prevBooks);  
    }
}

$prevBooks.onclick = async (e) => {
    e.preventDefault();
    const all = document.getElementsByClassName('books');
    const lastId = all[all.length - 1].id;
    
    const data = await fetch(`/api/books/prev/${lastId}`);
    const parsed = await data.json();

    if (!parsed.error) {
        makeList(parsed);  
        
        $currBooks.innerText = Number($currBooks.innerText) + 1;
        toggleDisabled($currBooks, $totalBooks, $nextBooks, $prevBooks);  
    }
}

$deleteAllBooks.onclick = async () => {
    $bookDetail.style.visibility = 'hidden';
    $messages.style.visibility = 'hidden';

    const response = await fetch("/api/books", { method: 'DELETE' });
    const parsed = await response.json();

    if (parsed == 'success') getBooks()
    else if (parsed.error) showError(parsed.error);
}

/*==============Book detail related functions and events==============*/

async function showBook(passedId) {
    const data = await fetch(`/api/books/${passedId}`, { method: 'GET' });
    const book = await data.json();

    if (book.error) return showError(book.error);

    $messages.style.visibility = 'hidden';
    $bookDetail.style.visibility = 'visible';
    $bookTitle.innerText = `${book.title}, ${book.author}`;
    $id.innerText = book._id;

    getComments(passedId, book.commentcount);
}

async function getComments(id, total) {
    const data = await fetch(`/api/books/${id}/comments`);
    const parsed = await data.json();
    console.log(parsed);  

    $currComments.innerText = '1';

    if (!parsed.error) {
        $totalComments.innerText = Math.ceil(total / 5) || '1';
        makeComList(parsed);
    } 
}

function makeComList(list) {
    $comments.innerHTML = '';
    
    list.forEach(comment => {
      const commentLi = document.createElement('li');
      commentLi.innerText = comment.content;
      commentLi.className = 'comments';
      commentLi.id = comment._id;

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

    toggleDisabled($currComments, $totalComments, $nextComments, $prevComments); 
}

async function deleteComment(e) {
    const commId = e.target.id;
    const bookId = $id.innerText;

    const data = await fetch(`/api/books/${bookId}/comments/${commId}`, { method: "DELETE" });
    const parsed = await data.json();

    if (parsed === 'success') {
        showBook(bookId);
        getBooks();
    }
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

    if (parsed === 'success') {
        showBook($id.innerText);
        getBooks();
    }   else if (parsed.error) showError(parsed.error);
}

$nextComments.onclick = async (e) => {
    e.preventDefault();
    const id = $id.innerText;
    const all = document.getElementsByClassName('comments');
    const firstId = all[0].id;

    const data = await fetch(`/api/books/${id}/comments/next/${firstId}`);
    const parsed = await data.json();

    if (!parsed.error) {
        makeComList(parsed);

        $currComments.innerText = Number($currComments.innerText) - 1;
        toggleDisabled($currComments, $totalComments, $nextComments, $prevComments); 
    }
}

$prevComments.onclick = async (e) => {
    e.preventDefault();
    const id = $id.innerText;
    const all = document.getElementsByClassName('comments');
    const lastId = all[all.length - 1].id;

    const data = await fetch(`/api/books/${id}/comments/prev/${lastId}`);
    const parsed = await data.json();

    if (!parsed.error) {
        makeComList(parsed);

        $currComments.innerText = Number($currComments.innerText) + 1;
        toggleDisabled($currComments, $totalComments, $nextComments, $prevComments); 
    }
}

$deleteOneBook.onclick = async (e) => {
    e.preventDefault();

    const data = await fetch(`/api/books/${$id.innerText}`, { method: "DELETE" });
    const parsed = await data.json();

    if (!parsed.error) {
        $bookDetail.style.visibility = 'hidden';
        getBooks();
    }   else showError(parsed.error);
}

$deleteAllComments.onclick = async (e) => {
    e.preventDefault();

    const id = $id.innerText;
    const data = await fetch(`/api/books/${id}/comments`, { method: 'DELETE' });
    const parsed = await data.json();

    if (parsed === 'success') {
        getBooks();
        showBook(id);
    } 
}
