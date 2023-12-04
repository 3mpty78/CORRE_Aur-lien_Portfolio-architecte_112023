// Fonction pour mettre à jour l'affichage des projets
import createProjectFigure from "./createProjectFigure.js";
import handleDeleteProject from "./deleteProject.js";

function updateProjectsDisplay(
    projectOrProjects,
    containerSelector,
    addTrashIcon = false
) {
    const projectsContainer = document.querySelector(containerSelector);

    // Si un seul projet est passé alors convertir en tableau
    const projects = Array.isArray(projectOrProjects)
        ? projectOrProjects
        : [projectOrProjects];

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

            trashIcon.addEventListener("click", () => {
                handleDeleteProject(project.id);
            });

            trashContainer.appendChild(trashIcon);
            projectFigure.appendChild(trashContainer);
        }

        projectsContainer.appendChild(projectFigure);
    });
}

export default updateProjectsDisplay;
