import { crearSpinner, quitarSpinner} from "./spinner.js"

let url = "http://localhost/vehiculoAereoTerrestre.php";
export async function sendDeleteAsync(obj){
    try {
        crearSpinner();
        const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(obj)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error(`Fetch failed: ${error.message}`);
        return new Response(error.message, { status: error.status ? error.status : 500, statusText: "Internal Server Error" });
    }
    finally{
        quitarSpinner();
    }
}