export function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Invalid token or token decoding failed', e);
        return null;
    }
}

export function getUsernameFromJwt(token) {
    const decodedToken = decodeJwt(token);
    return decodedToken ? decodedToken.sub : null; // Replace 'sub' with the correct key if necessary
}
