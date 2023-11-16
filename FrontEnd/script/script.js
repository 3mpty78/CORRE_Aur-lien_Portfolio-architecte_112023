import deleteProject from "./deleteProject.js";

// Variables globales
let currentCategory = "Tous";
const filterButtons = document.querySelectorAll(".filters button");
const defaultButton = document.querySelector("button[name='Tous']");
const token = localStorage.getItem("token");
const expirationTime = localStorage.getItem("expirationTime");
const currentTime = new Date().getTime();
const addPhotoModal = document.querySelector(".addPhoto");
const modalGallery = document.querySelector(".modalGallery");
const title = document.querySelector(".managementModal h3");

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

// Fonction pour créer un élément figure de projet
function createProjectFigure(project) {
    const projectFigure = document.createElement("figure");
    projectFigure.className = "item";
    projectFigure.setAttribute("data-category", project.category.name);

    const projectImage = document.createElement("img");
    projectImage.src = project.imageUrl;
    projectImage.alt = `Image de présentation du projet : ${project.title}`;

    const projectTitle = document.createElement("figcaption");
    projectTitle.textContent = project.title;

    projectFigure.appendChild(projectImage);
    projectFigure.appendChild(projectTitle);

    return projectFigure;
}

// Fonction pour mettre à jour l'affichage des projets
function updateProjectsDisplay(
    projects,
    containerSelector,
    addTrashIcon = false
) {
    const projectsContainer = document.querySelector(containerSelector);

    // Vider le contenu actuel du conteneur
    projectsContainer.innerHTML = "";

    projects.forEach((project) => {
        const projectFigure = createProjectFigure(project);

        if (addTrashIcon) {
            const trashIcon = document.createElement("img");
            trashIcon.src = "./assets/icons/trash.svg";
            trashIcon.alt = "icone de suppression";
            trashIcon.className = "trash";

            const trashContainer = document.createElement("div");
            trashContainer.className = "trashContainer";
            trashContainer.setAttribute("data-project-id", project.id);

            trashContainer.addEventListener("click", () =>
                handleDeleteProject(project.id)
            );

            trashContainer.appendChild(trashIcon);
            projectFigure.appendChild(trashContainer);
        }

        projectsContainer.appendChild(projectFigure);
    });
}

// Fonction pour gérer les filtres
function handleFilterButtonClick(event) {
    const selectedButton = event.target;
    currentCategory = selectedButton.getAttribute("name");

    updateFilterButtons(selectedButton);
    filterProjects();
}

// Fonction pour mettre à jour l'apparence des boutons de filtre
function updateFilterButtons(selectedButton) {
    filterButtons.forEach((button) => {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");
}

// Fonction pour filtrer les projets en fonction de la catégorie
function filterProjects() {
    const projects = [...document.querySelectorAll(".gallery .item")];
    projects.forEach((project) => {
        const projectCategory = project.getAttribute("data-category");
        if (currentCategory === "Tous" || currentCategory === projectCategory) {
            project.style.display = "block";
        } else {
            project.style.display = "none";
        }
    });
}

// Fonction principale pour charger et afficher les projets
const listProjects = async () => {
    const projects = await fetchProjects();

    displayProjects(projects);
    updateProjects(projects);
    filterProjects();
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
    const editionBanner = document.querySelector(".edition_banner");
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

// Fonction pour supprimer un projet
async function handleDeleteProject(projectId) {
    const deletionSuccessful = await deleteProject(projectId, token);

    if (deletionSuccessful) {
        const projectElement = document.querySelector(
            `[data-project-id="${projectId}"]`
        );
        if (projectElement) {
            projectElement.remove();
        }
    }
}

// Gestion des événements pour les boutons de filtre
defaultButton.classList.add("active");
filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterButtonClick);
});

// Appel de la fonction principale pour charger les projets
listProjects();
