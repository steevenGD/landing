
let ready = () => {
    console.log('DOM está listo')
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
          emailElement.focus();
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

        }
    })
  }
window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)
