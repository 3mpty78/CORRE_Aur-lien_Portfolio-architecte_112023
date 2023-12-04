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
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression du projet ! ❌");
    }
}

// Fonction pour supprimer un projet
async function handleDeleteProject(projectId) {
    await deleteProject(projectId, token);

    const projectElement = document.querySelectorAll(
        `[data-project-id="${projectId}"]`
    );

    projectElement.forEach((project) => {
        project.remove();
    });

    alert("Projet supprimé avec succès ! ✅");
}

export default handleDeleteProject;
