let tablaDatosGenerales = document.querySelector('#tablaDatosGenerales');
let tablaDatosRx = document.querySelector('#tablaDatosRx');
let tablaDatosTx = document.querySelector('#tablaDatosTx');
let contenedorDatos = document.querySelector('#contenedorDatos');
let datoMedidorActual =1;
let cadenaUnida=['-1','-1','-1','-1','-1'];





const compararDatos = async () => {
    
    try{
        let response = await fetch('http://calefaccionredimec.ddns.net:1888/medidor');
        if(response.ok){
            let datosMedidor = await response.json();
            datoMedidorComparar = datosMedidor.data;
            if (datoMedidorActual != datoMedidorComparar){
                let dataTranslated = window.atob(datoMedidorComparar);
                unificacionDeCadena(dataTranslated);
                console.log('Cadena Unida:\r\n'+cadenaUnida)
                
                let incluyeValor = cadenaUnida.includes('-1')

                if (!incluyeValor){
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
        let response = await fetch('http://calefaccionredimec.ddns.net:1888/medidor');
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
        cadenaUnida = ['-1','-1','-1','-1','-1'];
        cadenaUnida[cadena.charAt(10)] = cadena;
    } else if (cadenaUnida[0]!='-1' && (cadenaUnida[0].substring(1,9))==cadena.substring(1,9)) {
        cadenaUnida[cadena.charAt(10)] = cadena.substring(12);
    } 
}