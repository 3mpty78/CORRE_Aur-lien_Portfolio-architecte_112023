// Fonction pour supprimer un projet

const token = localStorage.getItem("token");

async function deleteProject(projectId, token) {
    try {
        const response = await fetch(
            `http://localhost:5678/api/works/${projectId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
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

export default handleDeleteProject;
