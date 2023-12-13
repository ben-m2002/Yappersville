export function checkForWhiteSpace (s){
    let re = /^\s+$/;
    return re.test(s);
}

export function debounce (func, wait){
    let timeout;

    return function executedFunction (...args){
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        }

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}

export function hashString(str) {
    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(str);
    return shaObj.getHash("HEX");
}

export async function updateUser (userObject){
    return await fetch("/api/updateUser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject),
    })
}

export async function updateGroup (group){
    return await fetch("/api/updateGroup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group),
    })
}

export async function updateDM (dm){
    return await fetch("/api/updateDM", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dm),
    })
}


export async function parseMessage (message){
    // make sure it's actually a joke
    if (message !== "/joke"){
        return message
    }
    try {
        let response = await fetch ("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        })
        if (response.status === 200){
            let data = await response.json();
            return data.joke;
        }
        else{
            return "Error getting joke"
        }
    }catch (e){
        console.log(e)
        return "Error getting joke"
    }
}

