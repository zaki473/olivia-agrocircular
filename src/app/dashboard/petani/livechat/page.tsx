"use client";
import { useState } from "react";

const pesanAwal = [
  { id: 1, dari: "mereka", nama: "Ibu Siti Aminah", pesan: "Halo Pak, apakah Anda masih punya jerami padi?", waktu: "10:20" },
  { id: 2, dari: "saya", nama: "Saya", pesan: "Masih ada Ibu, sekitar 500 kg.", waktu: "10:22" },
  { id: 3, dari: "mereka", nama: "Ibu Siti Aminah", pesan: "Boleh ditukar dengan ampas tahu 200 kg?", waktu: "10:23" },
];

export default function LiveChatPage() {
  const [pesan, setPesan] = useState(pesanAwal);
  const [input, setInput] = useState("");

  const kirim = () => {
    if (!input.trim()) return;
    setPesan([...pesan, { id: Date.now(), dari: "saya", nama: "Saya", pesan: input, waktu: "Baru" }]);
    setInput("");
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Live Chat</h1>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
        {/* Header chat */}
        <div className="bg-green-700 text-white p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-green-700 font-bold">S</div>
          <div>
            <p className="font-semibold text-sm">Ibu Siti Aminah</p>
            <p className="text-green-200 text-xs">Verified Farmer • Online</p>
          </div>
        </div>

        {/* Pesan */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {pesan.map((m) => (
            <div key={m.id} className={`flex ${m.dari === "saya" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                m.dari === "saya"
                  ? "bg-green-700 text-white rounded-br-none"
                  : "bg-white text-gray-700 border border-gray-100 rounded-bl-none shadow-sm"
              }`}>
                <p>{m.pesan}</p>
                <p className={`text-xs mt-1 ${m.dari === "saya" ? "text-green-200" : "text-gray-300"}`}>{m.waktu}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && kirim()}
            placeholder="Ketik pesan..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={kirim}
            className="bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition text-sm font-medium"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}