document.addEventListener('DOMContentLoaded', function() {
  const subjects = JSON.parse(localStorage.getItem('subjects')) || {};
  const subjectSelect = document.getElementById('subjectSelect');
  const newSubjectInput = document.getElementById('newSubjectInput');
  const newArticleInput = document.getElementById('newArticleInput');
  const addSubjectButton = document.getElementById('addSubject');
  const addArticleButton = document.getElementById('addArticle');
  const subjectsContainer = document.getElementById('subjects');
  const articlesContainer = document.getElementById('articles');

  function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }

  function displaySubjects() {
    subjectsContainer.innerHTML = '';
    subjectSelect.innerHTML = '';
    for (const subjectName in subjects) {
      const subjectDiv = document.createElement('div');
      subjectDiv.className = 'subject';
      subjectDiv.innerHTML = `<span class="title">${subjectName}</span>`;
      
      const deleteButton = document.createElement('span');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
        delete subjects[subjectName];
        saveSubjects();
        displaySubjects();
        if (subjectSelect.value === subjectName) {
          articlesContainer.innerHTML = '';
        }
      };

      subjectDiv.appendChild(deleteButton);
      subjectsContainer.appendChild(subjectDiv);

      const option = document.createElement('option');
      option.value = subjectName;
      option.textContent = subjectName;
      subjectSelect.appendChild(option);
    }
  }

  function displayArticles(subjectName) {
    articlesContainer.innerHTML = '';
    const articles = subjects[subjectName] || [];
    articles.forEach(article => {
      const articleDiv = document.createElement('div');
      articleDiv.className = 'article';

      if (article.read === 1) {
        articleDiv.classList.add('read');
      } else if (article.read === 2) {
        articleDiv.classList.add('unread');
      }

      const articleLink = document.createElement('a');
      articleLink.href = article.url;
      articleLink.textContent = article.url;
      articleLink.target = '_blank'; // Open link in a new tab

      const toggleReadButton = document.createElement('button');
      toggleReadButton.className = 'toggle-read-button';
      toggleReadButton.textContent = article.read === 1 ? 'Unread' : 'Read';
      toggleReadButton.onclick = function() {
        article.read = article.read === 1 ? 2 : 1;
        saveSubjects();
        displayArticles(subjectName);
      };

      const deleteButton = document.createElement('span');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
        subjects[subjectName] = subjects[subjectName].filter(a => a.url !== article.url);
        saveSubjects();
        displayArticles(subjectName);
      };

      articleDiv.appendChild(articleLink);
      articleDiv.appendChild(toggleReadButton);
      articleDiv.appendChild(deleteButton);
      articlesContainer.appendChild(articleDiv);
    });
  }
  addSubjectButton.onclick = function() {
    const newSubject = newSubjectInput.value.trim();
    if (newSubject && !subjects[newSubject]) {
      subjects[newSubject] = [];
      newSubjectInput.value = '';
      saveSubjects();
      displaySubjects();
    }
  };

  addArticleButton.onclick = function() {
    const selectedSubject = subjectSelect.value;
    const newArticle = newArticleInput.value.trim();
    if (selectedSubject && newArticle) {
      subjects[selectedSubject].push({ url: newArticle, read: 0 });
      newArticleInput.value = '';
      saveSubjects();
      displayArticles(selectedSubject);
    }
  };

  subjectSelect.onchange = function() {
    const selectedSubject = subjectSelect.value;
    displayArticles(selectedSubject);
  };

  displaySubjects();
  if (subjectSelect.value) {
    displayArticles(subjectSelect.value);
  }
});
