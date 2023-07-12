<script>
  // Verificar si el usuario ha iniciado sesi�n
  function checkSession() {
    // Verificar si la cookie o el valor de almacenamiento local est� presente y es v�lido
    // Aqu� asumimos que est�s utilizando cookies como m�todo de almacenamiento
    const isLoggedIn = document.cookie.includes('isLoggedIn=true');
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';

    // Si el usuario no ha iniciado sesi�n, redirigirlo a la p�gina de inicio de sesi�n
    if (!isLoggedIn && !isAuthenticated) {
      window.location.href = 'https://www.youselene.github.io/buscador/';
    }
  }

  // Llamar a la funci�n de verificaci�n de sesi�n al cargar la p�gina
  checkSession();

  // Funci�n para realizar la b�squeda en Google Sheets
  function searchInGoogleSheets(searchTerm) {
    // Obt�n solo los n�meros de la URL utilizando una expresi�n regular
    var numbers = searchTerm.match(/\d{5,}/g);

    // Verifica si se encontraron n�meros en el t�rmino de b�squeda
    if (numbers !== null) {
      // Obtiene el primer n�mero encontrado
      var number = numbers[0];

      // ID de la hoja de c�lculo de Google Sheets
      var spreadsheetId = '1uxwfQA1Dj7XHechUB2GWaYhq-VPl2rMzPepNSE3zDtM';

      // Nombre de la hoja de c�lculo en la que se realizar� la b�squeda
      var sheetName = 'shutterstock';

      // Credenciales de autenticaci�n de la API de Google Sheets
      var apiKey = 'AIzaSyDCWMQksGjZpej-HmgTNe2fP_HQp4og0Bc'; // Reemplaza con tu propia API Key

      // Construir la URL de la solicitud a la API de Google Sheets
      var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      // Realizar la solicitud GET para obtener los datos de la hoja de c�lculo
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          var rows = data.values;
          var results = [];

          // Recorrer las filas y buscar el n�mero en la columna A
          for (var i = 0; i < rows.length; i++) {
          if (rows[i][0] && rows[i][0] === number) {
            results.push(rows[i][1]); // Agregar el valor de la columna B al resultado
          }
        }

          // Mostrar los resultados en la p�gina web
          var resultsContainer = document.querySelector('.search-results');
          resultsContainer.innerHTML = '';

          if (results.length > 0) {
            for (var k = 0; k < results.length; k++) {
              var resultLink = document.createElement('a');
              resultLink.href = results[k]; // Establecer la URL como el resultado
              resultLink.textContent = results[k]; // Establecer el texto del enlace como el resultado
              resultLink.target = '_blank'; // Abrir enlace en una nueva pesta�a
              resultLink.rel = 'noopener noreferrer'; // Configurar atributos de seguridad para enlaces externos
              resultsContainer.appendChild(resultLink);
              resultsContainer.appendChild(document.createElement('br'));
            }
          } else {
            var noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'No se encontraron resultados.';
            resultsContainer.appendChild(noResultsMessage);
          }
        })
        .catch(function(error) {
          console.log('Error al obtener los datos de Google Sheets:', error);
        });
    } else {
      // No se encontraron n�meros en el t�rmino de b�squeda
      var resultsContainer = document.querySelector('.search-results');
      resultsContainer.innerHTML = '';

      var noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Por favor, ingrese una URL';
      resultsContainer.appendChild(noResultsMessage);
    }
  }

  // Obtener el formulario de b�squeda
  var searchForm = document.querySelector('.search-form');

     // Agregar un evento de env�o de formulario
      searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var searchTerm = searchForm.querySelector('input[name="search-term"]').value;

        // Validar si se ingres� un t�rmino de b�squeda
        if (searchTerm.trim() !== '') {
          searchInGoogleSheets(searchTerm);
        } else {
          var resultsContainer = document.querySelector('.search-results');
          resultsContainer.innerHTML = '';

          var noResultsMessage = document.createElement('p');
          noResultsMessage.textContent = 'Por favor, ingrese un t�rmino de b�squeda.';
          resultsContainer.appendChild(noResultsMessage);
        }
      });
    </script>