import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import * as d3 from "d3";

function PieChart({ data }) {
  const ref = useRef();

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  useEffect(() => {
    if (!data.length) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);
    const arcHover = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).transition().duration(200).attr("d", arcHover);
        setTooltip({
          visible: true,
          x: event.clientX + 10,
          y: event.clientY + 10,
          content: `<strong>${d.data.name}</strong><br/>${d.data.value} deprem`,
        });
      })
      .on("mousemove", (event) => {
        setTooltip((t) => ({ ...t, x: event.clientX + 10, y: event.clientY + 10 }));
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).transition().duration(200).attr("d", arc);
        setTooltip({ visible: false, x: 0, y: 0, content: "" });
      });
  }, [data]);

  return (
    <>
      <svg ref={ref}></svg>
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "#333",
            color: "#fff",
            padding: "6px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 0 8px rgba(0,0,0,0.6)",
            userSelect: "none",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </>
  );
}

export default function RegionModal({ visible, onClose, data }) {
  const [region, setRegion] = useState("");

  const countsMap = new Map();

  const filteredData = region
    ? data.filter((eq) => eq.location.toLowerCase().includes(region.toLowerCase()))
    : data;

  filteredData.forEach((d) => {
    countsMap.set(d.location, (countsMap.get(d.location) || 0) + 1);
  });

  const sorted = [...countsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  useEffect(() => {
    if (!visible) setRegion("");
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} title="Bölge / İl Bazında Deprem Grafiği" onClose={onClose}>
      <div className="mb-4">
        <label
          htmlFor="regionInput"
          className="block font-semibold mb-4 text-gray-800"
        >
          Bölge veya İl adı yazınız:
        </label>
        <input
          id="regionInput"
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Marmara, Ege, İzmir, Doğu Anadolu..."
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow border border-gray-200 max-h-80 overflow-y-auto w-full">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Top 10 Bölge / İl Deprem Sayısı
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {sorted.map(({ name, value }) => (
              <li
                key={name}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span className="font-medium">{name}</span>: {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-center w-full">
          {sorted.length > 0 ? (
            <PieChart data={sorted} />
          ) : (
            <p className="text-gray-500 italic">Gösterilecek veri yok.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
