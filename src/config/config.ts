export default {
  jwtSecret: 'ItsseRd§Wd8?bYliBz$',
  environment: 'dev',
  imagePath: '/var/www/html/assets/img/',
  // prettier-ignore
  mail: verificationInfo => {
    return `
      <html>
          <head>
            <meta charset='UTF-8' />
          </head>
          <body>
              <style>
                  body {
                      text-align: center;
                  }
                  h1 {
                      color: steelblue;
                  }

                  a {
                      color: dodgerblue;
                      text-decoration: none;
                      fontsize: 130%;
                  }
                  a:link {
                      color: dodgerblue;
                  }
                  a:visited {
                      color: dodgerblue;
                  }
                  a:active {
                      color: dodgerblue;
                  }

                  p {
                      font-size: 150%;
                   }
              </style>

              <h1>Danke f&uuml;r die Registrierung.</h1>
                  <br>
              <p>Bitte klicke auf den Link unten, um dich zu verifizieren.</p> <br><br>
              <a href="${'http://localhost:4200'}/verify?uid=${verificationInfo.uid}&email=${verificationInfo.email}">Verifizieren</a>
          </body>
      </html>`;
  }
};
