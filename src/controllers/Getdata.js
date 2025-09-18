import axios from "axios";
export default async function getData() {
    let VehicleData = null;
    await axios.get('http://ssoi.themdlabs.com:8080/api/v1/get/all-vehicle-passing-weight')
        .then(function (response) {
            // handle success
            VehicleData = response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    return VehicleData;
}