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

export default createProjectFigure;
