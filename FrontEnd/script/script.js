import createProjectFigure from "./UI/createProjectFigure.js";
import updateProjectsDisplay from "./UI/updateProjectDisplay.js";
import buttons from "./UI/buttons.js";

// Variables globales
const filterButtons = document.querySelectorAll(".filters button");
const defaultButton = document.querySelector("button[name='Tous']");
const token = localStorage.getItem("token");
const expirationTime = localStorage.getItem("expirationTime");
const currentTime = new Date().getTime();
const addPhotoModal = document.querySelector(".addPhoto");
const modalGallery = document.querySelector(".modalGallery");
const title = document.querySelector(".managementModal h3");
const editionBanner = document.querySelector(".edition_banner");

// Fonction pour effectuer le fetch des projets
const fetchProjects = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Fonction principale pour charger et afficher les projets
const listProjects = async () => {
    const projects = await fetchProjects();

    displayProjects(projects);
    updateProjects(projects);
    buttons.filterProjects();
};

// Fonction pour afficher les projets
function displayProjects(projects) {
    const projectsContainer = document.querySelector(".gallery");

    projects.forEach((project) => {
        const projectFigure = createProjectFigure(project);
        projectsContainer.appendChild(projectFigure);
    });
}

// Fonction pour mettre à jour l'affichage des projets connectés
function updateProjects(projects) {
    if (token && expirationTime && currentTime <= parseInt(expirationTime)) {
        updateProjectsDisplay(projects, ".modalGallery", true);
        createLoggedLayout();
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        loginLink.textContent = "login";
        editionBanner.classList.remove("visible");
    }
}

// Fonction pour créer le layout si connecté
function createLoggedLayout() {
    editionBanner.classList.add("visible");

    const loginLink = document.getElementById("loginLink");
    loginLink.textContent = "logout";

    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        loginLink.textContent = "login";
        console.log(token);
    });

    const filterContainer = document.querySelector(".filters");
    filterContainer.style.visibility = "hidden";

    const portfolioTitle = document.querySelector("#portfolio h2");

    const modificationIcon = document.createElement("img");
    const modificationLink = document.createElement("a");

    modificationIcon.src = "./assets/icons/update.png";
    modificationLink.setAttribute("href", "#");
    modificationLink.className = "modifier";
    modificationLink.textContent = "Modifier";

    modificationLink.appendChild(modificationIcon);
    portfolioTitle.appendChild(modificationLink);

    modificationLink.addEventListener("click", () => {
        const managementModal = document.querySelector(".overlay");
        managementModal.classList.add("visible");
    });

    const crossIcon = document.querySelector(".crossIcon");
    const goBack = document.querySelector(".goBack");

    crossIcon.addEventListener("click", () => {
        const managementModal = document.querySelector(".overlay");
        managementModal.classList.remove("visible");
    });

    goBack.style.display = "none";

    // Changement de modal
    function updateModalDisplay() {
        // Sélection de la nouvelle modale
        addPhotoModal.classList.add("displayed");
        // Masque la modale précédente
        modalGallery.style.display = "none";
        // Changer le texte du titre
        title.textContent = "Ajout photo";
        // Affiche l'icone de retour arrière
        goBack.style.display = "block";
        goBack.addEventListener("click", () => {
            addPhotoModal.classList.remove("displayed");
            modalGallery.style.display = "grid";
            addPhotoBtn.textContent = "Ajouter une photo";
            addPhotoBtn.toggleAttribute("disabled", false);
            goBack.style.display = "none";
        });

        // Nouveau style du bouton
        addPhotoBtn.textContent = "Valider";
        addPhotoBtn.setAttribute(`disabled`, true);
    }
    const addPhotoBtn = document.querySelector("button[name='ajouter']");
    addPhotoBtn.addEventListener("click", updateModalDisplay);
}

// Gestion des événements pour les boutons de filtre
defaultButton.classList.add("active");
filterButtons.forEach((button) => {
    button.addEventListener("click", buttons.handleFilterButtonClick);
});

// Appel de la fonction principale pour charger les projets
listProjects();
