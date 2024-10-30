const databaseURL = 'https://sgomez-dawm-default-rtdb.firebaseio.com/data.json'; 

let sendData = ( ) => {  

  // Obtén los datos del formulario
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto
  // new Date().toLocaleString( locales, options )
  data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
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
      alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
      form.reset();
      // Recuperación de datos
      getData();
  })
  .catch(error => {
      alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
  });

}

let getData = async () => {
  try {

      // Realiza la petición fetch a la URL de la base de datos
      const response = await fetch(databaseURL, {
        method: 'GET'
      });

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
      }

      // Convierte la respuesta en formato JSON
      let data = await response.json();

      if(data != null) {

        // Cuente el número de suscriptores registrados por fecha a partir del objeto data
        let countSuscribers = new Map()

        if (Object.keys(data).length > 0) {
            for (let key in data) {
   
                let { email, saved } = data[key]
                   
                let date = saved.split(",")[0]
                   
                let count = countSuscribers.get(date) || 0;
                countSuscribers.set(date, count + 1)
            }
        }
      
        // Genere y agregue filas de una tabla HTML para mostrar fechas y cantidades de suscriptores almacenadas 
        if (countSuscribers.size > 0) {

          subscribers.innerHTML = ''
 
          let index = 1;
          for (let [date, count] of countSuscribers) {
            let rowTemplate = `
            <tr>
                <th>${index}</th>
                <td>${date}</td>
                <td>${count}</td>
            </tr>`
              subscribers.innerHTML += rowTemplate
              index++;
          }
      }
    }

    } catch (error) {
      // Muestra cualquier error que ocurra durante la petición
      alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    }
} 




let ready = () => {
  console.log('DOM está listo')
  // Recuperación de datos
  getData();
  //debugger
}

let loaded = ( eventLoaded ) => {
  //console.log('Iframes e Images cargadas')
  let myform = document.getElementById('form');
     
  myform.addEventListener('submit', (eventSubmit) => {
      eventSubmit.preventDefault(); 
            
      const emailElement = document.querySelector('.form-control-lg');
      const emailText = emailElement.value;

      if (emailText.length === 0) {
        emailElement.animate(
          [ 
          //{transform: "translateY(0)"}, 
          {transform: "translateX(0)"},           
          //{ transform: "translateY(50px)" },    
          { transform: "translateX(50px)" },
          //{ transform: "translateY(-50px)" },
          { transform: "translateX(-50px)" },
          //{ transform: "translateY(0)" },    
          { transform: "translateX(0)" }
          ], 
          {
          duration: 250,
          easing: "linear",
          }
        )
      
        emailElement.focus();
        return;
      }
      sendData();
  })
}
window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)
