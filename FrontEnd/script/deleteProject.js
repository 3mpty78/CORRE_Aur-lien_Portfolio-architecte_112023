// Fonction pour supprimer un projet
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

export default deleteProject;
