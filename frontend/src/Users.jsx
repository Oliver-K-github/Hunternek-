import { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

export default function UserProfile() {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    
    async function getProfile() {
        try {
            const response = await fetch("http://localhost:3001/api/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })

            if (response.status === 401) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
                return
            }

            const data = await response.json()

            if (response.ok) {
                setId(data.id)
                setName(data.name)
                setEmail(data.email)
            } else {
                console.error("Lekérési hiba:", data)
            }

        } catch (error) {
            console.error("GET hiba:", error)
        }
    }
    useEffect(() => {
        getProfile()
    }, [])

    
    async function saveProfile(e) {
        e.preventDefault()

        

        try {
            const response = await fetch("http://localhost:3001/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ name, email, password })
            })
            const data = await response.json()
            alert(data.message)

            if (response.status === 401) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
                return
            }
            if (response.ok) {
               
                localStorage.setItem("user", JSON.stringify(data.user))
                setPassword("")
                setPasswordAgain("")
                await getProfile()
            }
        } catch (error) {
            alert("Szerverhiba!")
        }
    }

    return (
        <div className="container mt-4">
            <h1>Profil</h1>
            <p>felhasznalo azonositas: {id}</p>
            <p>jogosultsag: {"Felhasznalo"}</p>

            <h2>Adataim módosítása</h2>
            <Form onSubmit={saveProfile}>
                <Form.Group className="mb-3">
                    <Form.Label>Nev</Form.Label>
                    <Form.Control value={name}
                        onChange={e => setName(e.target.value)} placeholder="Nev" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email cim</Form.Label>
                    <Form.Control type="email" value={email}
                        onChange={e => setEmail(e.target.value)} placeholder="Email cim" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>uj jelszo</Form.Label>
                    <Form.Control type="password" minLength={8} value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Uj jelszo" />
                </Form.Group>

                 
                <Button type="submit" variant="primary">Szév</Button>
            </Form>
        </div>
    )
}