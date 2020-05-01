const path = require(path);

module.exports = app => {
    app.get("/login", (req, res) => {
        const scopes = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + my_client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(redirect_uri));
    })

} 