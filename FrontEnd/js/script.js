let gallery = document.querySelector("#gallery");
let gallery2 = document.querySelector("#gallery2");

// Fonction pour récupérer les projets depuis l'API
function getProject() {
    fetch("http://localhost:5678/api/works")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Stockage des données des projets dans la variable 'project'
            project = data;
            // Efface le contenu précédent des galeries
            gallery.innerHTML = '';
            gallery2.innerHTML = '';
            // Boucle à travers les données des projets
            for (let item of data) {
                // Affiche le projet dans la galerie
                showProject(item.imageUrl, item.title);
                // Affiche le projet dans la deuxième galerie
                showProject2(item.id, item.imageUrl, item.title);
            }
        })
        .catch((error) => {
            // Gère les erreurs en affichant un message dans la console
            console.log(error);
        });
}

// Fonction pour afficher un projet dans la galerie
function showProject(imageUrl, title) {
    let item = `
    <figure> 
      <img src="${imageUrl}" alt="${title}">
      <figcaption>${title}</figcaption>
    </figure>`;
    
    gallery.innerHTML += item;
}

// Catégories

// Attente du DOM
document.addEventListener("DOMContentLoaded", () => {

    fetch('http://localhost:5678/api/categories')
        // Convertit la réponse en JSON
        .then(response => response.json())
        .then(categories => {
            // Récupère le conteneur des boutons de catégorie
            let categoryButtonsContainer = document.getElementById('categoryButtons');
            
            // Crée un bouton 'Tous' et ajoute un gestionnaire d'événement pour filtrer toutes les catégories
            let allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => filterByCategory('Tous'));
            categoryButtonsContainer.appendChild(allButton);
            
            // Boucle à travers les catégories récupérées depuis l'API
            categories.forEach(category => {
                // Crée un bouton pour chaque catégorie et ajoute un gestionnaire d'événement pour filtrer par catégorie
                let button = document.createElement('button');
                button.textContent = category.name;
                button.addEventListener('click', () => filterByCategory(category.name));
                categoryButtonsContainer.appendChild(button);
            });
        })
        // Gère les erreurs en affichant un message dans la console
        .catch(error => {
            console.error('erreur catégories :', error);
        });
});

// Fonction pour filtrer les œuvres par catégorie
function filterByCategory(categoryName) {
    // Envoie une requête pour récupérer la liste des œuvres depuis une API
    fetch('http://localhost:5678/api/works')
        // Convertit la réponse en JSON
        .then(response => response.json())
        .then(works => {
            // Efface le contenu précédent de la galerie
            gallery.innerHTML = '';

            // Filtrer les œuvres en fonction de la catégorie sélectionnée
            let filteredWorks = (categoryName === 'Tous')
                ? works
                : works.filter(work => work.category.name === categoryName);

            // Si aucune œuvre ne correspond à la catégorie sélectionnée, afficher un message
            if (filteredWorks.length === 0) {
                gallery.innerHTML = 'Aucune données.';
            }

            // Affiche les œuvres filtrées dans la galerie
            filteredWorks.forEach(work => {
                showProject(work.imageUrl, work.title);
            });
        })
        // Gère les erreurs en affichant un message dans la console
        .catch(error => {
            console.error('Erreur :', error);
        });
}

getProject();

// Déconnexion utilisateur via suppression du token

function logout() { 
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Affichage mode connecté


document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('token')) { // Vérification du token dans le LocalStorage
        let loginLink = document.getElementById('login-link');
        loginLink.textContent = 'logout'; // Ici on change le texte du login en logout
        loginLink.href = 'javascript:logout();'; // Ici on fait appel à la fonction logout en changeant le lien du login vers la fonction js logout
        showModifyButton();
        ShowEditMode();
        ShowFilters();
    }
});

 // Fonctions qui permettent de modifier certain élements 
function showModifyButton() {
    document.getElementById('btnModify2').style.display = 'block';
}

function ShowFilters() {
    document.getElementById('categoryButtons').style.display = 'none';
}

function ShowEditMode() {
    document.getElementById('editMode').style.display = 'flex';
}


// UPLOAD


