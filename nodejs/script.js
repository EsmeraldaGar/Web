
/*Estoy aprendiendo Java no le se jajjaa */
window.onload = function() {
    var select = document.getElementById("opcion");
    var campoTexto = document.getElementById("campoTexto");
  
    select.onchange = function() {
      if (select.value == "otro") {
        campoTexto.style.display = "block";
      } else {
        campoTexto.style.display = "none";
      }
    }
  }
  
  /************ BOTON PA SUBIR JA xd*****************/
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  window.onscroll = function() {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.querySelector(".scroll-to-top").style.display = "block";
    } else {
      document.querySelector(".scroll-to-top").style.display = "none";
    }
  }