const addButton = document.querySelector(".add");
const changeBodyBgButton = document.querySelector(".change-body-bg");
const section = document.querySelector(".section");

const addModal = document.getElementById("addModal");
const bgModal = document.getElementById("bgModal");
const closeModalButtons = document.querySelectorAll(".close");

const modalAddBtn = document.getElementById("modalAddBtn"); 
const modalValueInput = document.getElementById("modalValue");
const modalNameInput = document.getElementById("modalName");
const modalLinkInput = document.getElementById("modalLink");
const modalTextColorInput = document.getElementById("modalTextColor");

const bgInput = document.getElementById("bgInput");
const bgChangeBtn = document.getElementById("bgChangeBtn");

const notesIcon = document.querySelector(".notes");
const calcIcon = document.querySelector(".calculator");



let draggedCard = null;
let editIndex = null;


const createNoteButton = document.querySelector('.createNote');
const notesContainer = document.querySelector('.notes-container');

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => createNoteElement(note.title, note.content, note.done));
}

function createNoteElement(title = '', content = '', isDone = false) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    const titleElement = document.createElement('input');
    titleElement.placeholder = 'Enter title...';
    titleElement.value = title;
    titleElement.disabled = isDone;

    const contentElement = document.createElement('textarea');
    contentElement.placeholder = 'Enter note content...';
    contentElement.value = content;
    contentElement.disabled = isDone;

    const doneButton = document.createElement('button');
    doneButton.textContent = isDone ? 'Delete' : 'Done';

    doneButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (doneButton.textContent === 'Done') {
            titleElement.disabled = true;
            contentElement.disabled = true;
            doneButton.textContent = 'Delete';
        } else {
            noteDiv.remove();
        }
        saveNotes();
    });

    noteDiv.addEventListener('click', () => {
        if (doneButton.textContent === 'Delete') {
            titleElement.disabled = false;
            contentElement.disabled = false;
            doneButton.textContent = 'Done';
        }
    });

    noteDiv.appendChild(titleElement);
    noteDiv.appendChild(contentElement);
    noteDiv.appendChild(doneButton);
    notesContainer.appendChild(noteDiv);
}

function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(noteDiv => {
        const title = noteDiv.querySelector('input').value;
        const content = noteDiv.querySelector('textarea').value;
        const done = noteDiv.querySelector('button').textContent === 'Delete';
        notes.push({ title, content, done });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

createNoteButton.addEventListener('click', () => createNoteElement());










const display = document.getElementById('calcDisplay');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        // Handle implicit multiplication and evaluate the expression
        let expression = display.value
            .replace(/(\d)\(/g, '$1*(') // 3(3) => 3*(3)
            .replace(/(\))(\d)/g, '$1*$2'); // (3)2 => (3)*2
        const result = eval(expression);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard input functionality
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ('0123456789+-*/()'.includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        event.preventDefault(); // Prevent default action to avoid clearing
        calculate();
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    } else if (key === 'Escape') {
        clearDisplay();
    }
});










notesIcon.addEventListener("click", () => openNotes())
calcIcon.addEventListener("click", () => openCalc())


function openNotes() {
  document.getElementById("notesSidepanel").style.width = "300px";
}

function closeNotes() {
  document.getElementById("notesSidepanel").style.width = "0";
}

function openCalc() {
  document.getElementById("calcSidepanel").style.width = "300px";
}

function closeCalc() {
  document.getElementById("calcSidepanel").style.width = "0";
}

addButton.addEventListener("click", () => {
    addModal.style.display = "flex";
    editIndex = null;
});

changeBodyBgButton.addEventListener("click", () => {
    bgModal.style.display = "flex";
});

closeModalButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        addModal.style.display = "none";
        bgModal.style.display = "none";
        modalValueInput.value = "";
        modalNameInput.value = "";
        modalLinkInput.value = "";
        modalTextColorInput.value = "black";
    });
});

modalAddBtn.addEventListener("click", () => {
    const value = modalValueInput.value;
    const name = modalNameInput.value;
    const link = modalLinkInput.value;
    const textColor = modalTextColorInput.value || "black";

    if (!value || !name || !link) {
        alert("Please fill all the fields.");
        return;
    }

    let type = value.startsWith("http") ? "image" : "color";
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    if (editIndex !== null) {
        bookmarks[editIndex] = { type, value, name, link, textColor };
        saveBookmarks(bookmarks);
        loadBookmarks();
    } else {
        bookmarks.push({ type, value, name, link, textColor });
        saveBookmarks(bookmarks);
        createCard(type, value, name, link, textColor);
    }

    addModal.style.display = "none";
    modalValueInput.value = "";
    modalNameInput.value = "";
    modalLinkInput.value = "";
    modalTextColorInput.value = "black";
    editIndex = null;
});

