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
        currentCategory = button.getAttribute("name"); // Mettre à jour la catégorie actuelle
        updateFilterButtons(button); // Mettre à jour l'apparence des boutons de filtre
        filterProjects(); // Filtrer et afficher les projets en fonction de la catégorie
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
