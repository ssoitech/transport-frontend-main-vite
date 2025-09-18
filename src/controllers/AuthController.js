import { setToken } from "../services/AuthServices";


export function validateUser(email, password) {
    let isMatch = false;
    const data = [{ userId: "Mdas", pass: "mdas@123" }, { userId: "Bmishra", pass: "bmishra@123" }, { userId: "Admin", pass: "admin@123" }];
    data.forEach(element => {

        if (element.userId === email) {
            if (element.pass === password) {
                console.log("Match")
                setToken(element.userId);
                isMatch = true;
            }

        }
    });

    if (isMatch) {
        return true;
    } else {
        return false;
    }

};

export function isAuthenticated() {

}
