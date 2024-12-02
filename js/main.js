// URL de Firebase Database
const databaseURL = 'https://sjgd-landing-default-rtdb.firebaseio.com/curriculum.json'; 

// Función para enviar datos al servidor (POST)
let sendData = () => {  
  // Obtén los datos del formulario
  const form = document.getElementById('form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto

  // Añadimos la fecha de la solicitud
  data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

  // Realiza la petición POST con fetch
  fetch(databaseURL, {
    method: 'POST', // Método de la solicitud
    headers: {
      'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
    },
    body: JSON.stringify(data) // Convierte los datos a JSON
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    return response.json(); // Procesa la respuesta como JSON
  })
  .then(result => {
    alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Muestra un mensaje al usuario
    form.reset(); // Resetea el formulario después del envío
    getData(); // Llama a getData después de que se haya enviado el formulario
  })
  .catch(error => {
    alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Muestra un mensaje de error si la solicitud falla
  });
};

// Función para recibir los datos (GET) desde Firebase
let getData = () => {
  fetch(databaseURL)
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
      // Si no hay datos, mostramos un mensaje
      if (!data) {
        document.getElementById('firebase-data').innerHTML = '<p>No hay datos disponibles.</p>';
        return;
      }

      // Limpiamos el contenedor antes de agregar los datos
      const dataContainer = document.getElementById('firebase-data');
      dataContainer.innerHTML = '<h3>Información Almacenada en Firebase:</h3>';

      // Iterar sobre los datos recibidos y mostrarlos
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const entry = data[key];
          const entryElement = document.createElement('div');
          entryElement.classList.add('firebase-entry');
          entryElement.innerHTML = `
            <p><strong>Nombre:</strong> ${entry.nombre || 'N/A'}</p>
            <p><strong>Email:</strong> ${entry.email || 'N/A'}</p>
            <p><strong>Experiencia:</strong> ${entry.experiencia || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${entry.saved || 'N/A'}</p>
            <hr>
          `;
          dataContainer.appendChild(entryElement);
        }
      }
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error); // Maneja los errores
    });
};

// Función cuando el DOM está listo
let ready = () => {
  console.log('DOM está listo');
}

// Función cuando todos los recursos han cargado
let loaded = (eventLoaded) => {
  console.log('Recursos cargados');
  
  // Obtener el formulario y añadirle un listener para el evento submit
  let myform = document.getElementById('form');
  myform.addEventListener('submit', (eventSubmit) => {
    eventSubmit.preventDefault(); // Prevenir el comportamiento por defecto del formulario (enviar la página)

    // Validar que el correo no esté vacío
    const emailElement = document.querySelector('.form-control-lg');
    const emailText = emailElement.value.trim();

    if (emailText.length === 0) {
      emailElement.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(50px)" }, { transform: "translateX(-50px)" }, { transform: "translateX(0)" }],
        { duration: 250, easing: "linear" }
      );
      emailElement.focus();
      return;
    }

    // Si la validación pasa, enviar los datos
    sendData();
  });

  // Llamada a obtener los datos (si se necesita mostrar los datos de Firebase)
  getData();
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);


// ----------- Código de navegación, animaciones y otros eventos -----------

// Función de selector fácil
const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
}

// Función de listener de eventos fácil
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all);
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener));
    } else {
      selectEl.addEventListener(type, listener);
    }
  }
}

// Navbar links active state on scroll
let navbarlinks = select('#navbar .scrollto', true);
const navbarlinksActive = () => {
  let position = window.scrollY + 200;
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return;
    let section = select(navbarlink.hash);
    if (!section) return;
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      navbarlink.classList.add('active');
    } else {
      navbarlink.classList.remove('active');
    }
  });
}
window.addEventListener('load', navbarlinksActive);
onscroll(document, navbarlinksActive);

// Scrolls to an element with header offset
const scrollto = (el) => {
  let header = select('#header');
  let offset = header.offsetHeight;

  let elementPos = select(el).offsetTop;
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  });
}

// Toggle .header-scrolled class to #header when page is scrolled
let selectHeader = select('#header');
let selectTopbar = select('#topbar');
if (selectHeader) {
  const headerScrolled = () => {
    if (window.scrollY > 100) {
      selectHeader.classList.add('header-scrolled');
      if (selectTopbar) {
        selectTopbar.classList.add('topbar-scrolled');
      }
    } else {
      selectHeader.classList.remove('header-scrolled');
      if (selectTopbar) {
        selectTopbar.classList.remove('topbar-scrolled');
      }
    }
  }
  window.addEventListener('load', headerScrolled);
  onscroll(document, headerScrolled);
}

// Back to top button
let backtotop = select('.back-to-top');
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add('active');
    } else {
      backtotop.classList.remove('active');
    }
  }
  window.addEventListener('load', toggleBacktotop);
  onscroll(document, toggleBacktotop);
}

// Mobile nav toggle
on('click', '.mobile-nav-toggle', function(e) {
  select('#navbar').classList.toggle('navbar-mobile');
  this.classList.toggle('bi-list');
  this.classList.toggle('bi-x');
});

// Mobile nav dropdowns activate
on('click', '.navbar .dropdown > a', function(e) {
  if (select('#navbar').classList.contains('navbar-mobile')) {
    e.preventDefault();
    this.nextElementSibling.classList.toggle('dropdown-active');
  }
}, true);

// Scroll with offset on links with class name .scrollto
on('click', '.scrollto', function(e) {
  if (select(this.hash)) {
    e.preventDefault();

    let navbar = select('#navbar');
    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile');
      let navbarToggle = select('.mobile-nav-toggle');
      navbarToggle.classList.toggle('bi-list');
      navbarToggle.classList.toggle('bi-x');
    }
    scrollto(this.hash);
  }
}, true);

// Scroll with offset on page load with hash links in the url
window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  }
});

// Preloader
let preloader = select('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.remove();
  });
}

// Initiate glightbox 
const glightbox = GLightbox({
  selector: '.glightbox'
});

// Initiate Gallery Lightbox 
const galelryLightbox = GLightbox({
  selector: '.galelry-lightbox'
});

// Testimonials slider
new Swiper('.testimonials-slider', {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  slidesPerView: 'auto',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },

    1200: {
      slidesPerView: 2,
      spaceBetween: 20
    }
  }
});

// Initiate Pure Counter 
new PureCounter();
