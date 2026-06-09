interface Iprops {
    name: string
}

export default function Header({ name }: Iprops) {
    return (
        <header className="w-full px-8 py-5 bg-white/80 backdrop-blur border-b border-[#e8e0f0] flex items-center justify-between">
            <h1 className="text-lg font-semibold text-[#5b4a9e]">{name}</h1>
            <nav className="flex gap-6">
                <a href="/" className="text-sm text-[#8b7bc8] hover:text-[#5b4a9e] transition-colors font-medium">Usuários</a>
                <a href="/devices" className="text-sm text-[#8b7bc8] hover:text-[#5b4a9e] transition-colors font-medium">Dispositivos</a>
                <a href="/dashboard" className="text-sm text-[#8b7bc8] hover:text-[#5b4a9e] transition-colors font-medium">Dashboard</a>
            </nav>
        </header>
    )
}
