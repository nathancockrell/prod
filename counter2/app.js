// Main app logic for adding and updating data



const entryForm = document.getElementById('entry-form');
const labelForm = document.getElementById('label-form');
const counterForm = document.getElementById('counter-form');

// Save entry and update labels and counters
entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('entry-name').value;
    const value = parseFloat(document.getElementById('entry-value').value);
    let labels = document.getElementById('entry-labels').value.split(',').map(l => l.trim());
    const date = document.getElementById('entry-date').value;
    
    // Automatically add parent labels
    labels.forEach(label => {
      addLabelAncestors(userData.labels, label, labels);
    });
  
    userData.entries.push({ name, value, labels, date });
    
    updateLabelTotals();
    updateCounterTotals();
    updateLocalStorage();
    refreshDashboard();
    entryModal.style.display = 'none';
    entryForm.reset();
  });

labelForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('label-name').value;
  
  const total = userData.entries.filter(entry => entry.labels.includes(name))
    .reduce((acc, entry) => acc + entry.value, 0);
  
  userData.labels.push({ name, total });
  
  updateLocalStorage();
  refreshDashboard();
  labelModal.style.display = 'none';
  labelForm.reset();
});

counterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('counter-name').value;
  const labels = document.getElementById('counter-labels').value.split(',').map(l => l.trim());
  
  const total = userData.entries.filter(entry => entry.name === name)
    .reduce((acc, entry) => acc + entry.value, 0);
  
  userData.counters.push({ name, labels, total });
  
  updateLocalStorage();
  refreshDashboard();
  counterModal.style.display = 'none';
  counterForm.reset();
});

function updateLabelTotals() {
  userData.labels.forEach(label => {
    label.total = userData.entries
      .filter(entry => entry.labels.includes(label.name))
      .reduce((acc, entry) => acc + entry.value, 0);
  });
}

function updateCounterTotals() {
  userData.counters.forEach(counter => {
    counter.total = userData.entries
      .filter(entry => entry.name === counter.name)
      .reduce((acc, entry) => acc + entry.value, 0);
  });
}

// Edit functionality can be handled similarly
// Edit entry modal functionality
function openEditEntryModal(index) {
    const entry = userData.entries[index];
    
    document.getElementById('edit-entry-name').value = entry.name;
    document.getElementById('edit-entry-value').value = entry.value;
    document.getElementById('edit-entry-labels').value = entry.labels.join(', ');
    document.getElementById('edit-entry-date').value = entry.date;
    
    editEntryModal.style.display = 'block';
    
    document.getElementById('edit-entry-form').onsubmit = function (e) {
      e.preventDefault();
      entry.name = document.getElementById('edit-entry-name').value;
      entry.value = parseFloat(document.getElementById('edit-entry-value').value);
      entry.labels = document.getElementById('edit-entry-labels').value.split(',').map(l => l.trim());
      entry.date = document.getElementById('edit-entry-date').value;
      
      updateLabelTotals();
      updateCounterTotals();
      updateLocalStorage();
      refreshDashboard();
      editEntryModal.style.display = 'none';
    };
  }
  
  // Edit label modal functionality
  function openEditLabelModal(labelObj) {
    // Use the helper function to find the label, no matter if it's nested or not
    const labelName = labelObj.name;
    const label = findLabelByName(userData.labels, labelName);
  
    if (!label) {
      console.error("Label not found:", labelName);
      return;
    }
  
    // Populate the modal fields with the current data of the label
    document.getElementById('edit-label-name').value = label.name;
  
    // Populate the parent dropdown with existing labels
    const parentDropdown = document.getElementById('edit-label-parent');
    parentDropdown.innerHTML = '<option value="">None</option>'; // Default option for no parent
    populateParentDropdown(userData.labels, parentDropdown, label);
  
    editLabelModal.style.display = 'block';
  
    // Handle the submission of the edit form
    document.getElementById('edit-label-form').onsubmit = function (e) {
      e.preventDefault();
      
      const newName = document.getElementById('edit-label-name').value;
      const parentName = parentDropdown.value;
  
      // Update the label name
      label.name = newName;
  
      // Move the label if necessary
      moveLabelToParent(label, parentName);
  
      updateLabelTotals();
      updateLocalStorage();
      refreshDashboard();
  
      editLabelModal.style.display = 'none';
    };
  }
  
  
  // Edit counter modal functionality
  function openEditCounterModal(index) {
    const counter = userData.counters[index];
    
    document.getElementById('edit-counter-name').value = counter.name;
    document.getElementById('edit-counter-labels').value = counter.labels.join(', ');
    
    editCounterModal.style.display = 'block';
    
    document.getElementById('edit-counter-form').onsubmit = function (e) {
      e.preventDefault();
      counter.name = document.getElementById('edit-counter-name').value;
      counter.labels = document.getElementById('edit-counter-labels').value.split(',').map(l => l.trim());
      
      updateCounterTotals();
      updateLocalStorage();
      refreshDashboard();
      editCounterModal.style.display = 'none';
    };
  }
  
  function populateParentDropdown(labels, dropdown, currentLabel) {
    labels.forEach(label => {
      // Prevent selecting the label itself as its parent
      if (label !== currentLabel) {
        const option = document.createElement('option');
        option.value = label.name;
        option.textContent = label.name;
        dropdown.appendChild(option);
      }
  
      if (label.children && label.children.length > 0) {
        populateParentDropdown(label.children, dropdown, currentLabel);
      }
    });
  }
  
  
  function moveLabelToParent(label, parentName) {
    // Remove the label from its current parent
    removeLabelFromParent(userData.labels, label);
  
    if (parentName) {
      // Find the new parent label by name
      const parent = findLabelByName(userData.labels, parentName);
      if (parent) {
        parent.children.push(label);
      }
    } else {
      // If no parent, move the label back to the root level
      userData.labels.push(label);
    }
  }
  
  function removeLabelFromParent(labels, label) {
    for (let i = 0; i < labels.length; i++) {
      const currentLabel = labels[i];
  
      if (currentLabel.children && currentLabel.children.includes(label)) {
        currentLabel.children = currentLabel.children.filter(child => child !== label);
        return;
      }
  
      if (currentLabel.children && currentLabel.children.length > 0) {
        removeLabelFromParent(currentLabel.children, label);
      }
    }
  }
  

  function addLabelAncestors(labels, labelName, entryLabels) {
    labels.forEach(label => {
      if (label.name === labelName) {
        // Add the label to the entry if it's not already there
        if (!entryLabels.includes(label.name)) {
          entryLabels.push(label.name);
        }
  
        // Recursively add parent labels
        labels.forEach(parentLabel => {
          if (parentLabel.children && parentLabel.children.includes(label)) {
            addLabelAncestors(labels, parentLabel.name, entryLabels);
          }
        });
      }
  
      if (label.children && label.children.length > 0) {
        addLabelAncestors(label.children, labelName, entryLabels);
      }
    });
  }
  

  // Recursively find the label by name
function findLabelByName(labels, name) {
    for (let i = 0; i < labels.length; i++) {
        console.log("shdus",labels[i].name)
      if (labels[i].name === name) {
        return labels[i];
      }
  
      if (labels[i].children && labels[i].children.length > 0) {
        const found = findLabelByName(labels[i].children, name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  