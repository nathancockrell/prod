// Load saved data from localStorage when the page loads
window.onload = () => {
    labels = JSON.parse(localStorage.getItem('labels')) || [];
    entries = JSON.parse(localStorage.getItem('entries')) || [];
    updateLabelsDisplay();
    updateEntriesDisplay();
};

// Save data to localStorage whenever there's a change
function saveToLocalStorage() {
    localStorage.setItem('labels', JSON.stringify(labels));
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Function to calculate the total for each label based on its children's values
function calculateLabelTotals() {
    labels.forEach(label => {
        label.total = label.children.reduce((sum, childName) => {
            const childEntry = entries.find(entry => entry.name === childName);
            return childEntry ? sum + childEntry.value : sum;
        }, 0);
    });
}

document.getElementById('addLabelButton').addEventListener('click', () => {
    const labelName = prompt('Enter label name:');
    if (labelName) {
        let label = {
            name: labelName,
            total: 0,
            history: [],
            children: []
        };
        labels.push(label);
        calculateLabelTotals();
        updateLabelsDisplay();
        saveToLocalStorage();
    }
});

document.getElementById('addEntryButton').addEventListener('click', () => {
    const entryName = prompt('Enter entry name:');
    const color = prompt('Enter entry color (e.g., #ff0000):');
    if (entryName) {
        let entry = {
            name: entryName,
            labels: [],
            value: 0,
            history: [],
            color: color || '#ffffff'
        };
        entries.push(entry);
        updateEntriesDisplay();
        saveToLocalStorage();
    }
});

function updateLabelsDisplay() {
    calculateLabelTotals(); // Ensure the totals are up-to-date
    const labelsDisplay = document.getElementById('labelsDisplay');
    labelsDisplay.innerHTML = '';
    labels.forEach(label => {
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('label-div');
        labelDiv.innerHTML = `<h3>${label.name}</h3>Total: ${label.total}`;
        labelsDisplay.appendChild(labelDiv);
    });
}

function updateEntriesDisplay() {
    const entriesDisplay = document.getElementById('entriesDisplay');
    entriesDisplay.innerHTML = '';
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry-div');
        entryDiv.style.backgroundColor = entry.color;
        entryDiv.innerHTML = `
            <h3>${entry.name}</h3>
            Value: ${entry.value}<br>
            Labels: ${entry.labels.map(label => label.name).join(', ')}<br>
            <button onclick="increaseEntryValue('${entry.name}')">Increase Value</button>
            <button onclick="addEntryLabel('${entry.name}')">Add Label</button>
            <button onclick="removeEntryLabel('${entry.name}')">Remove Label</button>
        `;
        entriesDisplay.appendChild(entryDiv);
    });
}

function increaseEntryValue(entryName) {
    const entry = entries.find(e => e.name === entryName);
    if (entry) {
        entry.value++;
        entry.history.push({ date: new Date(), action: 'Value increased' });
        entry.labels.forEach(label => {
            label.history.push({ date: new Date(), action: `Entry ${entry.name} value increased` });
        });
        updateEntriesDisplay();
        updateLabelsDisplay();
        saveToLocalStorage();
    }
}

function addEntryLabel(entryName) {
    const entry = entries.find(e => e.name === entryName);
    const labelName = prompt('Enter label name to add:');
    const label = labels.find(l => l.name === labelName);
    if (entry && label && !entry.labels.includes(label)) {
        entry.labels.push(label);
        label.children.push(entry.name);
        entry.history.push({ date: new Date(), action: `Label ${label.name} added` });
        label.history.push({ date: new Date(), action: `Entry ${entry.name} added` });
        updateEntriesDisplay();
        updateLabelsDisplay();
        saveToLocalStorage();
    }
}

function removeEntryLabel(entryName) {
    const entry = entries.find(e => e.name === entryName);
    const labelName = prompt('Enter label name to remove:');
    const label = labels.find(l => l.name === labelName);
    if (entry && label) {
        entry.labels = entry.labels.filter(l => l.name !== labelName);
        label.children = label.children.filter(child => child !== entry.name);
        entry.history.push({ date: new Date(), action: `Label ${label.name} removed` });
        label.history.push({ date: new Date(), action: `Entry ${entry.name} removed` });
        updateEntriesDisplay();
        updateLabelsDisplay();
        saveToLocalStorage();
    }
}
