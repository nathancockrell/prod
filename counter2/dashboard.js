// Refresh the dashboard

const entryList = document.getElementById('entry-list');
const labelList = document.getElementById('label-list');
const counterList = document.getElementById('counter-list');




function refreshDashboard() {
    entryList.innerHTML = '';
    userData.entries.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `${entry.name} - ${entry.value} - [${entry.labels.join(', ')}] - ${entry.date}`;
      
      const editButton = document.createElement('button');
      editButton.classList.add("edit-btn")
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => openEditEntryModal(index));
      li.appendChild(editButton);
      
      entryList.appendChild(li);
    });
  
    labelList.innerHTML = '';
    displayLabels(userData.labels, labelList);
  
    counterList.innerHTML = '';
    userData.counters.forEach((counter, index) => {
      const li = document.createElement('li');
      li.textContent = `${counter.name} - Total: ${counter.total} - [${counter.labels.join(', ')}]`;
      
      const editButton = document.createElement('button');
      editButton.classList.add("edit-btn")

      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => openEditCounterModal(index));
      li.appendChild(editButton);
      
      counterList.appendChild(li);
    });
  }

  function displayLabels(labels, parentElement) {
    labels.forEach(label => {
      const li = document.createElement('li');
      li.textContent = `${label.name} - Total: ${label.total}`;
      
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => openEditLabelModal(label));
      li.appendChild(editButton);
  
      parentElement.appendChild(li);
  
      // Recursively display child labels if any
      if (label.children && label.children.length > 0) {
        const ul = document.createElement('ul');
        li.appendChild(ul);
        displayLabels(label.children, ul);
      }
    });
  }
  
  

// Initial dashboard load
refreshDashboard();
