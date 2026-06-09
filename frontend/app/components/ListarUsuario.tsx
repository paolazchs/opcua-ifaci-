"use client"
import { useState } from "react"

export default function ListarUsuario() {
    const [modalAberto, setModalAberto] = useState(false)

    return (
        <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[#5b4a9e]">Usuários cadastrados</h2>

            <div className="bg-white border border-[#e8e0f0] rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-[#2d3748] font-medium">Nome do Usuário</p>
                    <p className="text-xs text-[#8b7bc8]">usuario@email.com · Operador</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setModalAberto(true)}
                        className="text-xs text-[#7c6ef0] hover:text-[#5b4a9e] cursor-pointer transition-colors font-medium">
                        Editar
                    </button>
                    <button className="text-xs text-[#f87171] hover:text-[#dc2626] cursor-pointer transition-colors font-medium">
                        Remover
                    </button>
                </div>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl border border-[#e8e0f0] p-6 w-[380px] flex flex-col gap-4 shadow-xl">
                        <h2 className="text-sm font-semibold text-[#5b4a9e]">Editar usuário</h2>

                        {[
                            { label: "Nome", type: "text", placeholder: "Nome completo" },
                            { label: "E-mail", type: "email", placeholder: "email@exemplo.com" },
                            { label: "Senha", type: "password", placeholder: "••••••" },
                        ].map(f => (
                            <div key={f.label} className="flex flex-col gap-1">
                                <label className="text-xs text-[#7c6ef0] font-medium">{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] transition-all placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                                />
                            </div>
                        ))}

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setModalAberto(false)}
                                className="text-sm px-4 py-1.5 bg-[#7c6ef0] text-white rounded-lg hover:bg-[#6358d4] cursor-pointer transition-colors shadow-sm">
                                Salvar
                            </button>
                            <button onClick={() => setModalAberto(false)}
                                className="text-sm px-4 py-1.5 text-[#8b7bc8] hover:text-[#5b4a9e] cursor-pointer transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
