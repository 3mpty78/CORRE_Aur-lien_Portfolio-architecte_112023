// Fonction pour créer un élément figure de projet
function createProjectFigure(project) {
    const projectFigure = document.createElement("figure");
    projectFigure.className = "item";

    // Vérifier si project.category existe et a une propriété name
    const category =
        project.category && project.category.name
            ? project.category.name
            : "Unknown";

    projectFigure.setAttribute("data-category", category);
    projectFigure.setAttribute("data-project-id", project.id);

    const projectImage = document.createElement("img");
    projectImage.src = project.imageUrl || ""; // Assurez-vous que imageUrl est défini
    projectImage.alt = `Image de présentation du projet : ${
        project.title || "Unknown"
    }`;

    const projectTitle = document.createElement("figcaption");
    projectTitle.textContent = project.title || "Unknown";

    projectFigure.appendChild(projectImage);
    projectFigure.appendChild(projectTitle);

    return projectFigure;
}

export default createProjectFigure;
