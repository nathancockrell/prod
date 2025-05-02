// Manage localStorage operations

let userData = JSON.parse(localStorage.getItem('userData')) || {
    entries: [],
    labels: [],
    counters: [],
  };
  
  function updateLocalStorage() {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  function loadUserData() {
    userData = JSON.parse(localStorage.getItem('userData')) || {
      entries: [],
      labels: [],
      counters: [],
    };
  }
  