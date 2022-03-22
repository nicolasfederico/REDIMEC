let tablaDatosGenerales = document.querySelector('#tablaDatosGenerales');
let tablaDatosRx = document.querySelector('#tablaDatosRx');
let tablaDatosTx = document.querySelector('#tablaDatosTx');
let contenedorDatos = document.querySelector('#contenedorDatos');
let inputIP = document.querySelector('#inputIP');
let btnIP = document.querySelector('#btn-IP')

let ipAdress = '';



btnIP.addEventListener ('click', ()=>{

    ipAdress = inputIP.value;
    console.log(ipAdress)

})


let datoMedidorActual =1;
let cadenaUnida=['-1'];
let contador = 0;





const compararDatos = async () => {
    
    try{
        //let response = await fetch(`calefaccionredimec.ddns.net:1888/medidor`);
        let response = await fetch(`${ipAdress}`);
        if(response.ok){
            let datosMedidor = await response.json();
            datoMedidorComparar = datosMedidor.data;
            if (datoMedidorActual != datoMedidorComparar){
                let dataTranslated = window.atob(datoMedidorComparar);
                unificacionDeCadena(dataTranslated);
 		        console.log(dataTranslated)
                console.log('Cadena Unida:\r\n'+cadenaUnida)
		        console.log('contador: '+contador)
                if (contador==4){
                    cargarDatos(cadenaUnida);
                }
                datoMedidorActual = datoMedidorComparar;
            }
            
        }
        else{
            tablaDatosGenerales.innerHTML="<h1>Error - Failed URL!</h1>";
        }
    }
    catch(err){
        tablaDatosGenerales.innerHTML = "<h1>"+ err.message+"</h1>"
    }
}



const cargarDatos = async (cadenaUnida) =>{
    try{
        let response = await fetch(`${ipAdress}`);
        if(response.ok){
            let datosMedidor= await response.json();
            let datos;
            let datosRx;
            let datosTx;
            datos =
            `<tr>
                <td>${datosMedidor.applicationID}</td>
                <td>${datosMedidor.applicationName}</td>
                <td>${cadenaUnida}</td>
                <td>${datosMedidor.devEUI}</td>
                <td>${datosMedidor.deviceName}</td>
                <td>${datosMedidor.fCnt}</td>
                <td>${datosMedidor.fPort}</td>
            </tr>` 
            

            datosRx = `<tr>
            <td>${datosMedidor.rxInfo[0].altitude}</td>
            <td>${datosMedidor.rxInfo[0].latitude}</td>
            <td>${datosMedidor.rxInfo[0].loRaSNR}</td>
            <td>${datosMedidor.rxInfo[0].longitude}</td>
            <td>${datosMedidor.rxInfo[0].mac}</td>
            <td>${datosMedidor.rxInfo[0].name}</td>
            <td>${datosMedidor.rxInfo[0].rssi}</td>
            <td>${datosMedidor.rxInfo[0].time}</td>
            </tr>` 
            

            datosTx = `<tr>
            <td>${datosMedidor.txInfo.adr}</td>
            <td>${datosMedidor.txInfo.codeRate}</td>
            <td>${datosMedidor.txInfo.dataRate.bandwidth}</td>
            <td>${datosMedidor.txInfo.dataRate.modulation}</td>
            <td>${datosMedidor.txInfo.dataRate.spreadFactor}</td>
            <td>${datosMedidor.txInfo.frequency}</td>
            </tr>` 

            tablaDatosGenerales.innerHTML += datos;
            tablaDatosRx.innerHTML += datosRx;
            tablaDatosTx.innerHTML += datosTx; 
            contenedorDatos.innerHTML = cadenaUnida;
        }
        else{
            tablaDatosGenerales.innerHTML="<h1>Error - Failed URL!</h1>";
        }
    }
    catch(err){
        tablaDatosGenerales.innerHTML = "<h1>"+ err.message+"</h1>"
    }
}


setInterval(() => {
    compararDatos();
}, 1000);


const unificacionDeCadena = (cadena) => {
    if (cadena.charAt(10) =='0') {
	contador = 0;
	for (let i=1; i<=contador; i++) {
        cadenaUnida[i] = '';
	}
        cadenaUnida[cadena.charAt(10)] = cadena;
    } else if (cadenaUnida[0]!='' &&(cadenaUnida[0].substring(1,9))==cadena.substring(1,9)) {
        contador = cadena.charAt(10);
        cadenaUnida[cadena.charAt(10)] = cadena.substring(12);
    } 
}