let gallery = document.querySelector("#gallery");

function getProject() {
    fetch("http://localhost:5678/api/works")
    .then(response => {
        return response.json();
    })
    .then(data => {
        for (let item of data) {
            showProject(item.imageUrl, item.title);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function showProject(imageUrl, title) {
    let item = `
    <figure> 
      <img src="${imageUrl}" alt="${title}">
      <figcaption>${title}</figcaption>
    </figure>`;
    
    gallery.innerHTML += item;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            let categoryButtonsContainer = document.getElementById('categoryButtons');
            
            let allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => filterByCategory('Tous'));
            categoryButtonsContainer.appendChild(allButton);
            
            categories.forEach(category => {
                let button = document.createElement('button');
                button.textContent = category.name;
                button.addEventListener('click', () => filterByCategory(category.name));
                categoryButtonsContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('erreur catégories :', error);
        });
});

function filterByCategory(categoryName) {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            gallery.innerHTML = '';

            let filteredWorks = (categoryName === 'Tous')
                ? works
                : works.filter(work => work.category.name === categoryName);

            if (filteredWorks.length === 0) {
                gallery.innerHTML = 'Aucune données.';
            }

            filteredWorks.forEach(work => {
                showProject(work.imageUrl, work.title);
            });
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
}

getProject();




document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('token')) {
        showModifyButton();
    }
});

function showModifyButton() {
    document.getElementById('btnModify').style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');

    window.location.href = 'index.html';
}

let logoutLink = document.getElementById('logout-link');
if (logoutLink) {
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
}




let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.setAttribute('aria-hidden', 'true');
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function () {
    if (modal === null) return;
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})


// UPLOAD


document.addEventListener('DOMContentLoaded', function() {

    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const imageInput = document.getElementById('imageInput');
        const titleInput = document.getElementById('titleInput');
        const categorySelect = document.getElementById('categorySelect');
        const selectedCategoryId = categorySelect.value;

        const formData = new FormData();
        formData.append('image', imageInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', selectedCategoryId);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData,
        })
        .then(response => response.json())
        .then(newWork => {
            getProject();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du travail:', error);
        });
    });
});