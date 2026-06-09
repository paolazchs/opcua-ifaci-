"use client"
import { useState, useEffect, useRef } from "react"

interface Device {
    id: number
    nome: string
    tipo: string
    ip: string
    descricao: string
    status: "online" | "offline" | "alerta"
    criadoEm: string
}

interface Props {
    refresh: number
}

export default function ListarDispositivos({ refresh }: Props) {
    const [devices, setDevices] = useState<Device[]>([])
    const [erro, setErro] = useState<string | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [editForm, setEditForm] = useState({ nome: "", tipo: "", ip: "", descricao: "" })
    const editId = useRef(0)

    const tiposDispositivo = [
        "Sensor de Temperatura", "Sensor de Pressão", "Sensor de Umidade",
        "Sensor de Presença", "Controlador PLC", "Atuador / Relé", "Gateway OPC-UA", "Outro",
    ]

    const buscar = async () => {
        try {
            const res = await fetch("http://localhost:8080/devices")
            if (!res.ok) throw new Error()
            setDevices(await res.json())
            setErro(null)
        } catch {
            setErro("Erro ao buscar dispositivos")
        }
    }

    const deletar = async (id: number) => {
        if (!confirm("Remover dispositivo?")) return
        await fetch(`http://localhost:8080/devices/${id}`, { method: "DELETE" })
        buscar()
    }

    const alterarStatus = async (id: number, status: Device["status"]) => {
        await fetch(`http://localhost:8080/devices/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        buscar()
    }

    const abrirModal = (d: Device) => {
        editId.current = d.id
        setEditForm({ nome: d.nome, tipo: d.tipo, ip: d.ip, descricao: d.descricao })
        setModalAberto(true)
    }

    const salvarEdicao = async () => {
        await fetch(`http://localhost:8080/devices/${editId.current}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        })
        setModalAberto(false)
        buscar()
    }

    useEffect(() => { buscar() }, [refresh])

    const statusStyle = (s: string) => {
        if (s === "online") return "text-[#059669] bg-[#d1fae5]"
        if (s === "alerta") return "text-[#d97706] bg-[#fef3c7]"
        return "text-[#dc2626] bg-[#fee2e2]"
    }

    return (
        <div className="flex-1 flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#5b4a9e]">Dispositivos</h2>
                <span className="text-xs text-[#8b7bc8]">{devices.length} registros</span>
            </div>

            {erro && <p className="text-xs text-[#f87171] font-medium">{erro}</p>}

            {devices.length === 0 && !erro && (
                <p className="text-sm text-[#8b7bc8] text-center py-12">Nenhum dispositivo</p>
            )}

            {devices.map(d => (
                <div key={d.id} className="bg-white border border-[#e8e0f0] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#2d3748]">{d.nome}</span>
                            <span className="text-xs text-[#c4b5fd]">#{d.id}</span>
                        </div>
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${statusStyle(d.status)}`}>
                            {d.status}
                        </span>
                    </div>

                    <div className="flex gap-4 text-xs text-[#6b7280]">
                        <span>{d.tipo}</span>
                        <span>{d.ip || "—"}</span>
                        <span>{new Date(d.criadoEm).toLocaleDateString("pt-BR")}</span>
                    </div>

                    {d.descricao && <p className="text-xs text-[#8b7bc8]">{d.descricao}</p>}

                    <div className="flex items-center gap-2 pt-2 border-t border-[#f3f0fa]">
                        {(["online", "offline", "alerta"] as Device["status"][]).map(st => (
                            <button key={st} onClick={() => alterarStatus(d.id, st)}
                                className={`text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors capitalize font-medium
                                    ${d.status === st ? "bg-[#7c6ef0] text-white" : "text-[#8b7bc8] hover:text-[#5b4a9e] hover:bg-[#ede9fe]"}`}>
                                {st}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <button onClick={() => abrirModal(d)}
                            className="text-xs text-[#7c6ef0] hover:text-[#5b4a9e] cursor-pointer transition-colors font-medium">
                            Editar
                        </button>
                        <button onClick={() => deletar(d.id)}
                            className="text-xs text-[#f87171] hover:text-[#dc2626] cursor-pointer transition-colors font-medium">
                            Remover
                        </button>
                    </div>
                </div>
            ))}

            {modalAberto && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl border border-[#e8e0f0] p-6 w-[380px] flex flex-col gap-4 shadow-xl">
                        <h2 className="text-sm font-semibold text-[#5b4a9e]">Editar #{editId.current}</h2>

                        {[
                            { label: "Nome", key: "nome", placeholder: "Nome" },
                            { label: "IP / Node", key: "ip", placeholder: "192.168.1.10" },
                        ].map(f => (
                            <div key={f.key} className="flex flex-col gap-1">
                                <label className="text-xs text-[#7c6ef0] font-medium">{f.label}</label>
                                <input type="text"
                                    value={editForm[f.key as keyof typeof editForm]}
                                    onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#7c6ef0] font-medium">Tipo</label>
                            <select value={editForm.tipo}
                                onChange={e => setEditForm({ ...editForm, tipo: e.target.value })}
                                className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] bg-[#faf8ff]">
                                {tiposDispositivo.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#7c6ef0] font-medium">Descrição</label>
                            <textarea value={editForm.descricao}
                                onChange={e => setEditForm({ ...editForm, descricao: e.target.value })}
                                rows={2}
                                className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] resize-none placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={salvarEdicao}
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
