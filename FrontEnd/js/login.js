document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le comportement par défaut de la soumission du formulaire

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Réinitialiser le message d'erreur avant chaque tentative de connexion
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
        let data = await response.json();
        let token = data.token;

        // Stockage du token dans le localStorage
        localStorage.setItem('token', token);

        // Redirection vers index.html
        window.location.href = 'index.html';
    } else {
        // Afficher un message d'erreur
        document.getElementById('error-message').textContent = 'Identifiants invalides. Veuillez réessayer.';
    }
});