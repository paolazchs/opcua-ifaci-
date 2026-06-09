import CriarUsuario from "./components/CriarUsuario"
import Header from "./components/Header"
import ListarUsuario from "./components/ListarUsuario"

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f4f0fa]">
            <Header name="Usuários" />
            <div className="flex gap-8 p-8">
                <CriarUsuario />
                <ListarUsuario />
            </div>
        </div>
    )
}
