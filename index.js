import { Vehiculo, Aereo, Terrestre, fromJsonToObj } from "./vehiculos.js";
import { sendDeleteAsync } from "./httpRequest.js";
let url = "http://localhost/vehiculoAereoTerrestre.php";

fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Error en la solicitud');
        }
        return response.json();        
    })
    .then(data => {
        localStorage.setItem('datos', JSON.stringify(data));
    })
    .catch(error =>{
        console.error('Error en la solicitud', error);
    })

var guardado = localStorage.getItem('datos');
var datos_json = JSON.parse(guardado);
console.log('objetoObtenido: ', JSON.parse(guardado));

var datos_array = fromJsonToObj(datos_json); ////////// HASTA ACA CARGO DATOS

var array_vehiculos=[];
async function generarObjetos(array){
    for(let vehiculo in array){
        if(array[vehiculo].autonomia !== undefined && array[vehiculo].altMax !== undefined){
            let terrestre = new Aereo(array[vehiculo].id,
                                        array[vehiculo].modelo,
                                        array[vehiculo].anoFab,
                                        array[vehiculo].velMax,
                                        array[vehiculo].altMax,
                                        array[vehiculo].autonomia);
            array_vehiculos.push(terrestre);
        }
        else if(array[vehiculo].cantPue !== undefined && array[vehiculo].cantRue !== undefined){
            let cliente = new Terrestre(array[vehiculo].id,
                                      array[vehiculo].modelo,
                                      array[vehiculo].anoFab,
                                      array[vehiculo].velMax,
                                      array[vehiculo].cantPue,
                                      array[vehiculo].cantRue);
            array_vehiculos.push(cliente);
        }
        else
            continue;
    }
}

generarObjetos(datos_array); /////////// HASTA ACA GENERO OBJETOS

////////// EMPIEZO A CARGAR TABLA "FORM DE DATOS"
let tabla = document.querySelector(".tablaDatos");
function cargarTabla(){
    array_vehiculos.map(
        (elemento)=>{
            let f = document.createElement("tr");
            //- id
            let td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(elemento.id));
            f.appendChild(td1);
            //- modelo
            let td2 = document.createElement("td");
            td2.appendChild(document.createTextNode(elemento.modelo));
            f.appendChild(td2);
            //- anoFab
            let td3 = document.createElement("td");
            td3.appendChild(document.createTextNode(elemento.anoFab));
            f.appendChild(td3);
            //- velMax
            let td4 = document.createElement("td");
            td4.appendChild(document.createTextNode(elemento.velMax));
            f.appendChild(td4);
            //- autonomia
            let td5 = document.createElement("td");
            td5.appendChild(document.createTextNode(elemento.autonomia));
            f.appendChild(td5);
            //- altMax
            let td6 = document.createElement("td");
            td6.appendChild(document.createTextNode(elemento.altMax));
            f.appendChild(td6);
            //- cantPue
            let td7 = document.createElement("td");
            td7.appendChild(document.createTextNode(elemento.cantPue));
            f.appendChild(td7);
            //- cantRue
            let td8 = document.createElement("td");
            td8.appendChild(document.createTextNode(elemento.cantRue));
            f.appendChild(td8);
    
            tabla.appendChild(f);
            return f;
        }
    );
}
cargarTabla();
////////////// HASTA ACA TABLA CARGADA

///////////// HAGO FILTRO DE DROPDOWN LIST

var lista = document.getElementById("lista");
lista.addEventListener("change", () =>{
    var selected = lista.value;
    var rows=tabla.getElementsByTagName("tr");
    switch(selected){
        case "todos":
            for(var i=1; i<rows.length; i++){
                var row= rows[i];
                row.style.display= "";
            }
            break;
        case "aereos":
            for(var i=1; i<rows.length; i++){
                var row= rows[i];
                var dato=row.cells[4].textContent.trim();
                dato >= 0 ? row.style.display= "" : row.style.display="none";
            }
            break;
        case "terrestres":
            for(var i=1; i<rows.length; i++){
                var row= rows[i];
                var dato=row.cells[6].textContent.trim();
                dato >= 0 ? row.style.display= "" : row.style.display="none"; // esconde la row
            }
            break;
    }
}) //////////////////////////HASTA ACA DDL FUNCIONANDO


