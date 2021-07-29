let googleUserId;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item"
                        onclick="deleteNote('${noteId}')">
                            Delete
                        </a>
                    </footer>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item"
                        onclick="editNote('${noteId}')">
                            Edit
                        </a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
};

const editNote = (noteId) => {
    const editNoteModal = document.querySelector('#editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const noteDetails = data[noteId];
        document.querySelector('#editNoteId').value = noteId;
        document.querySelector('#editTitleInput').value = noteDetails.title;
        document.querySelector('#editTextInput').value = noteDetails.text;
    });
    editNoteModal.classList.toggle('is-active');
};

const closeEditModal = () => {
    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.remove('is-active');
}; 

const saveEditModal = (noteId) => {
    console.log("Save changes");
    const editNoteTitleInput = document.querySelector("#editTileInput");
    const editNoteTextInput = document.querySelector("#editTextInput");
    const editNoteIdInput = documeent.querySelector("editNoteId");

    const title = editNoteTitleInput.value;
    const text = editNoteTextInput.value;
    const noteIde = editNoteIdInput.value;

    firebase.database().ref(`users/${googleUserId}/${noteId}`).update({
        title: title,
        text: text,        
    });
    
    closeEditModal();
};

 