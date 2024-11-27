// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
    // Check if old bookmarks exist and migrate them to preset 1
    if (localStorage.getItem('bookmarks')) {
        const oldBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        localStorage.setItem('bookmarks_preset1', JSON.stringify(oldBookmarks));
        localStorage.removeItem('bookmarks');  // Remove old bookmarks
        console.log("Old bookmarks have been migrated to preset 1.");
    }

    // Set the current preset to 'preset1' by default
    currentPreset = "preset1";

    // Load bookmarks for the current preset (preset1)
    loadBookmarks();
});

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

// Buttons for switching between Presets
const preset1Button = document.querySelector(".preset-1");
const preset2Button = document.querySelector(".preset-2");

let currentPreset = "preset1";  // Default to preset 1

const createNoteButton = document.querySelector('.createNote');
const notesContainer = document.querySelector('.notes-container');

// Load notes from local storage
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
        let expression = display.value
            .replace(/(\d)\(/g, '$1*(') 
            .replace(/(\))(\d)/g, '$1*$2');
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
        event.preventDefault(); 
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
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${currentPreset}`)) || [];

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
    localStorage.setItem(`bookmarks_${currentPreset}`, JSON.stringify(bookmarks));
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
        const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${currentPreset}`)) || [];
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
    const savedData = localStorage.getItem(`bookmarks_${currentPreset}`);
    const bookmarks = savedData ? JSON.parse(savedData) : [];
    section.innerHTML = '';

    bookmarks.forEach(bookmark => {
        createCard(bookmark.type, bookmark.value, bookmark.name, bookmark.link, bookmark.textColor);
    });
}

function dragStart(event) {
    draggedCard = event.currentTarget;
    draggedCard.style.opacity = '0.5'; 
    setTimeout(() => {
        draggedCard.style.display = 'none'; 
    }, 0);
}

function dragOver(event) {
    event.preventDefault(); 
    this.classList.add('drop-zone');
}

function drop(event) {
    event.preventDefault();
    this.classList.remove('drop-zone'); 

    if (draggedCard !== this) {
        section.insertBefore(draggedCard, this.nextSibling);
    }

    draggedCard.style.display = 'block';
    draggedCard.style.opacity = '1'; 
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
    loadNotes();
};

// Preset 1 button - switches to bookmark set 1
preset1Button.addEventListener("click", () => {
    currentPreset = "preset1";
    loadBookmarks();
});

// Preset 2 button - switches to bookmark set 2
preset2Button.addEventListener("click", () => {
    currentPreset = "preset2";
    loadBookmarks();
});

