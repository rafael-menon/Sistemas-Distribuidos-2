const urlSalva = localStorage.getItem('api_url');
    if (urlSalva) {
        document.getElementById('input-url').value = urlSalva;
    }

    document.getElementById('form-conectar').addEventListener('submit', function(e) {
        e.preventDefault(); 
            
        let urlDigitada = document.getElementById('input-url').value.trim().replace(/\/$/, "");

        if (urlDigitada.endsWith('/')) {
            urlDigitada = urlDigitada.slice(0, -1);
        }

        if (!urlDigitada.startsWith('http://') && !urlDigitada.startsWith('https://')) {
            urlDigitada = 'http://' + urlDigitada;
        }

        localStorage.setItem('api_url', urlDigitada);
            
        window.location.href = '/html/login.html'; 
    });
