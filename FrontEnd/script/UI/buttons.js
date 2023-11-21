// Fonction pour gérer les filtres
let currentCategory = "Tous";
const filterButtons = document.querySelectorAll(".filters button");

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

export default { filterProjects, handleFilterButtonClick };
