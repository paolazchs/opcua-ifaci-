"use client"
import { useState } from "react"
import Header from "../components/Header"
import CriarDispositivo from "./CriarDispositivo"
import ListarDispositivos from "./ListarDispositivos"

export default function Devices() {
    const [refresh, setRefresh] = useState(0)

    return (
        <div className="min-h-screen bg-[#f4f0fa]">
            <Header name="Dispositivos" />
            <div className="flex gap-8 p-8 items-start">
                <CriarDispositivo onCriado={() => setRefresh(r => r + 1)} />
                <ListarDispositivos refresh={refresh} />
            </div>
        </div>
    )
}