bgChangeBtn.addEventListener("click", () => {
    const bgValue = bgInput.value;
    if (bgValue.startsWith("http")) {
        document.body.style.backgroundImage = `url(${bgValue})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        localStorage.setItem('bodyBackground', `url(${bgValue})`);
    } else {
        document.body.style.backgroundColor = bgValue;
        localStorage.setItem('bodyBackground', bgValue);
    }
    bgModal.style.display = "none";
    bgInput.value = "";
});

function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function createCard(type, value, name, link, textColor = 'black') {
    const cardLink = document.createElement('a');
    cardLink.target = '_blank';
    cardLink.className = 'card-link';

    const card = document.createElement('div');
    card.className = 'card';

    if (type === 'color') {
        card.style.backgroundColor = value;
    } else if (type === 'image') {
        card.style.backgroundImage = `url(${value})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    }

    const innerDiv = document.createElement('div');
    innerDiv.textContent = name;
    innerDiv.className = "text";
    innerDiv.style.color = textColor;
    card.appendChild(innerDiv);

    const menu = document.createElement('div');
    menu.className = "menu";

    const dots = document.createElement('span');
    dots.className = "dots";
    dots.textContent = "⋮";
    dots.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        menu.classList.toggle('active');
    });

    const editOption = document.createElement('button');
    editOption.textContent = "Edit";
    editOption.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        modalValueInput.value = value;
        modalNameInput.value = name;
        modalLinkInput.value = link;
        modalTextColorInput.value = textColor;
        addModal.style.display = "flex";
        editIndex = Array.from(section.children).indexOf(cardLink);
        menu.classList.remove('active');
    });

    const deleteOption = document.createElement('button');
    deleteOption.textContent = "Delete";
    deleteOption.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const index = Array.from(section.children).indexOf(cardLink);
        bookmarks.splice(index, 1);
        saveBookmarks(bookmarks);
        cardLink.remove();
        menu.classList.remove('active');
    });

    menu.appendChild(editOption);
    menu.appendChild(deleteOption);
    card.appendChild(dots);
    card.appendChild(menu);

    cardLink.appendChild(card);
    cardLink.href = link.startsWith('http') ? link : `https://${link}`;

    // Add drag-and-drop functionality
    cardLink.setAttribute('draggable', true);
    cardLink.addEventListener('dragstart', dragStart);
    cardLink.addEventListener('dragover', dragOver);
    cardLink.addEventListener('drop', drop);

    cardLink.addEventListener('click', (event) => {
        if (menu.classList.contains('active')) {
            event.preventDefault();
        }
    });

    section.appendChild(cardLink);
}

function loadBookmarks() {
    const savedData = localStorage.getItem("bookmarks");
    const bookmarks = savedData ? JSON.parse(savedData) : [];
    section.innerHTML = '';

    bookmarks.forEach(bookmark => {
        createCard(bookmark.type, bookmark.value, bookmark.name, bookmark.link, bookmark.textColor);
    });
}

function dragStart(event) {
    draggedCard = event.currentTarget;
    draggedCard.style.opacity = '0.5'; // Make it slightly transparent
    setTimeout(() => {
        draggedCard.style.display = 'none'; // Hide the card being dragged after the timeout
    }, 0);
}

function dragOver(event) {
    event.preventDefault(); // Allow the drop
    this.classList.add('drop-zone'); // Highlight the drop target
}

function drop(event) {
    event.preventDefault();
    this.classList.remove('drop-zone'); // Remove highlight from drop target

    if (draggedCard !== this) {
        // Move the dragged card before the current card
        section.insertBefore(draggedCard, this.nextSibling);
    }

    // Reset the card display and opacity after dropping
    draggedCard.style.display = 'block';
    draggedCard.style.opacity = '1'; // Reset opacity
}

const bSearchInput = document.querySelector('.search');
bSearchInput.addEventListener('input', () => {
    const searchTerm = bSearchInput.value.toLowerCase();
    const cards = section.querySelectorAll('.card');

    cards.forEach(card => {
        const cardText = card.querySelector('.text').textContent.toLowerCase();
        card.style.display = cardText.includes(searchTerm) ? '' : 'none';
    });
});

