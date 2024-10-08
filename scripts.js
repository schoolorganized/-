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

let draggedCard = null;
let editIndex = null;

const searchButton = document.querySelector('.searchGoogleBtn');
const searchInput = document.querySelector('.google');

searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim();
    
    if (query) {
        if (query.startsWith('http://') || query.startsWith('https://')) {
            window.location.href = query;
        } else {
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(googleSearchUrl, '_blank');
        }
    } else {
        alert('Please enter a search term or URL.');
    }
});

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

// Drag-and-drop functions
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

// Search functionality
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
};
