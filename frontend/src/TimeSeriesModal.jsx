import React, { useRef, useState } from "react";
import * as d3 from "d3";

/* ----------  G R A F İ K   K O M P O N E N T İ  ---------- */
function TimeSeriesChart({ data }) {
  const parseDate = d3.timeParse("%Y-%m-%d");

  /* 1) GÜNLÜK ÖZET (count + maxMag) */
  const dailyStats = d3.rollups(
    data,
    (v) => ({
      count: v.length,
      maxMag: d3.max(v, (d) => d.magnitude),
    }),
    (d) => d.occurred_at.slice(0, 10)
  );

  /* 2) TARİHLERİ DÜZENLE ve SIRALA */
  const allDays = dailyStats
    .map(([dateStr, { count, maxMag }]) => {
      const date = parseDate(dateStr);
      date.setHours(0, 0, 0, 0);
      return { date, count, maxMag };
    })
    .sort((a, b) => a.date - b.date);

  /* 3) SADECE SON ≤5 GÜNÜ AL */
  const counts = allDays.slice(Math.max(allDays.length - 5, 0));

  if (counts.length === 0) return <p>Gösterilecek veri yok.</p>;

  /* --- Ölçekler ve çizim parametreleri --- */
  const width = 1000;
  const height = 450;
  const margin = { top: 30, right: 90, bottom: 70, left: 90 };

  const x = d3
    .scaleTime()
    .domain(d3.extent(counts, (d) => d.date))
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(counts, (d) => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.count))
    .curve(d3.curveMonotoneX);

  /* --- Tooltip state --- */
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef();

  const handleMouseOver = (event, d) => {
    const [xPos, yPos] = d3.pointer(event, svgRef.current);
    const tooltipW = 220;
    const tooltipH = 150;

    let left = xPos + 15;
    if (left + tooltipW > width) left = xPos - tooltipW - 15;

    let top = yPos - 50;
    if (top < 0) top = yPos + 10;
    if (top + tooltipH > height) top = height - tooltipH - 10;

    setTooltip({
      x: left,
      y: top,
      date: d3.timeFormat("%Y-%m-%d")(d.date),
      count: d.count,
      maxMag: d.maxMag?.toFixed(1),
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ userSelect: "none" }}
      >
        {/* --- X ekseni --- */}
        <g
          transform={`translate(0,${height - margin.bottom})`}
          fill="none"
          stroke="black"
          fontSize="12"
        >
          {counts.map((d) => (
            <text
              key={d.date}
              x={x(d.date)}
              y={40}
              textAnchor="middle"
              fill="black"
              style={{ fontSize: 10, writingMode: "vertical-rl" }}
            >
              {d3.timeFormat("%Y-%m-%d")(d.date)}
            </text>
          ))}
        </g>

        {/* --- Y ekseni --- */}
        <g
          transform={`translate(${margin.left},0)`}
          fill="none"
          stroke="black"
          fontSize="12"
        >
          {y.ticks(6).map((tick) => (
            <text
              key={tick}
              x={-10}
              y={y(tick)}
              dy=".32em"
              textAnchor="end"
              fill="black"
            >
              {tick}
            </text>
          ))}
        </g>

        {/* --- Çizgi ve Noktalar --- */}
        <path d={line(counts)} fill="none" stroke="#3182ce" strokeWidth={3} />

        {counts.map((d, i) => (
          <circle
            key={i}
            cx={x(d.date)}
            cy={y(d.count)}
            r={6}
            fill="#3182ce"
            stroke="white"
            strokeWidth={2}
            style={{ cursor: "pointer" }}
            onMouseOver={(e) => handleMouseOver(e, d)}
            onMouseOut={() => setTooltip(null)}
          />
        ))}
      </svg>

      {/* --- Tooltip --- */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            pointerEvents: "none",
            fontSize: "14px",
            maxWidth: "220px",
            wordBreak: "break-word",
            zIndex: 10,
            maxHeight: "150px",
            overflowY: "auto",
            boxShadow: "0 0 8px rgba(0,0,0,0.5)",
          }}
        >
          <div>
            <strong>Tarih:</strong> {tooltip.date}
          </div>
          <div>
            <strong>Deprem Sayısı:</strong> {tooltip.count}
          </div>
          <div>
            <strong>Maks. Magnitüd:</strong> {tooltip.maxMag ?? "—"}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------  M O D A L   K O M P O N E N T İ  ---------- */
export default function TimeSeriesModal({ visible, onClose, data }) {
  const [region, setRegion] = useState("");

  const filteredData = region
    ? data.filter((d) =>
        d.location.toLowerCase().includes(region.trim().toLowerCase())
      )
    : [];

  return !visible ? null : (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: 20,
        zIndex: 10000,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          maxWidth: "98vw",
          maxHeight: "95vh",
          overflowY: "auto",
          padding: 30,
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          width: "1050px",
          position: "relative",
          marginTop: "30px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: 15 }}>
          {region
            ? `"${region}" Bölgesindeki Sismik Durum`
            : "Lütfen Bölge Seçiniz"}
        </h2>

        {/* Bölge filtresi */}
        <div style={{ marginBottom: 15 }}>
          <label
            htmlFor="region-input"
            style={{ marginRight: 8, fontWeight: "bold" }}
          >
            Bölge Seç:
          </label>
          <input
            id="region-input"
            type="text"
            placeholder="Bölge adı yazınız..."
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
        </div>

        {/* Grafik */}
        {region.trim() !== "" && (
          filteredData.length > 0 ? (
            <TimeSeriesChart data={filteredData} />
          ) : (
            <p>Seçilen bölgede deprem verisi bulunamadı.</p>
          )
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 25,
            padding: "10px 20px",
            backgroundColor: "#3182ce",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            float: "right",
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
