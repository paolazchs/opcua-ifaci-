"use client"
import { useState } from "react"

interface Props {
    onCriado: () => void
}

export default function CriarDispositivo({ onCriado }: Props) {
    const [form, setForm] = useState({ nome: "", tipo: "", ip: "", descricao: "" })
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ texto: string; erro: boolean } | null>(null)

    const tiposDispositivo = [
        "Sensor de Temperatura",
        "Sensor de Pressão",
        "Sensor de Umidade",
        "Sensor de Presença",
        "Controlador PLC",
        "Atuador / Relé",
        "Gateway OPC-UA",
        "Outro",
    ]

    const criar = async () => {
        if (!form.nome || !form.tipo) {
            setMsg({ texto: "Nome e tipo são obrigatórios.", erro: true })
            return
        }
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8080/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            const json = await res.json()
            if (res.ok) {
                setMsg({ texto: json.msg, erro: false })
                setForm({ nome: "", tipo: "", ip: "", descricao: "" })
                onCriado()
            } else {
                setMsg({ texto: json.msg, erro: true })
            }
        } catch {
            setMsg({ texto: "Erro ao conectar com a API.", erro: true })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-[360px] bg-white border border-[#e8e0f0] rounded-xl p-6 flex flex-col gap-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#5b4a9e]">Novo dispositivo</h2>

            {msg && (
                <p className={`text-xs font-medium ${msg.erro ? "text-[#f87171]" : "text-[#059669]"}`}>
                    {msg.texto}
                </p>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#7c6ef0] font-medium">Nome *</label>
                    <input type="text" value={form.nome}
                        onChange={e => setForm({ ...form, nome: e.target.value })}
                        placeholder="ex: Sensor-01"
                        className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] transition-all placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#7c6ef0] font-medium">Tipo *</label>
                    <select value={form.tipo}
                        onChange={e => setForm({ ...form, tipo: e.target.value })}
                        className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] bg-[#faf8ff]">
                        <option value="">Selecionar...</option>
                        {tiposDispositivo.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#7c6ef0] font-medium">IP / Node ID</label>
                    <input type="text" value={form.ip}
                        onChange={e => setForm({ ...form, ip: e.target.value })}
                        placeholder="192.168.1.10"
                        className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] transition-all placeholder:text-[#c4b5fd] bg-[#faf8ff]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#7c6ef0] font-medium">Descrição</label>
                    <textarea value={form.descricao}
                        onChange={e => setForm({ ...form, descricao: e.target.value })}
                        placeholder="Observações..."
                        rows={2}
                        className="border border-[#e8e0f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ef0] focus:ring-2 focus:ring-[#ede9fe] transition-all placeholder:text-[#c4b5fd] bg-[#faf8ff] resize-none"
                    />
                </div>
            </div>

            <button onClick={criar} disabled={loading}
                className="py-2.5 text-sm font-medium bg-[#7c6ef0] text-white rounded-lg hover:bg-[#6358d4] disabled:opacity-40 cursor-pointer transition-colors shadow-sm">
                {loading ? "Salvando..." : "Criar"}
            </button>
        </div>
    )
}
