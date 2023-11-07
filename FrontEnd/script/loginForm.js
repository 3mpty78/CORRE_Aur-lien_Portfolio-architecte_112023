// Fonction pour récupérer les données des inputs (login screen)
const loginForm = document.querySelector("form");

const login = async () => {
    // Récupère les valeurs du nom d'utilisateur et du mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoie les données du formulaire au serveur
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const token = data.token;

    // Création une date d'expiration du token
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    window.localStorage.setItem("token", token);
    window.localStorage.setItem("expirationTime", expirationTime);

    if (token) {
        window.location.href = "../index.html";
    } else {
        alert("Email ou mot de passe incorrect");
        console.error("La connexion a échoué.");
    }
};

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});
