import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import * as d3 from "d3";

function BarChart({ data }) {

  const counts = d3.rollups(
    data,
    (v) => v.length,
    (d) => d.location
  );

  const sorted = counts.sort((a, b) => b[1] - a[1]).slice(0, 10); // top 10


  return (
    <div>
      <h4>Top 10 Location Deprem Sayısı</h4>
      <ul>
        {sorted.map(([loc, count]) => (
          <li key={loc}>
            {loc}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RegionModal({ visible, onClose, data }) {
  const [region, setRegion] = useState("");

 
  const filteredData = region
    ? data.filter((eq) =>
        eq.location.toLowerCase().includes(region.toLowerCase())
      )
    : data;

  useEffect(() => {
    if (!visible) setRegion("");
  }, [visible]);

  return (
    <Modal visible={visible} title="Bölge / İl Bazında Deprem Grafiği" onClose={onClose}>
      <div className="mb-4">
        <label htmlFor="regionInput" className="block font-semibold mb-2">
          Bölge veya İl adı yazınız:
        </label>
        <input
          id="regionInput"
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Marmara, Ege, İzmir, Doğu Anadolu..."
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      <BarChart data={filteredData} />
    </Modal>
  );
}
