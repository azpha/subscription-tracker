async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password
        })
    })

    return await res.json()
}
async function register(name: string, email: string, password: string) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            email,
            password
        })
    })

    return await res.json()
}
async function fetchAuthenticatedUser() {
    const res = await fetch('/api/auth/@me', {
        method: 'GET',
        credentials: 'include'
    })
    
    return await res.json()
}
async function doesAdminExist() {
    const res = await fetch('/api/auth/isSetup', {
        method: 'GET',
        credentials: 'include'
    })

    return await res.json()
}

export default {
    login,
    register,
    fetchAuthenticatedUser,
    doesAdminExist
}