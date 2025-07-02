import React, { useState, useRef } from "react";
import Modal from "./Modal";
import * as d3 from "d3";

function ScatterChart({ data }) {
 
  const filteredPoints = data
    .filter((d) => d.magnitude >= 3.5)
    .map((d) => ({
      date: new Date(d.occurred_at),
      magnitude: d.magnitude,
      location: d.location,
    }));

  const width = 800;
  const height = 400;
  const margin = { top: 30, right: 30, bottom: 100, left: 80 };

  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);

  if (filteredPoints.length === 0)
    return <p>Gösterilecek veri yok (3.5 üzeri deprem yok).</p>;

  const locations = Array.from(new Set(filteredPoints.map((d) => d.location))).sort();
  const color = d3.scaleOrdinal(d3.schemeTableau10).domain(locations);


  const x = d3
    .scaleTime()
    .domain(d3.extent(filteredPoints, (d) => d.date))
    .nice()
    .range([margin.left, width - margin.right]);


  const y = d3
    .scaleLinear()
    .domain([3.5, d3.max(filteredPoints, (d) => d.magnitude)])
    .nice()
    .range([height - margin.bottom, margin.top]);


  const handleMouseOver = (event, d) => {
    const [xPosRaw, yPosRaw] = d3.pointer(event, svgRef.current);
    const tooltipWidth = 250;
    const tooltipHeight = 110;

    let left = xPosRaw + 15;
    if (left + tooltipWidth > width) left = xPosRaw - tooltipWidth - 15;
    if (left < 0) left = 5;

    let top = yPosRaw - tooltipHeight / 2;
    if (top < 0) top = 10;
    if (top + tooltipHeight > height) top = height - tooltipHeight - 10;

    setTooltip({
      x: left,
      y: top,
      date: d3.timeFormat("%Y-%m-%d %H:%M")(d.date),
      magnitude: d.magnitude,
      location: d.location,
      color: color(d.location),
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={width} height={height} style={{ userSelect: "none" }}>
        {/* X Ekseni */}
        <g
          transform={`translate(0,${height - margin.bottom})`}
          fill="none"
          stroke="black"
          fontSize="12"
        >
          {x.ticks(d3.timeDay.every(1)).map((tick) => (
            <text
              key={tick}
              x={x(tick)}
              y={55}
              textAnchor="middle"
              fill="black"
              style={{ fontSize: 10, writingMode: "vertical-rl" }}
            >
              {d3.timeFormat("%Y-%m-%d")(tick)}
            </text>
          ))}
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={0}
            y2={0}
            stroke="black"
          />
        </g>

        {/* Y Ekseni */}
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
              {tick.toFixed(1)}
            </text>
          ))}
          <line
            x1={0}
            x2={0}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="black"
          />
        </g>

        {/* Veri Noktaları */}
        {filteredPoints.map((d, i) => (
          <circle
            key={i}
            cx={x(d.date)}
            cy={y(d.magnitude)}
            r={6}
            fill={color(d.location)}
            stroke="white"
            strokeWidth={1.5}
            style={{ cursor: "pointer", transition: "r 0.2s ease" }}
            onMouseOver={(e) => {
              e.currentTarget.setAttribute("r", 9);
              handleMouseOver(e, d);
            }}
            onMouseOut={(e) => {
              e.currentTarget.setAttribute("r", 6);
              handleMouseOut();
            }}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: tooltip.color,
            color: "white",
            padding: "10px 14px",
            borderRadius: "6px",
            pointerEvents: "none",
            fontSize: "14px",
            maxWidth: "250px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            zIndex: 10,
            boxShadow: `0 0 10px ${tooltip.color}`,
            fontWeight: "600",
          }}
        >
          <div>
            <strong>Tarih:</strong> {tooltip.date}
          </div>
          <div>
            <strong>Büyüklük:</strong> {tooltip.magnitude}
          </div>
          <div>
            <strong>Yer:</strong> {tooltip.location}
          </div>
        </div>
      )}

      {/* Legend */}
<div
  style={{
    marginTop: 20,
    maxHeight: 300,
    overflowY: "auto",
    padding: "10px",
    borderTop: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f8f8f8",
  }}
>
  <h4 style={{ marginBottom: 10, fontWeight: 600 }}>Bölgeler:</h4>
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {locations.map((loc) => (
      <div
        key={loc}
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          userSelect: "none",
        }}
        title={loc}
      >
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 16,
            backgroundColor: color(loc),
            borderRadius: 3,
            marginRight: 8,
            boxShadow: `0 0 3px ${color(loc)}`,
          }}
        />
        {loc}
      </div>
    ))}
  </div>
</div>
    </div>
  );
}

export default function HistogramModal({ visible, onClose, data }) {
  return (
    <Modal visible={visible} title="3.5+ Büyüklük Deprem Zaman ve Yer Dağılımı" onClose={onClose}>
      <ScatterChart data={data} />
    </Modal>
  );
}
