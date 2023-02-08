function render() {
    if (getLocalStorage() == null) {
        let allNotes = [
            {
                "title": "Welcome to Fancy Notes!",
                "text": "Add Notes by clicking + on the top of this site.",
                "created": "25.01.2023",
                "trashed": false,
                "favorite": true,
            },
            {
                "title": "Did you know?",
                "text": "You can sort your notes by clicking on the buttons on the top of this site. Enjoy!",
                "created": "10.01.2023",
                "trashed": false,
                "favorite": true,
            }
        ];
        setLocalStorage(allNotes);
    }
    loadNotesContainer();
}


function visible(id) {
    document.getElementById(id).classList.remove('d-none');
}


function invisible(id) {
    document.getElementById(id).classList.add('d-none');
}


function clearSearch() {
    document.getElementById('inputSearch').value = "";
    invisible('cancelSearch');
    loadNotesContainer();
}


function setLocalStorage(array) {
    let allNotes = array;
    localStorage.setItem('notes', JSON.stringify(allNotes));
}


function getLocalStorage() {
    let allNotes = JSON.parse(localStorage.getItem('notes'));
    return (allNotes);
}


function loadNotesContainer() {
    document.getElementById('notesContainer').innerHTML = '';
    let allNotes = getLocalStorage();

    for (let i = 0; i < allNotes.length; i++) {
        if (sortDeletedToggle) {
            if (allNotes[i].trashed) { //show all notes in recycle bin
                loadNote(i);
            }
        } else {
            if (allNotes[i].trashed == false) { //show all notes NOT in recycle bin
                loadNote(i);
            }
        }
    }
}


function loadNote(i) {
    let allNotes = getLocalStorage();
    document.getElementById('notesContainer').innerHTML +=
        `
        <div class="noteBox" id="noteBox">
        <div class="noteTitle">${allNotes[i].title}</div>
        <div class="noteText" >${allNotes[i].text}</div>
        <div class="noteActions">
            <div class="noteActionsSub">
                <i onclick="deleteNote('${i}')" class="material-symbols-outlined" id="material-note-delete${i}">delete</i>
                <p class="noteDate">${allNotes[i].created}</p>
                <i onclick="toggleFavorite('${i}')" class="material-symbols-outlined" id="material-note-favorite${i}">favorite</i>
            </div>
        </div>
        </div>
        `;
    styleNoteBtn(i);
}


function styleNoteBtn(i) {
    let allNotes = getLocalStorage();
    let favId = document.getElementById('material-note-favorite' + i);
    let traId = document.getElementById('material-note-delete' + i);
    if (allNotes[i].favorite) {
        favId.style.color = '#ff0000';
    }
    else {
        favId.style.color = '#f5deb3';
    }
    if (allNotes[i].trashed) {
        traId.style.color = '#0000ff';
    }
    else {
        traId.style.color = '#f5deb3';
    }
}


function toggleFavorite(i) {
    let allNotes = getLocalStorage();
    const j = Number(i);
    const favoriteId = 'material-note-favorite' + i;
    if (allNotes[j].favorite == true) {
        allNotes[j].favorite = false;
        document.getElementById(favoriteId).style.color = '#f5deb3';
    } else {
        allNotes[j].favorite = true;
        document.getElementById(favoriteId).style.color = '#ff0000';
    }
    setLocalStorage(allNotes);
}


function saveNote() {
    let allNotes = getLocalStorage();
    const title = document.getElementById('newNoteTitle').value;
    const text = document.getElementById('newNoteText').value;
    const created = date();
    const note = { title: title, text: text, created: created, trashed: false, favorite: false };
    if (title === '' || text === '') {
        alert("I don't like empty notes :(");
    } else {
        allNotes.push(note);
        setLocalStorage(allNotes);
        closeNote();
        loadNote(allNotes.length - 1);
    }
}


function date() {
    const d = new Date();
    return (d.getDate() + '.' + (d.getMonth() + 1).toString().padStart(2, 0) + '.' + d.getFullYear());
}


function openNote() {
    document.getElementById('notesContainer').innerHTML += `
    <div onclick="closeNote()" class="newNoteWrapper" id="newNoteWrapper"></div>
        <div class="newNote" id="newNote">
            <input id="newNoteTitle" placeholder="Enter Title..." type="text">
            <textarea id="newNoteText" placeholder="Enter Notes..." type="text" cols="30" rows="5"></textarea>
            <button onclick="saveNote()" id="newNoteSafeBtn">Save</button>
        </div>
    `;
}


function closeNote() {
    document.getElementById('newNoteTitle').value = '';
    document.getElementById('newNoteText').value = '';
    document.getElementById('newNote').remove();
    document.getElementById('newNoteWrapper').remove();
}


let sortFavoriteToggle = false;
function displayFavorite() {
    if (sortFavoriteToggle) {
        sortFavoriteToggle = false;
        document.getElementById('displayFavoriteIcon').style.color = '#808080';
        loadNotesContainer();
    } else {
        sortFavoriteToggle = true;
        document.getElementById('displayFavoriteIcon').style.color = '#ff0000';
        sortFavorite();
    }
}


function sortFavorite() {
    document.getElementById('notesContainer').innerHTML = '';
    let allNotes = getLocalStorage();
    for (let i = 0; i < allNotes.length; i++) {
        if (!allNotes[i].trashed && allNotes[i].favorite) {
            loadNote(i);
        }
    }
}


function deleteNote(i){
    let allNotes = getLocalStorage();
    const j = Number(i);
    const trashedId = 'material-note-delete' + i;
    if (allNotes[j].trashed == true) {
        allNotes[j].trashed = false;
        document.getElementById(trashedId).style.color = '#808080';
    } else {
        allNotes[j].trashed = true;
        document.getElementById(trashedId).style.color = '#0000ff';
    }
    setLocalStorage(allNotes);
    document.getElementById('notesContainer').innerHTML = '';
    loadNotesContainer();
}


let sortDeletedToggle = false;
function displayDeleted(){
    if (sortDeletedToggle) {
        sortDeletedToggle = false;
        document.getElementById('displayDeletedIcon').style.color = '#808080';
        loadNotesContainer();
    } else {
        sortDeletedToggle = true;
        document.getElementById('displayDeletedIcon').style.color = '#0000ff';
        sortDeleted();
    }
}


function sortDeleted() {
    document.getElementById('notesContainer').innerHTML = '';
    let allNotes = getLocalStorage();
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].trashed) {
            loadNote(i);
        }
    }
}


function clickPress(event) {
    if (event.key == "Enter") {
        const searchtext = document.getElementById('inputSearch').value;
        if (searchtext == '') {
            alert("Please type something in.");
        } else {
            sortSearch(searchtext);
        }
    }
}


function sortSearch(searchtext){
    document.getElementById('notesContainer').innerHTML = '';
    let allNotes = getLocalStorage();
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].title.includes(searchtext) || allNotes[i].text.includes(searchtext)) {
            loadNote(i);
        }
    } 
}