let gallery = document.querySelector("#gallery");
let gallery2 = document.querySelector("#gallery2");

function getProject() {
    fetch("http://localhost:5678/api/works")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        project = data;
        gallery.innerHTML = ''
        gallery2.innerHTML = ''
        for (let item of data) {
          showProject(item.imageUrl, item.title);
          showProject2(item.id, item.imageUrl, item.title);
        }
      })
      .catch((error) => {
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


// Affichage mode connecté


document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('token')) {
        let loginLink = document.getElementById('login-link');
        loginLink.textContent = 'logout';
        loginLink.href = 'javascript:logout();';
        showModifyButton();
        ShowEditMode();
        ShowFilters();
    }
});

function showModifyButton() {
    document.getElementById('btnModify2').style.display = 'block';
}

function ShowFilters() {
    document.getElementById('categoryButtons').style.display = 'none';
}

function ShowEditMode() {
    document.getElementById('editMode').style.display = 'flex';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}


// MODAL


let modal = null

const openModal = function (e, targetSelector = null) {
    e.preventDefault();
    const target = document.querySelector(targetSelector || e.target.getAttribute('href'));
    target.style.display = null;
    target.setAttribute('aria-hidden', 'true');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

document.getElementById('openModal2').addEventListener('click', function (e) {
    closeModal();
    openModal(e, "#modal1");
});

document.querySelector('.js-modal-back').addEventListener('click', function (e) {
    closeModal();
    openModal(e, "#modal2");
});

const closeModal = function () {
    if (modal === null) return;
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
    titleInput.value = '';
    imageInput.value = '';
    uploadedImage.src = '';
    categorySelect.value = '';
    fileInputButton.style.display = 'block';
    fileInputText.style.display = 'block';
    filePicture.style.display = 'block';
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
    const imageInput = document.getElementById('imageInput');
    const titleInput = document.getElementById('titleInput');
    const categorySelect = document.getElementById('categorySelect');
    const uploadedImage = document.getElementById('uploadedImage');
    const fileInputButton = document.getElementById('fileInputButton');
    const fileInputText = document.getElementById('fileInputText');
    const filePicture = document.getElementById('filePicture');

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
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
        .then(response => {
            if(response.status === 201) {
                return response.json();
            } else {
                throw new Error('Erreur lors de la création');
            }
        })
        .then(newWork => {
            getProject();
            closeModal();
            openModal(event, "#modal2");
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du travail:', error);
        });
    });

    imageInput.addEventListener('change', function () {
        if (imageInput.files && imageInput.files[0]) {
            const imageURL = URL.createObjectURL(imageInput.files[0]);
            uploadedImage.src = imageURL;
            fileInputButton.style.display = 'none';
            fileInputText.style.display = 'none';
            filePicture.style.display = 'none';
        }
    });
});


// SUPPRESSION

function showProject2(id, imageUrl, title) {
    let figure = document.createElement("figure");

    let img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;

    let deleteImage = document.createElement("img");
    deleteImage.className = "delete-button";
    deleteImage.dataset.id = id;
    deleteImage.src = "assets/icons/picture2.png";
    deleteImage.alt = "Supprimer";

    figure.appendChild(img);
    figure.appendChild(deleteImage);

    document.getElementById("gallery2").appendChild(figure);
}

gallery2.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        let id = event.target.getAttribute("data-id");
        deleteProject(id);
    }
});
  
  function deleteProject(id) {

    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
    .then((response) => {
        console.log(response.status)
        if (response.ok) {
            console.log('Suppression réussie');
            getProject();
        } else {
            console.error("Erreur lors de la suppression du projet");
        }
    })
    .catch((error) => {
        console.error('Erreur lors de la suppression du projet');
        console.error(error);
    });
}