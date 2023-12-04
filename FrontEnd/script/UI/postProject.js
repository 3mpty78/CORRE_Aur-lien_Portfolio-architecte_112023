import fetchProjects from "../script.js";
import createProjectFigure from "./createProjectFigure.js";
import updateProjectsDisplay from "./updateProjectDisplay.js";

const addFileInput = document.querySelector("input[type='file']");
const projectName = document.getElementById("title");
const projectCategory = document.getElementById("category");
const submitButton = document.getElementById("submitButton");
const projectPreview = document.getElementById("projectPicture");
const addButton = document.querySelector(".addFile");
const imageFormat = document.querySelector(".addContainer p");

addFileInput.addEventListener("change", () => {
    previewImage(addFileInput, projectPreview);
    addButton.style.display = "none";
    imageFormat.style.display = "none";
    updateSubmitButtonState();
});

// Fonction pour récupérer les catégories
async function fetchCatgories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error(
                `Erreur de récupération des catégories : ${response.status}`
            );
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];
    }
}
// Lister les catégorties dans mon select
function pushCategories(categories) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.text = "Sélectionnez une catégorie";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    projectCategory.appendChild(emptyOption);

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        projectCategory.appendChild(option);
    });
}

const categories = await fetchCatgories();
pushCategories(categories);

// Fonction pour poster le projet
async function postProject(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", addFileInput.files[0]);
    formData.append("title", projectName.value);
    formData.append("category", projectCategory.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        alert("Projet ajouté avec succès ! ✅");

        // Ajouter le nouvel élément à la liste existante
        const newProject = await response.json();

        const projectsContainer = document.querySelector(".gallery");

        // Appel de la fonction pour créer une nouvelle figure
        const projectFigure = createProjectFigure(newProject);
        projectsContainer.appendChild(projectFigure);

        updateProjectsDisplay(newProject, ".modalGallery", true);

        // Effacer les champs du formulaire
        projectName.value = "";
        projectCategory.value = "";
        projectPreview.src = "./assets/icons/picture.png";
        addButton.style.display = "block";
        imageFormat.style.display = "block";

        // Désactiver le bouton soumettre après avoir effacé les champs
        updateSubmitButtonState();
    } catch (error) {
        console.error("Erreur lors de l'envoi du projet : ", error);
        alert("Erreur lors de l'ajout du projet ! ❌");
    }
}

// Fonction pour afficher la preview de l'image sélectionnée
function previewImage(input, imageElement) {
    const file = input.files[0];
    console.log(file);

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageElement.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Fonction pour disable le bouton (ou non)
function updateSubmitButtonState() {
    const validAddFileInput = addFileInput.checkValidity();
    const validProjectName = projectName.checkValidity();
    const validProjectCategory = projectCategory.checkValidity();

    if (validAddFileInput && validProjectName && validProjectCategory) {
        submitButton.toggleAttribute("disabled", false);
    }
}

projectName.addEventListener("input", updateSubmitButtonState);
projectCategory.addEventListener("input", updateSubmitButtonState);
submitButton.addEventListener("click", postProject);

export default postProject;
