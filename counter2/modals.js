// Edit modal elements

// Assuming you have modal elements and button IDs like below
const addEntryButton = document.getElementById('add-entry-btn');
const addLabelButton = document.getElementById('add-label-btn');
const addCounterButton = document.getElementById('add-counter-btn');
const entryModal=document.getElementById("entry-modal")
const counterModal=document.getElementById("counter-modal")
const labelModal=document.getElementById("label-modal")

// Add Entry Button Listener
addEntryButton.addEventListener('click', function() {
  // Open the Add Entry Modal
  entryModal.style.display = 'block';
});

// Add Label Button Listener
addLabelButton.addEventListener('click', function() {
  // Open the Add Label Modal
  labelModal.style.display = 'block';
});

// Add Counter Button Listener
addCounterButton.addEventListener('click', function() {
  // Open the Add Counter Modal
  counterModal.style.display = 'block';
});

// Ensure modals are reset/closed correctly
document.getElementById('entry-close').addEventListener('click', function() {
  entryModal.style.display = 'none';
});

document.getElementById('label-close').addEventListener('click', function() {
  labelModal.style.display = 'none';
});

document.getElementById('counter-close').addEventListener('click', function() {
  counterModal.style.display = 'none';
});

const editEntryModal = document.getElementById('edit-entry-modal');
const editLabelModal = document.getElementById('edit-label-modal');
const editCounterModal = document.getElementById('edit-counter-modal');

// Close buttons for edit modals
document.getElementById('edit-entry-close').addEventListener('click', () => {
  editEntryModal.style.display = 'none';
});

document.getElementById('edit-label-close').addEventListener('click', () => {
  editLabelModal.style.display = 'none';
});

document.getElementById('edit-counter-close').addEventListener('click', () => {
  editCounterModal.style.display = 'none';
});

window.onclick = function (event) {
  if (event.target == editEntryModal) {
    editEntryModal.style.display = 'none';
  }
  if (event.target == editLabelModal) {
    editLabelModal.style.display = 'none';
  }
  if (event.target == editCounterModal) {
    editCounterModal.style.display = 'none';
  }
};
