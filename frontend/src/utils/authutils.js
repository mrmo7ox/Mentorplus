
export async function isTokenValid() {
    const token = localStorage.getItem('access');
    if (!token) return false;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/token/verify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function me() {
    const token = localStorage.getItem("access");
    return fetch("http://127.0.0.1:8000/api/me/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .catch(console.error);
}

export async function user_role() {
    const token = localStorage.getItem("access");
    try {
        const res = await fetch("http://127.0.0.1:8000/api/me/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data.grp;
    } catch (e) {
        console.error(e);
        return null;
    }
}



export function logoutAndRedirect(navigate) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
}
