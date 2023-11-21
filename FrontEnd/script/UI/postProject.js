const addFileInput = document.querySelector("input[type='file']");
const projectName = document.getElementById("title");
const projectCategory = document.getElementById("category");
const submitButton = document.getElementById("submitButton");
const projectPreview = document.getElementById("projectPicture");

addFileInput.addEventListener("change", () => {
    previewImage(addFileInput, projectPreview);
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

        alert("Projet envoyé ! ✅");
    } catch (error) {
        console.error("Erreur lors de l'envoie du projet : ", error);
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
