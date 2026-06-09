"use client"
import { useState } from "react"

export default function CriarUsuario() {
    const [form, setForm] = useState({ nome: "", email: "", senha: "" })

    return (
        <div className="w-[360px] bg-white rounded-xl border border-[#e8e0f0] p-6 flex flex-col gap-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#5b4a9e]">Novo usuário</h2>

            {[
                { label: "Nome", key: "nome", type: "text", placeholder: "Nome completo" },
                { label: "E-mail", key: "email", type: "email", placeholder: "email@exemplo.com" },
                { label: "Senha", key: "senha", type: "password", placeholder: "••••••" },
            ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                    <label className="text-xs text-[#7c6ef0] font-medium">{f.label}</label>
                    <input
                        type={f.type}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] transition-all placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                    />
                </div>
            ))}

            <button className="py-2.5 text-sm font-medium bg-[#7c6ef0] text-white rounded-lg hover:bg-[#6358d4] transition-colors cursor-pointer shadow-sm">
                Criar
            </button>
        </div>
    )
}
