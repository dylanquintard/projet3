// Ajoute un gestionnaire d'événement au formulaire de connexion
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Récupère les valeurs des champs email et password
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Réinitialise le message d'erreur avant chaque tentative de connexion
    document.getElementById('error-message').textContent = '';

    let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (response.ok) {
        // stockage des données et du token dans des variables
        let data = await response.json();
        let token = data.token;

        // Stockage du token dans le localStorage
        localStorage.setItem('token', token);

        // Redir vers index.html
        window.location.href = 'index.html';
    } else {
        // Affiche un message d'erreur si la réponse est mauvaise.
        document.getElementById('error-message').textContent = 'Identifiants invalides. Veuillez réessayer.';
    }
});