////////////////////// // BOTON AGREGAR
let btnAgregar=document.getElementById("btnAgregar");
let dialogForm=document.getElementById("dialogForm");
btnAgregar.addEventListener("click", ()=>{
    limpiarDialog();
    dialogForm.setAttribute('open', true);
    document.getElementById("general").style.visibility="hidden"; 
});


// DOBLE CLICK EN LA TABLA
tabla.addEventListener("dblclick", function(event){
  var fila = event.target.closest("tr");   // Verifica si el evento se originó desde una fila
  if(fila){
    var celdas = fila.getElementsByTagName("td");
    dialogForm.setAttribute('open', true);
    document.getElementById("id").value=celdas[0].textContent;
    document.getElementById("modelo").value=celdas[1].textContent;
    document.getElementById("anoFab").value=celdas[2].textContent;
    document.getElementById("velMax").value=celdas[3].textContent;
        if( celdas[4].textContent >= 0||
            celdas[5].textContent >= 0){
                document.getElementById("autonomia").style.visibility="visible";
                document.getElementById("altMax").style.visibility="visible";
                document.getElementById("listaABM").style.visibility="hidden";
                document.getElementById("general").style.visibility="hidden";
                document.getElementById("autonomia").value=celdas[4].textContent;
                document.getElementById("altMax").value=celdas[5].textContent
                document.getElementById("cantPue").style.visibility="hidden";
                document.getElementById("cantRue").style.visibility="hidden";              
        }else{
            document.getElementById("cantPue").style.visibility="visible";
            document.getElementById("cantRue").style.visibility="visible";
            document.getElementById("listaABM").style.visibility="hidden";
            document.getElementById("general").style.visibility="hidden";
            document.getElementById("autonomia").style.visibility="hidden";
            document.getElementById("altMax").style.visibility="hidden";
            document.getElementById("cantPue").value=celdas[6].textContent;
            document.getElementById("cantRue").value=celdas[7].textContent
        }
            
    }
});

//////////////////////// HAGO FILTROS DE CHECKBOX
function ocultarFila(fila, checked){
    for(var i=0; i<tabla.rows.length; i++){
        if(checked == false){
            var filaux=tabla.rows[i];
            filaux.cells[fila].style.display="none";  // ESCONDE LA ROW
        }
        else{
            var filaux=tabla.rows[i];
            filaux.cells[fila].style.display=""; // MUESTRA LA ROW
        }       
    }
}

var cbxId = document.getElementById("cbxId");
cbxId.addEventListener("change", ()=>
    cbxId.checked ? ocultarFila(0, true) : ocultarFila(0, false));

var cbxModelo = document.getElementById("cbxModelo");
cbxModelo.addEventListener("change", ()=>
cbxModelo.checked ? ocultarFila(1, true) : ocultarFila(1, false));

var cbxAnoFab = document.getElementById("cbxAnoFab");
cbxAnoFab.addEventListener("change", ()=>
cbxAnoFab.checked ? ocultarFila(2, true) : ocultarFila(2, false));

var cbxVelMax = document.getElementById("cbxVelMax");
cbxVelMax.addEventListener("change", ()=>
cbxVelMax.checked ? ocultarFila(3, true) : ocultarFila(3, false));

var cbxAltMax = document.getElementById("cbxAltMax");
cbxAltMax.addEventListener("change", ()=>
cbxAltMax.checked ? ocultarFila(4, true) : ocultarFila(4, false));

var cbxAutonomia = document.getElementById("cbxAutonomia");
cbxAutonomia.addEventListener("change", ()=>
cbxAutonomia.checked ? ocultarFila(5, true) : ocultarFila(5, false));
    
var cbxCantPue = document.getElementById("cbxCantPue");
cbxCantPue.addEventListener("change", ()=>
cbxCantPue.checked ? ocultarFila(6, true) : ocultarFila(6, false));

var cbxCantRue = document.getElementById("cbxCantRue");
cbxCantRue.addEventListener("change", ()=>
cbxCantRue.checked ? ocultarFila(7, true) : ocultarFila(7, false));
///////////////////////// HASTA ACA CHECKBOXES FUNCIONANDO

////////// DIALOG BOTON ACEPTAR
let botonAceptar=document.getElementById("botonAceptar");
var listaABM = document.getElementById("listaABM");

