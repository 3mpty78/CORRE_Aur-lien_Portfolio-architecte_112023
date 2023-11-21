const addFileInput = document.querySelector("input[type='file']");
const projectName = document.getElementById("title");
const projectCategory = document.getElementById("category");
const submitButton = document.getElementById("submitButton");
const projectPreview = document.getElementById("projectPicture");

addFileInput.addEventListener("change", (event) => {
    previewImage(addFileInput, projectPreview);
    updateSubmitButtonState();
});

async function postProject() {
    const formData = new FormData();
    formData.append("image", addFileInput.files[0]);
    formData.append("title", projectName.value);
    formData.append("category", projectCategory.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        alert("Projet envoyé ! ✅");
    } catch (error) {
        console.error("Erreur lors de l'envoie du projet : ", error);
    }
}

function previewImage(input, imageElement) {
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageElement.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function updateSubmitButtonState() {
    const validAddFileInput = addFileInput.checkValidity();
    const validProjectName = projectName.checkValidity();
    const validProjectCategory = projectCategory.checkValidity();

    submitButton.disabled = !(
        validAddFileInput &&
        validProjectName &&
        validProjectCategory
    );
}

projectName.addEventListener("input", updateSubmitButtonState);
projectCategory.addEventListener("input", updateSubmitButtonState);
submitButton.addEventListener("click", postProject);

export default postProject;
