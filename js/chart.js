const data = [
  {
    event: "2022 FIFA World Cup Qualifier",
    impact: 1,
    description: "International FIFA qualifying match hosted in Hamilton."
  },
  {
    event: "2022 NHL Heritage Classic",
    impact: 5,
    description: "Outdoor NHL showcase event attracting national tourism activity."
  },
  {
    event: "2022 ISU World Synchronized Skating Championship",
    impact: 2,
    description: "International synchronized skating championship event."
  },
  {
    event: "2023 Canadian Country Music Awards",
    impact: 12,
    description: "National music awards event supporting tourism and hospitality sectors."
  },
  {
    event: "2023 Grey Cup",
    impact: 72.5,
    description: "Major national sporting event generating significant visitor spending."
  },
  {
    event: "2024 RBC Canadian Open",
    impact: 66,
    description: "International golf tournament hosted in Hamilton."
  },
  {
    event: "2026 JUNO Awards",
    impact: 12,
    description: "National music awards event with projected economic impact."
  }
];

// =====================================
// DIMENSIONS
// =====================================

const margin = {
  top: 20,
  right: 240,
  bottom: 30,
  left: 40
};

const width = 700 - margin.left - margin.right;
const height = 420 - margin.top - margin.bottom;

// =====================================
// SVG
// =====================================

const svg = d3.select("#chart")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
  )
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// =====================================
// SVG BACKGROUND
// =====================================

svg.append("rect")
  .attr("x", -margin.left)
  .attr("y", -margin.top)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("fill", "#ffffff")
  .attr("rx", 18)
  .attr("ry", 18);

// =====================================
// TOOLTIP
// =====================================

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// =====================================
// TOTAL
// =====================================

const total = d3.sum(data, d => d.impact);

// =====================================
// SCALE
// =====================================

const y = d3.scaleLinear()
  .domain([0, total])
  .range([height, 0]);

// =====================================
// COLORS
// =====================================

const color = d3.scaleOrdinal([
  "#2f6ea5",
  "#2563eb",
  "#0ea5a4",
  "#16a34a",
  "#0891b2",
  "#1d4ed8",
  "#0f766e"
]);

// =====================================
// STACK POSITIONS
// =====================================

let cumulative = 0;

data.forEach(d => {

  d.y0 = cumulative;
  cumulative += d.impact;
  d.y1 = cumulative;

});

// =====================================
// BAR SETTINGS
// =====================================

const barX = 120;
const barWidth = 110;

// =====================================
// SEGMENTS
// =====================================

const segments = svg.selectAll(".segment-group")
  .data(data)
  .enter()
  .append("g");

// =====================================
// RECTANGLES
// =====================================

segments.append("rect")
  .attr("class", "segment")
  .attr("x", barX)

  .attr("y", height)
  .attr("width", barWidth)
  .attr("height", 0)

  .attr("rx", 12)
  .attr("ry", 12)

  .attr("fill", (d, i) => color(i))

  .transition()
  .duration(1000)
  .ease(d3.easeCubicOut)

  .attr("y", d => y(d.y1))
  .attr("height", d => y(d.y0) - y(d.y1));

// =====================================
// EVENT LABELS
// =====================================

segments.append("text")
  .attr("class", "event-label")

  .attr("x", barX + barWidth + 18)

  .attr("y", d => (y(d.y0) + y(d.y1)) / 2 - 8)

  .style("font-size", "13px")
  .style("font-weight", "700")
  .style("fill", "#1e293b")

  .style("opacity", 0)

  .text(d => d.event)

  .transition()
  .delay(700)
  .duration(500)
  .style("opacity", 1);

// Secondary impact label
segments.append("text")
  .attr("class", "event-subtext")

  .attr("x", barX + barWidth + 18)

  .attr("y", d => (y(d.y0) + y(d.y1)) / 2 + 12)

  .style("font-size", "12px")
  .style("fill", "#64748b")

  .style("opacity", 0)

  .text(d => `$${d.impact}M Economic Impact`)

  .transition()
  .delay(850)
  .duration(500)
  .style("opacity", 1);

// =====================================
// VALUE LABELS
// =====================================

segments.append("text")
  .attr("class", "impact-label")

  .attr("x", barX + (barWidth / 2))

  .attr("y", d => (y(d.y0) + y(d.y1)) / 2)

  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")

  .style("font-size", d => {

    if (d.impact >= 50) return "16px";
    if (d.impact >= 10) return "13px";

    return "11px";

  })

  .style("font-weight", "700")

  .style("fill", "white")

  .style("opacity", 0)

  .text(d => `$${d.impact}M`)

  .transition()
  .delay(900)
  .duration(500)
  .style("opacity", 1);

// =====================================
// TOOLTIP
// =====================================

segments
  .on("mouseover", function(event, d) {

    tooltip
      .style("opacity", 1)
      .html(`
        <strong>${d.event}</strong><br/>
        Economic Impact: $${d.impact}M<br/><br/>
        ${d.description}
      `);

  })
  .on("mousemove", function(event) {

    tooltip
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 28) + "px");

  })
  .on("mouseout", function() {

    tooltip.style("opacity", 0);

  });
