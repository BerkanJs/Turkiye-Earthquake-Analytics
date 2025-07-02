import React, { useState, useMemo, useRef } from "react";
import * as d3 from "d3";

export default function MagnitudeOverTimeModal({ data = [], onClose }) {
  /* -------------------- UI state -------------------- */
  const [regionFilter, setRegionFilter] = useState("");
  const [tooltip, setTooltip]   = useState({ show: false, x: 0, y: 0, html: "" });
  const svgRef = useRef();

  /* -------------------- filtrelenmiş veri -------------------- */
  const filteredData = useMemo(() => {
    if (!regionFilter.trim()) return [];
    return data.filter(eq =>
      eq.location.toLowerCase().includes(regionFilter.toLowerCase())
    );
  }, [regionFilter, data]);

  /* -------------------- ölçekler -------------------- */
  const width  = 700;
  const height = 400;
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.depth) || 10])
    .nice()
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([
      d3.min(filteredData, d => d.magnitude) || 3,
      d3.max(filteredData, d => d.magnitude) || 6,
    ])
    .nice()
    .range([height - margin.bottom, margin.top]);

  /* -------------------- tooltip helpers -------------------- */
  const showTip = (event, d) => {
    const tooltipWidth  = 200;
    const tooltipHeight = 90;

    // koordinatı viewport’a göre hesapla
    let x = event.clientX + 12;
    let y = event.clientY + 12;

    // sağ‑sol / üst‑alt taşma kontrolleri
    if (x + tooltipWidth > window.innerWidth)  x = event.clientX - tooltipWidth - 12;
    if (y + tooltipHeight > window.innerHeight) y = event.clientY - tooltipHeight - 12;

    const html = `
      <strong>${d.location}</strong><br/>
      Tarih&nbsp;: ${new Date(d.occurred_at).toLocaleString()}<br/>
      Büyüklük&nbsp;: ${d.magnitude}<br/>
      Derinlik&nbsp;: ${d.depth} km
    `;

    setTooltip({ show: true, x, y, html });
  };

  const hideTip = () => setTooltip(prev => ({ ...prev, show: false }));

  /* -------------------- render -------------------- */
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,.55)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999, padding: "1rem",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 10,
        padding: "1.5rem",
        width: "750px",
        maxWidth: "95vw",
        maxHeight: "95vh",
        overflowY: "auto",
        display: "flex", flexDirection: "column"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Bölgeye Göre Derinlik‑Büyüklük Grafiği</h2>

        <label htmlFor="regionInput" style={{ fontWeight: 600 }}>Bölge adı:</label>
        <input
          id="regionInput"
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          placeholder="Örn: Bursa, Ege, Adana…"
          style={{
            margin: "8px 0 20px",
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        {filteredData.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>Gösterilecek grafik yok. Lütfen bir bölge girin.</p>
        ) : (
          <svg ref={svgRef} width={width} height={height}>

            {/* X ekseni */}
            <g transform={`translate(0,${height - margin.bottom})`}>
              <line x1={margin.left} x2={width - margin.right} stroke="#000"/>
              {xScale.ticks(6).map(t => (
                <g key={t} transform={`translate(${xScale(t)},0)`}>
                  <line y2="6" stroke="#000"/>
                  <text y="20" textAnchor="middle" fontSize="12">{t} km</text>
                </g>
              ))}
              <text
                x={(width + margin.left - margin.right) / 2}
                y="40"
                textAnchor="middle"
                fontSize="14" fontWeight={600}
              >
                Derinlik (km)
              </text>
            </g>

            {/* Y ekseni */}
            <g transform={`translate(${margin.left},0)`}>
              <line y1={margin.top} y2={height - margin.bottom} stroke="#000"/>
              {yScale.ticks(6).map(t => (
                <g key={t} transform={`translate(0,${yScale(t)})`}>
                  <line x2="-6" stroke="#000"/>
                  <text x="-10" dy=".32em" textAnchor="end" fontSize="12">{t}</text>
                </g>
              ))}
              <text
                x={-height / 2}
                y={-40}
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize="14" fontWeight={600}
              >
                Büyüklük (Mw)
              </text>
            </g>

            {/* Veri noktaları */}
            {filteredData.map((d, i) => (
              <circle
                key={i}
                cx={xScale(d.depth)}
                cy={yScale(d.magnitude)}
                r={5}
                fill="#3182ce"
                stroke="#fff"
                onMouseEnter={e => showTip(e, d)}
                onMouseMove={e => showTip(e, d)}
                onMouseLeave={hideTip}
                style={{ cursor: "pointer" }}
              />
            ))}
          </svg>
        )}

        {/* Tooltip */}
        {tooltip.show && (
          <div style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "rgba(51,51,51,.9)",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.4,
            zIndex: 10000,
            pointerEvents: "none",
            maxWidth: 240,
            boxShadow: "0 2px 6px rgba(0,0,0,.4)",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.html }}
          />
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "1.5rem",
            alignSelf: "flex-end",
            background: "#3182ce",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