// Load body background
function loadBodyBackground() {
    const savedBackground = localStorage.getItem('bodyBackground');
    if (savedBackground) {
        if (savedBackground.startsWith('url(')) {
            document.body.style.backgroundImage = savedBackground;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            document.body.style.backgroundColor = savedBackground;
        }
    }
}

window.onload = () => {
    loadBookmarks();
    loadBodyBackground();
    loadNotes()
    console.log('[{"type":"color","value":"red","name":"Language","link":"https://classroom.google.com/c/NzA1NjMyODU0NjEw","textColor":"white"},{"type":"color","value":"blue","name":"Math","link":"https://classroom.google.com/c/NzA4MDgzNjA3NjY4","textColor":"white"},{"type":"color","value":"orange","name":"French","link":"https://classroom.google.com/c/NzA5Njc4NzU0MzM2","textColor":"white"},{"type":"color","value":"green","name":"Science","link":"https://classroom.google.com/c/NzExODM4MDAwNDQx","textColor":"white"},{"type":"color","value":"purple","name":"Geo/His","link":"https://classroom.google.com/c/NzA5Njk5NjI2MTM0","textColor":"white"},{"type":"color","value":"#CBC3E3","name":"Music","link":"https://classroom.google.com/c/NzEwOTkyMDU5Mjg4","textColor":"white"},{"type":"color","value":"undefined","name":"Art","link":"https://classroom.google.com/c/NzA4NDcwMDcyOTIx","textColor":"white"},{"type":"image","value":"https://static.toiimg.com/thumb/msid-101539021,width-400,resizemode-4/101539021.jpg","name":"Spotify","link":"https://open.spotify.com","textColor":"white"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/17/ee/40/17ee4015-c746-3909-e5ad-5310657469ad/logo_youtube_color-0-0-1x_U007emarketing-0-0-0-6-0-0-0-85-220.png/1200x600wa.png","name":"Youtube","link":"https://youtube.com","textColor":"white"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ea/8e/5e/ea8e5ee2-a398-8177-002b-cfba6d5b87ad/AppIcon-0-0-1x_U007epad-0-2-0-85-220.png/1200x600wa.png","name":"Sora","link":"https://soraapp.com/home","textColor":"white"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bb/e6/32/bbe6320d-e9ab-7f82-3a79-7ef3e9a8c30d/logo_calendar_2020q4_color-0-1x_U007epad-0-0-0-0-0-0-0-85-220-0.png/1200x630wa.png","name":"Calander","link":"https://calendar.google.com/calendar/u/0/r"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e8/0f/36/e80f3656-7a65-0b4f-1d23-3ad3c13396e0/logo_slides_2020q4_color-0-1x_U007emarketing-0-0-0-6-0-0-0-85-220-0.png/1200x630wa.png","name":"GSlides","link":"docs.google.com/presentation","textColor":"black"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/93/23/b2/9323b287-748e-038b-cb92-ab8b78abe9e3/logo_docs_2020q4_color-0-1x_U007emarketing-0-0-0-6-0-0-0-85-220-0.png/1200x630wa.png","name":"GDocs","link":"https://docs.google.com/document"},{"type":"image","value":"data:image/png;base64,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","name":"Duo","link":"https://duolingo.com/leaderboard"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/93/23/b2/9323b287-748e-038b-cb92-ab8b78abe9e3/logo_docs_2020q4_color-0-1x_U007emarketing-0-0-0-6-0-0-0-85-220-0.png/1200x630wa.png","name":"The Giver","link":"https://docs.google.com/document/d/1vySxzK02cwMleGWEGKpTPEFiUkTzPjBcqjT5YXub17A/edit","textColor":"black"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/13/f0/3e/13f03e05-28b7-a302-57bd-7d37c859a7cb/logo_sheets_2020q4_color-0-1x_U007emarketing-0-0-0-6-0-0-0-85-220-0.png/1200x600wa.png","name":"Timetable","link":"https://docs.google.com/spreadsheets/d/1DO3z3UL3GVgR9oS8cGruQtYRAX4Q-0V1OUkL70CHkq0/edit?gid=0#gid=0","textColor":"black"},{"type":"image","value":"https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/92/e4/3c/92e43c1b-0ae3-1fcd-a0db-4eb75f07644a/AppIcon-Desmos-0-0-1x_U007emarketing-0-5-85-220.png/1200x630wa.png","name":"Desmos","link":"https://student.desmos.com/","textColor":"black"}]')
    console.log('url(https://e0.pxfuel.com/wallpapers/1012/134/desktop-wallpaper-minimalist-and-background-of-minimalist.jpg)')
};
