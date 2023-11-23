// Fonction pour mettre à jour l'affichage des projets
import createProjectFigure from "./createProjectFigure.js";
import handleDeleteProject from "./deleteProject.js";

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

            trashIcon.addEventListener("click", (e) => {
                handleDeleteProject(e, project.id);
            });

            trashContainer.appendChild(trashIcon);
            projectFigure.appendChild(trashContainer);
        }

        projectsContainer.appendChild(projectFigure);
    });
}

export default updateProjectsDisplay;