//////// LISTA DE TIPOS DE VEHICULOS DEL DIALOG
listaABM.addEventListener("change", () =>{
    switch(listaABM.value){
        case "aereos":
            document.getElementById("cantPue").style.visibility="hidden";
            document.getElementById("cantRue").style.visibility="hidden";
            document.getElementById("autonomia").style.visibility="visible";
            document.getElementById("altMax").style.visibility="visible";
            break;
        case "terrestres":
            document.getElementById("cantPue").style.visibility="visible";
            document.getElementById("cantRue").style.visibility="visible";
            document.getElementById("autonomia").style.visibility="hidden";
            document.getElementById("altMax").style.visibility="hidden";
            break;
        case "vehiculos":
            document.getElementById("cantPue").style.visibility="hidden";
            document.getElementById("cantRue").style.visibility="hidden";
            document.getElementById("autonomia").style.visibility="hidden";
            document.getElementById("altMax").style.visibility="hidden";
    }
})


function agregarVehiculo(){
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let retorno = null;
    xhr.onreadystatechange = function(){
        if(xhr.status == 200 && xhr.readyState == 4){
            if( document.getElementById('modelo').value !== null &&
            document.getElementById('anoFab').value !== null &&
            document.getElementById('anoFab').value >= 1886 &&
            document.getElementById('velMax').value >= 1){
                if(document.getElementById("altMax").value >= 10 && document.getElementById("autonomia").value <= 10)
                {
                    retorno = new Aereo(generarIdUnico(),
                                        document.getElementById('modelo').value,
                                        document.getElementById('anoFab').value,
                                        document.getElementById('velMax').value,
                                        document.getElementById("altMax").value,
                                        document.getElementById("autonomia").value);
                    array_vehiculos.push(retorno);
                    console.log("TODO OK");
                }
                else if(document.getElementById("cantPue").value >= 0 && document.getElementById("cantRue").value >=0)
                {
                    retorno = new Terrestre(generarIdUnico(),
                                            document.getElementById('modelo').value,
                                            document.getElementById('anoFab').value,
                                            document.getElementById('velMax').value,
                                            document.getElementById("cantPue").value,
                                            document.getElementById("cantRue").value);
                    array_vehiculos.push(retorno);
                    console.log("TODO OK");
                }
                else{
                    console.log("Error al generar el objeto");
                }
            }
            else{
                alert("Datos erroneos, intente nuevamente");
                limpiarDialog();
            }    
        }else{
            console.log("Error con HTTP");        
        }   
    }
    if(retorno != null){
        xhr.send(JSON.stringify(retorno));
    }
    vaciarTabla();
    cargarTabla();    
}

// ELIMINAR
let btnEliminar=document.getElementById("btnEliminar");
btnEliminar.addEventListener("click", ()=>{
    var resultado = window.confirm("asd");
    if(resultado){
        let vehiculo = new Vehiculo(1, "asd", 1900, 40);
        sendDeleteAsync(vehiculo);
    }
});



//BOTON CANCELAR DEL DIALOG
let btnCancelar = document.getElementById("bntCancelar");
btnCancelar.addEventListener("click", ()=>{
    limpiarDialog();
    dialogForm.removeAttribute('open');
    document.getElementById("general").style.visibility="visible";  
})

// BOTON ACEPTAR DEL DIALOG
let btnAceptar = document.getElementById("btnAceptar");
btnAceptar.addEventListener("click", ()=>{
    agregarVehiculo();
    limpiarDialog();
    document.getElementById("general").style.visibility="visible"; 
    dialogForm.removeAttribute('open');
})


//FUNCION PARA GENERAR ID
function generarIdUnico() {
    var idsExistente = array_vehiculos.map(function (obj) {
        return obj.id;
    });
    var maxId = idsExistente.reduce(function (max, id) {
        return Math.max(max, id);
    }, 0);
    return maxId + 1;
  }

//FUNCION PARA VACIAR LA TABLA
function vaciarTabla() {
    var rowCount = tabla.rows.length; 
    for (var i = rowCount - 1; i > 0; i--) {
      tabla.deleteRow(i);
    }
  }

//FUNCION PARA LIMPIAR DIALOG
function limpiarDialog(){
    document.getElementById("listaABM").style.visibility="visible";
    document.getElementById("id").value="";
    document.getElementById("modelo").value="";
    document.getElementById("anoFab").value="";
    document.getElementById("velMax").value="";
    document.getElementById("autonomia").value="";
    document.getElementById("altMax").value="";
}

