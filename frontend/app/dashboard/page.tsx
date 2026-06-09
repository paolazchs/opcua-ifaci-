"use client"
import { useState, useEffect } from "react"
import Header from "../components/Header"

interface SensorData {
    id: number
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

export default function Dashboard() {
    const [historico, setHistorico] = useState<SensorData[]>([])
    const [ultimo, setUltimo] = useState<SensorData | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    const buscarDados = async () => {
        try {
            const res = await fetch("http://localhost:8080/iot")
            if (!res.ok) throw new Error()
            const json: SensorData[] = await res.json()
            setHistorico(json)
            if (json.length > 0) setUltimo(json[json.length - 1])
            setErro(null)
        } catch {
            setErro("Falha na comunicação com a API")
        }
    }

    useEffect(() => {
        buscarDados()
        const intervalo = setInterval(buscarDados, 2000)
        return () => clearInterval(intervalo)
    }, [])

    const cards = ultimo ? [
        { label: "Temperatura", valor: `${ultimo.temperatura?.toFixed(2)} °C`, bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
        { label: "Pressão", valor: `${ultimo.pressao?.toFixed(2)} bar`, bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" },
        { label: "Umidade", valor: `${ultimo.umidade?.toFixed(2)} %`, bg: "bg-[#d1fae5]", text: "text-[#059669]" },
        { label: "Presença", valor: ultimo.sensor_presenca ? "Acionado" : "Inativo", bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
        { label: "Trava", valor: ultimo.trava_seguranca ? "Travado" : "Livre", bg: "bg-[#ede9fe]", text: "text-[#7c3aed]" },
    ] : []

    return (
        <div className="min-h-screen bg-[#f4f0fa]">
            <Header name="Dashboard" />

            <div className="p-8 flex flex-col gap-8">

                {erro && <p className="text-sm text-[#f87171] font-medium">{erro}</p>}

                {ultimo && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {cards.map(c => (
                            <div key={c.label} className={`${c.bg} border border-white/60 rounded-xl p-4 shadow-sm`}>
                                <p className="text-xs text-[#6b7280] mb-1 font-medium">{c.label}</p>
                                <p className={`text-xl font-bold ${c.text}`}>{c.valor}</p>
                            </div>
                        ))}
                    </div>
                )}

                {historico.length === 0 && !erro && (
                    <p className="text-sm text-[#8b7bc8] text-center py-12">Aguardando dados...</p>
                )}

                {historico.length > 0 && (
                    <div className="bg-white border border-[#e8e0f0] rounded-xl overflow-x-auto shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#e8e0f0] bg-[#faf8ff]">
                                    {["ID", "Temp", "Pressão", "Umidade", "Presença", "Trava"].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#7c6ef0]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...historico].reverse().map((item, i) => (
                                    <tr key={item.id} className={`border-b border-[#f3f0fa] ${i === 0 ? "bg-[#ede9fe]/30" : ""}`}>
                                        <td className="px-4 py-2.5 text-[#8b7bc8]">{item.id}</td>
                                        <td className="px-4 py-2.5">{item.temperatura?.toFixed(2)}</td>
                                        <td className="px-4 py-2.5">{item.pressao?.toFixed(2)}</td>
                                        <td className="px-4 py-2.5">{item.umidade?.toFixed(2)}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs font-medium ${item.sensor_presenca ? "text-[#059669]" : "text-[#d1d5db]"}`}>
                                                {item.sensor_presenca ? "Sim" : "Não"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs font-medium ${item.trava_seguranca ? "text-[#dc2626]" : "text-[#059669]"}`}>
                                                {item.trava_seguranca ? "Sim" : "Não"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
