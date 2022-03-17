let tablaDatosGenerales = document.querySelector('#tablaDatosGenerales');
let tablaDatosRx = document.querySelector('#tablaDatosRx');
let tablaDatosTx = document.querySelector('#tablaDatosTx');
let datoMedidorActual =1;




const compararDatos = async () => {
    
    try{
        let response = await fetch('http://calefaccionredimec.ddns.net:1888/medidor');
        if(response.ok){
            let datosMedidor = await response.json();
            datoMedidorComparar = datosMedidor.data;
            if (datoMedidorActual != datoMedidorComparar){
                cargarDatos();
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



const cargarDatos = async () =>{
    try{
        let response = await fetch('http://calefaccionredimec.ddns.net:1888/medidor');
        console.log(response);
        if(response.ok){
            let datosMedidor= await response.json();
            console.log(datosMedidor);
            let datos;
            let datosRx;
            let datosTx;
            datos =
            `<tr>
                <td>${datosMedidor.applicationID}</td>
                <td>${datosMedidor.applicationName}</td>
                <td>${window.atob(datosMedidor.data)}</td>
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