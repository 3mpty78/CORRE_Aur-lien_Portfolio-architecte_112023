// Création du fetch pour récupérer les projets
const listProjects = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projects = await response.json();

        // Appel de la fonction pour afficher les projets apres fetch
        displayProjects(projects);
        updateProjects(projects);
    } catch (error) {
        console.error(error);
    }
};

// Création de la fonction pour afficher les projets
function displayProjects(projects) {
    const projectsContainer = document.querySelector(".gallery");

    // Boucle pour récupérer chaque projet dans le JSON
    projects.forEach((project) => {
        const projectFigure = document.createElement("figure");
        projectFigure.className = "item";
        projectFigure.setAttribute("data-category", project.category.name);

        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl;
        projectImage.alt = `Image de présentation du projet : ${project.title}`;

        const projectTitle = document.createElement("figcaption");
        projectTitle.textContent = project.title;

        // Ajout des éléments dans leur élément parent
        projectFigure.appendChild(projectImage);
        projectFigure.appendChild(projectTitle);
        projectsContainer.appendChild(projectFigure);
    });
}

listProjects();

//--------- Script pour filtrer les projets -------

// Définir la variable de catégorie actuelle
let currentCategory = "Tous";
const defaultButton = document.querySelector("button[name='Tous']");

defaultButton.classList.add("active");

// Sélectionner les boutons de filtre
const filterButtons = document.querySelectorAll(".filters button");

// Ajouter un gestionnaire d'événement pour chaque bouton de filtre
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Mettre à jour la catégorie actuelle
        currentCategory = button.getAttribute("name");

        // Mettre à jour l'apparence des boutons de filtre
        updateFilterButtons(button);

        // Filtrer et afficher les projets en fonction de la catégorie
        filterProjects();
    });
});

// Fonction pour update le background du bouton sélectionné
function updateFilterButtons(selectedButton) {
    filterButtons.forEach((button) => {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");
}

// Fonction pour filtrer et afficher les projets en fonction de la catégorie
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

filterProjects();

//------- Script pour modifier le contenu du portfolio -------
// Si Utilisateur connecté :
const token = localStorage.getItem("token");
const expirationTime = localStorage.getItem("expirationTime");
const currentTime = new Date().getTime();

if (token && expirationTime && currentTime <= parseInt(expirationTime)) {
    // ---- Déjà : récupérer les images des projets ----

    // Fonction pour afficher les projets fetch
    function updateProjects(projects) {
        const projectsContainer = document.querySelector(".modalGallery");
        // Boucle pour récupérer chaque projet dans le JSON
        projects.forEach((project) => {
            const projectFigure = document.createElement("figure");

            const projectImage = document.createElement("img");
            projectImage.src = project.imageUrl;
            projectImage.alt = `Image de présentation du projet : ${project.title}`;

            const trashIcon = document.createElement("img");
            trashIcon.src = "./assets/icons/trash.svg";
            trashIcon.alt = "icone de suppression";
            trashIcon.className = "trash";

            const trashContainer = document.createElement("div");
            trashContainer.className = "trashContainer";

            trashContainer.appendChild(trashIcon);
            projectFigure.appendChild(projectImage);
            projectFigure.appendChild(trashContainer);
            projectsContainer.appendChild(projectFigure);
        });
    }

    // ---- Modification de la page ----

    // Ajout et retrait du bandeau édition
    const editionBanner = document.querySelector(".edition_banner");
    editionBanner.classList.add("visible");

    // Affichage de la modal de management
    const managementModal = document.querySelector(".overlay");

    // Modification de la Nav
    const loginLink = document.getElementById("loginLink");
    loginLink.textContent = "logout";

    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        loginLink.textContent = "login";
        console.log(token);
    });

    // Retrait des boutons de filtres
    const filterContainer = document.querySelector(".filters");
    filterContainer.style.visibility = "hidden";

    // ---- Ajout du lien pour modifier les projets ----

    // Récupération de la section portfolio
    const portfolioTitle = document.querySelector("#portfolio h2");

    // Création des éléments nécessaires
    const modificationIcon = document.createElement("img");
    const modificationLink = document.createElement("a");

    modificationIcon.src = "./assets/icons/update.png";

    modificationLink.setAttribute("href", "#");
    modificationLink.className = "modifier";
    modificationLink.textContent = "Modifier";

    // Ajout du lien dans la page
    modificationLink.appendChild(modificationIcon);
    portfolioTitle.appendChild(modificationLink);

    // Afficher de la modale de modification
    modificationLink.addEventListener("click", () => {
        managementModal.classList.add("visible");
    });

    // Masquer la modale de modification
    const crossIcon = document.querySelector(".crossIcon");
    crossIcon.addEventListener("click", () => {
        managementModal.classList.remove("visible");
    });
    //
} else {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    loginLink.textContent = "login";
    editionBanner.classList.remove("visible");
}
