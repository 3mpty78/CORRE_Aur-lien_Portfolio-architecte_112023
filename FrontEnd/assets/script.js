// Création du fetch pour récupérer les projets
const listProjects = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projects = await response.json();

        // Fonction pour afficher les projets apres fetch
        displayProject(projects);
    } catch (error) {
        console.error(error);
    }
};

function displayProject(projects) {
    // Récupération du container de projets
    const projectsContainer = document.querySelector(".gallery");

    // Boucle pour récupérer chaque projet dans le JSON
    projects.forEach((project) => {
        const projectElement = document.createElement("figure");
        projectElement.className = "item";

        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl;

        const projectTitle = document.createElement("figcaption");
        projectTitle.textContent = project.title;

        // Ajout des éléments dans leur élément parent
        projectElement.appendChild(projectImage);
        projectElement.appendChild(projectTitle);
        projectsContainer.appendChild(projectElement);
    });
}

listProjects();
