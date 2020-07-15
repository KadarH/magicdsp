<h1>Réinitialisation de votre mot de passe</h1>
<p>Bonjour, vous avez fait une demande pour réinitialiser votre mot de passe. Vous pouvez dès à présent le faire en cliquant sur le lien (valide pendant 1h) ci-dessous.</p>
<a class="link-reset" href="https://app.magic-dsp.com/password/reset/{{$user->password_reset_token}}">Réinitialisation du mot de passe</a>
<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ne pas tenir compte de cet email. Votre ancien mot de passe reste inchangé et vous pouvez continuer à l'utiliser.</p>

<style>
    .link-reset {
        background: #18c3f1;
        padding: 10px;
        color: #fff;
        text-decoration: none;
        display: inline-block;
        border-radius: 4px;
    }
    .danger {
        color: #F44336;
        font-style: italic;
        font-size: .9em;
    }
</style>