// DOM
document.addEventListener('DOMContentLoaded', function() {
    // Récupère les éléments HTML nécessaires du DOM
    const uploadForm = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const titleInput = document.getElementById('titleInput');
    const categorySelect = document.getElementById('categorySelect');
    const uploadedImage = document.getElementById('uploadedImage');
    const fileInputButton = document.getElementById('fileInputButton');
    const fileInputText = document.getElementById('fileInputText');
    const filePicture = document.getElementById('filePicture');

    // Ajoute un gestionnaire d'événement au formulaire de téléchargement
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire par défaut
        const selectedCategoryId = categorySelect.value;
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', selectedCategoryId);

        // Envoie une requête POST à l'API pour ajouter un travail
        fetch('http://localhost:5678/api/works', { 
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Verification du token
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
            getProject(); // Appelle la fonction getProject() pour actualiser la galerie 
            closeModal(); // Ferme la modal après ajout
            openModal(event, "#modal2"); // Ouvre la modal2 après ajout
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du travail:', error);
        });
    });

    // Ajoute un gestionnaire d'événement au champ de sélection de fichiers
    imageInput.addEventListener('change', function () {
        if (imageInput.files && imageInput.files[0]) {
            // Affiche l'image sélectionnée dans l'élément 'uploadedImage'
            let imageURL = URL.createObjectURL(imageInput.files[0]);
            uploadedImage.src = imageURL;
            // Masque certains éléments du formulaire pour afficher l'image sélectionnée
            fileInputButton.style.display = 'none';
            fileInputText.style.display = 'none';
            filePicture.style.display = 'none';
        }
    });
});

// Changer la couleur du bouton upload si tout les élements sont remplies 

const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("categorySelect");
const imageInput = document.getElementById("imageInput");
const submitForm = document.getElementById("sumbitForm");

// Fonction pour vérifier si tous les champs sont remplis
function checkForm() {
    if (titleInput.value.trim() !== "" && categorySelect.value !== "" && imageInput.files.length > 0) {
        submitForm.style.backgroundColor = "#1D6154"; // Change la couleur du bouton en vert
    } else {
        submitForm.style.backgroundColor = "#A7A7A7"; // Change la couleur du bouton en gris
    }
}

// Écoutez les événements
titleInput.addEventListener("input", checkForm);
categorySelect.addEventListener("change", checkForm);
imageInput.addEventListener("change", checkForm);

// Appel de la fonction pour vérifier la bonne couleur
checkForm();


// SUPPRESSION

function showProject2(id, imageUrl, title) {
    // Crée un élément 'figure' pour afficher le projet
    let figure = document.createElement("figure");

    // Crée un élément pour afficher l'image du projet
    let img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;

    // Crée un bouton de suppression
    let deleteImage = document.createElement("img");
    deleteImage.className = "delete-button";
    deleteImage.dataset.id = id;
    deleteImage.src = "assets/icons/picture2.png";
    deleteImage.alt = "Supprimer";

    // Ajoute l'image du projet et le bouton de suppression à la figure
    figure.appendChild(img);
    figure.appendChild(deleteImage);

    // Ajoute la figure à la galerie
    document.getElementById("gallery2").appendChild(figure);
}

// Ajoute un gestionnaire d'événement aux bouttons delete
gallery2.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        // Récupération de l'id de l'image
        let id = event.target.getAttribute("data-id");
        // Appelle la fonction deleteProject()
        deleteProject(id);
    }
});

// Fonction de suppression
function deleteProject(id) {
    // Envoie une requête DELETE à l'API pour supprimer le projet via son ID
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Vérification du token 
        },
    })
    .then((response) => {
        console.log(response.status);
        if (response.ok) {
            console.log('Suppression réussie');
            // Appelle la fonction getProject() pour actualiser
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

// Boutton upload
document.getElementById('openModal2').addEventListener('click', function (e) {
    closeModal();
    openModal(e, "#modal1");
});

// Boutton retour
document.querySelector('.js-modal-back').addEventListener('click', function (e) {
    closeModal();
    openModal(e, "#modal2");
});

// Fonction close Modal
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

// Fonction pour ouvrir la modal au clic du boutton
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

// Fermer la modal en appuyant sur echap
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})
