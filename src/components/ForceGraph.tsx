import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { cancerData } from "../data/cancerData";

interface ForceGraphProps {
  activeStateId: string | null;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: "root" | "type" | "gender" | "stage" | "risk";
  val: number; // Node size/weight
  color: string;
  subText?: string;
  hasChildren?: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  color: string;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ activeStateId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const zoomRef = useRef<any>(null);
  
  // Track collapsed node IDs
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());

  // Toggle node collapse state
  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Zoom Button Handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 1.35);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 1 / 1.35);
    }
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Retrieve the current zoom transform to preserve it across render ticks
    const currentTransform = d3.zoomTransform(svgRef.current);

    // Reset SVG canvas children (preserves __zoom property on the SVG itself)
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 450;

    // Dynamic calculations depending on the currently selected state
    const stateDetail = activeStateId ? cancerData.states[activeStateId] : null;
    const activeLabel = stateDetail ? stateDetail.name : "National Overview";
    const totalCases = stateDetail ? stateDetail.incidence : cancerData.national.totalIncidence;

    // Helper to calculate estimated cases dynamically for each cancer type
    const getCancerStats = (id: string) => {
      let pct = 0.1;
      if (id === "breast") pct = 0.18;
      else if (id === "cervical") pct = 0.14;
      else if (id === "lung") pct = 0.11;
      else if (id === "oral") pct = 0.12;
      else if (id === "stomach") pct = 0.09;
      else if (id === "colorectal") pct = 0.08;

      if (stateDetail) {
        const commonStr = stateDetail.mostCommon.toLowerCase();
        if (commonStr.includes(id)) {
          pct += 0.06; // Boost cases for the most common cancer in selected state
        }
      }
      const cases = Math.round(totalCases * pct);
      return {
        cases,
        pct: Math.round(pct * 100)
      };
    };

    const breastStats = getCancerStats("breast");
    const cervicalStats = getCancerStats("cervical");
    const lungStats = getCancerStats("lung");
    const oralStats = getCancerStats("oral");
    const stomachStats = getCancerStats("stomach");
    const colorectalStats = getCancerStats("colorectal");

    // Base nodes definition containing display labels and calculated case numbers
    const baseNodes: GraphNode[] = [
      // Root Node
      { 
        id: "root", 
        label: activeLabel, 
        group: "root", 
        val: 26, 
        color: "#00f0ff", 
        subText: `${totalCases.toLocaleString()} cases`,
        hasChildren: true 
      },
      
      // Cancer Types (First Level)
      { id: "breast", label: "Breast Cancer", group: "type", val: 18, color: "#ec4899", subText: `${breastStats.cases.toLocaleString()} (${breastStats.pct}%)`, hasChildren: true },
      { id: "cervical", label: "Cervical Cancer", group: "type", val: 16, color: "#8b5cf6", subText: `${cervicalStats.cases.toLocaleString()} (${cervicalStats.pct}%)`, hasChildren: true },
      { id: "lung", label: "Lung Cancer", group: "type", val: 15, color: "#f43f5e", subText: `${lungStats.cases.toLocaleString()} (${lungStats.pct}%)`, hasChildren: true },
      { id: "oral", label: "Oral Cancer", group: "type", val: 14, color: "#ffb703", subText: `${oralStats.cases.toLocaleString()} (${oralStats.pct}%)`, hasChildren: true },
      { id: "stomach", label: "Stomach Cancer", group: "type", val: 13, color: "#3b82f6", subText: `${stomachStats.cases.toLocaleString()} (${stomachStats.pct}%)`, hasChildren: true },
      { id: "colorectal", label: "Colorectal", group: "type", val: 12, color: "#10b981", subText: `${colorectalStats.cases.toLocaleString()} (${colorectalStats.pct}%)`, hasChildren: true },
      
      // Gender Nodes (Second Level)
      { id: "male", label: "Male Demographics", group: "gender", val: 14, color: "#007eff", subText: `${Math.round(totalCases * 0.48).toLocaleString()} (48%)` },
      { id: "female", label: "Female Demographics", group: "gender", val: 14, color: "#ec4899", subText: `${Math.round(totalCases * 0.52).toLocaleString()} (52%)` },
      
      // Stage Nodes (Third Level)
      { id: "stage_early", label: "Stage I & II (Early)", group: "stage", val: 12, color: "#00ff66", subText: `${Math.round(totalCases * 0.35).toLocaleString()} (35%)` },
      { id: "stage_late", label: "Stage III & IV (Late)", group: "stage", val: 12, color: "#ff5e00", subText: `${Math.round(totalCases * 0.65).toLocaleString()} (65%)` },
      
      // Risk Etiology Nodes (Fourth Level)
      { id: "risk_tobacco", label: "Etiology: Tobacco", group: "risk", val: 11, color: "#ef4444", subText: `${Math.round(totalCases * 0.35).toLocaleString()} (35%)` },
      { id: "risk_diet", label: "Etiology: Diet/Obesity", group: "risk", val: 10, color: "#eab308", subText: `${Math.round(totalCases * 0.15).toLocaleString()} (15%)` },
      { id: "risk_viral", label: "Etiology: Viral (HPV)", group: "risk", val: 10, color: "#a855f7", subText: `${Math.round(totalCases * 0.12).toLocaleString()} (12%)` }
    ];

    // Base links with parent-to-child direction (important for BFS reachability)
    const baseLinks: GraphLink[] = [
      // Connect Root to Cancer Types
      { source: "root", target: "breast", color: "rgba(0, 240, 255, 0.2)" },
      { source: "root", target: "cervical", color: "rgba(0, 240, 255, 0.2)" },
      { source: "root", target: "lung", color: "rgba(0, 240, 255, 0.2)" },
      { source: "root", target: "oral", color: "rgba(0, 240, 255, 0.2)" },
      { source: "root", target: "stomach", color: "rgba(0, 240, 255, 0.2)" },
      { source: "root", target: "colorectal", color: "rgba(0, 240, 255, 0.2)" },

      // Connect Types to Gender
      { source: "breast", target: "female", color: "rgba(236, 72, 153, 0.25)" },
      { source: "cervical", target: "female", color: "rgba(139, 92, 246, 0.25)" },
      { source: "lung", target: "male", color: "rgba(244, 63, 94, 0.25)" },
      { source: "lung", target: "female", color: "rgba(244, 63, 94, 0.15)" },
      { source: "oral", target: "male", color: "rgba(255, 183, 3, 0.25)" },
      { source: "stomach", target: "male", color: "rgba(59, 130, 246, 0.25)" },
      { source: "colorectal", target: "male", color: "rgba(16, 185, 129, 0.2)" },
      { source: "colorectal", target: "female", color: "rgba(16, 185, 129, 0.2)" },

      // Connect Types to Stages
      { source: "breast", target: "stage_early", color: "rgba(0, 255, 102, 0.2)" },
      { source: "cervical", target: "stage_late", color: "rgba(255, 94, 0, 0.2)" },
      { source: "lung", target: "stage_late", color: "rgba(255, 94, 0, 0.2)" },
      { source: "oral", target: "stage_late", color: "rgba(255, 94, 0, 0.2)" },

      // Connect Types to Risks (directed downstream)
      { source: "lung", target: "risk_tobacco", color: "rgba(239, 68, 68, 0.3)" },
      { source: "oral", target: "risk_tobacco", color: "rgba(239, 68, 68, 0.3)" },
      { source: "colorectal", target: "risk_diet", color: "rgba(234, 179, 8, 0.25)" },
      { source: "stomach", target: "risk_diet", color: "rgba(234, 179, 8, 0.25)" },
      { source: "cervical", target: "risk_viral", color: "rgba(168, 85, 247, 0.3)" }
    ];

    // Compute active visible nodes and links based on collapsed states
    const activeNodes = new Set<string>(["root"]);
    const queue = ["root"];
    while (queue.length > 0) {
      const current = queue.shift()!;
      // Do not traverse children if node is collapsed
      if (collapsedNodeIds.has(current)) continue;
      
      baseLinks.forEach(link => {
        const sId = typeof link.source === "object" ? (link.source as any).id : link.source;
        const tId = typeof link.target === "object" ? (link.target as any).id : link.target;
        
        if (sId === current) {
          if (!activeNodes.has(tId)) {
            activeNodes.add(tId);
            queue.push(tId);
          }
        }
      });
    }

    const filteredNodes = baseNodes.filter(n => activeNodes.has(n.id));
    const filteredLinks = baseLinks.filter(l => {
      const sId = typeof l.source === "object" ? (l.source as any).id : l.source;
      const tId = typeof l.target === "object" ? (l.target as any).id : l.target;
      return activeNodes.has(sId) && activeNodes.has(tId) && !collapsedNodeIds.has(sId);
    });

    // Deep copy nodes and links to satisfy D3 simulation modifiers safely
    const nodes: GraphNode[] = JSON.parse(JSON.stringify(filteredNodes));
    const links: GraphLink[] = JSON.parse(JSON.stringify(filteredLinks));

    // Update labels with expand/collapse indicators for nodes that have children
    nodes.forEach(node => {
      if (node.hasChildren) {
        const isCollapsed = collapsedNodeIds.has(node.id);
        node.label = `${isCollapsed ? "⊞" : "⊟"} ${node.label}`;
      }
    });

    // Boost the size of the most common cancer in the selected state
    if (stateDetail) {
      const commonStr = stateDetail.mostCommon.toLowerCase();
      nodes.forEach(node => {
        if (node.group === "type" && commonStr.includes(node.id)) {
          node.val = 25; // Boost size significantly
          node.color = "#00f0ff"; // Glow cyan
        }
      });
    }

    // Recover positions from nodesRef.current to prevent flickering jumps
    // If a node was recently expanded (not in nodesRef.current), sprout it from its parent's coordinates
    nodes.forEach(node => {
      const prev = nodesRef.current.find(pn => pn.id === node.id);
      if (prev) {
        node.x = prev.x;
        node.y = prev.y;
        node.vx = prev.vx;
        node.vy = prev.vy;
      } else {
        // Find parent position to sprout from
        const parentLink = baseLinks.find(l => {
          const tId = typeof l.target === "object" ? (l.target as any).id : l.target;
          return tId === node.id;
        });
        if (parentLink) {
          const pId = typeof parentLink.source === "object" ? (parentLink.source as any).id : parentLink.source;
          const parentNode = nodesRef.current.find(pn => pn.id === pId);
          if (parentNode) {
            node.x = parentNode.x;
            node.y = parentNode.y;
            node.vx = 0;
            node.vy = 0;
          }
        }
      }
    });

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    // Add glowing filter to defs
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "hud-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
      
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");
      
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Append zoom-group wrapper
    const zoomGroup = svg.append("g").attr("class", "zoom-group");

    // Setup zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });
    
    svg.call(zoom as any)
       .on("dblclick.zoom", null); // Disable double click to zoom to reserve for click behaviors
    
    zoomRef.current = zoom;

    // Restore previous zoom transform to prevent jumping on state/collapse update
    svg.call(zoom.transform as any, currentTransform);

    // Initialize D3 Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(width < 450 ? 65 : 85)
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => d.val * 1.6));

    // Render Link lines
    const link = zoomGroup.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.2)
      .attr("class", "transition-all duration-300");

    // Render Nodes (g element containing circle + text)
    const node = zoomGroup.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .on("click", (event, d) => {
        // Prevent click trigger if the user was dragging the node
        if (event.defaultPrevented) return;
        toggleCollapse(d.id);
      })
      .on("mouseenter", (event, d) => {
        // Highlight hovered node, its links, and direct neighbors natively in D3
        // Reference event to prevent TS unused warning
        if (event) { /* no-op */ }
        const neighborIds = new Set<string>([d.id]);
        
        link
          .attr("stroke-width", l => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            const isConnected = sId === d.id || tId === d.id;
            if (isConnected) {
              neighborIds.add(sId);
              neighborIds.add(tId);
              return 3.0; // Thicker active line
            }
            return 0.7; // Thinned inactive line
          })
          .attr("stroke-opacity", l => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            return (sId === d.id || tId === d.id) ? 1.0 : 0.12;
          })
          .attr("filter", l => {
            const sId = typeof l.source === "object" ? l.source.id : l.source;
            const tId = typeof l.target === "object" ? l.target.id : l.target;
            return (sId === d.id || tId === d.id) ? "url(#hud-glow)" : "none"; // Apply cyber glow
          });

        node.each(function(n) {
          const isSelf = n.id === d.id;
          const isNeighbor = neighborIds.has(n.id);
          const selection = d3.select(this);
          
          selection.select("circle")
            .attr("stroke-width", isSelf ? 2.8 : isNeighbor ? 2.0 : 0.8)
            .attr("fill-opacity", isSelf ? 0.35 : isNeighbor ? 0.25 : 0.05)
            .attr("filter", isNeighbor ? "url(#hud-glow)" : "none");
            
          selection.selectAll("text tspan")
            .attr("fill-opacity", isSelf ? 1.0 : isNeighbor ? 0.85 : 0.22);
        });
      })
      .on("mouseleave", () => {
        // Restore standard console states for all links
        link
          .attr("stroke-width", 1.2)
          .attr("stroke-opacity", 0.6)
          .attr("filter", "none");
          
        // Restore standard console states for all nodes
        node.each(function(n) {
          const selection = d3.select(this);
          selection.select("circle")
            .attr("stroke-width", 1.5)
            .attr("fill-opacity", n.group === "root" ? 0.25 : 0.15)
            .attr("filter", "url(#hud-glow)");
            
          selection.select("text tspan:first-child").attr("fill-opacity", 0.65);
          selection.select("text tspan:last-child").attr("fill-opacity", 0.95);
        });
      })
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Draw neon glowing circles
    node.append("circle")
      .attr("r", d => d.val)
      .attr("fill", d => d.color)
      .attr("fill-opacity", d => d.group === "root" ? 0.25 : 0.15)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#hud-glow)")
      .attr("class", "transition-all duration-300");

    // Inner core dot
    node.append("circle")
      .attr("r", 3)
      .attr("fill", d => d.color)
      .attr("fill-opacity", 0.95);

    // Multiline Label Texts (Label + Subtext numbers)
    const textGroup = node.append("text")
      .attr("font-family", "Share Tech Mono, monospace")
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.val + 11)
      .attr("style", "pointer-events: none;")
      .attr("class", "transition-all duration-200");

    textGroup.append("tspan")
      .text(d => d.label)
      .attr("x", 0)
      .attr("font-size", d => d.group === "root" ? "10px" : "8.5px")
      .attr("fill-opacity", 0.65)
      .attr("font-weight", "bold");

    textGroup.append("tspan")
      .text(d => d.subText || "")
      .attr("x", 0)
      .attr("dy", "10px")
      .attr("font-size", "7.5px")
      .attr("fill", d => d.color)
      .attr("fill-opacity", 0.95);

    // Tick callback for simulation updates
    simulation.on("tick", () => {
      // Keep track of current coordinate arrays to feed back into state transition frames
      nodesRef.current = nodes;

      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("transform", d => `translate(${d.x!}, ${d.y!})`);
    });

    // D3 Drag Event Handlers
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target).attr("cursor", "grabbing");
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = Math.max(d.val, Math.min(width - d.val, event.x));
      d.fy = Math.max(d.val, Math.min(height - d.val, event.y));
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target).attr("cursor", "grab");
    }

    // Resize Handler using ResizeObserver to support split-pane resizing dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height || 450;
        
        svg.attr("width", w)
           .attr("height", h)
           .attr("viewBox", `0 0 ${w} ${h}`);
        
        simulation.force("center", d3.forceCenter(w / 2, h / 2));
        simulation.alpha(0.15).restart();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, [activeStateId, collapsedNodeIds]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* HUD background grid overlay */}
      <div className="absolute inset-0 hud-dots-bg opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 border border-brand-border/10 pointer-events-none" />
      
      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full overflow-visible" />
      
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-30 font-mono">
        <button
          onClick={handleZoomIn}
          className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-xs font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
          title="Zoom In"
        >
          ＋
        </button>
        <button
          onClick={handleZoomOut}
          className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-xs font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
          title="Zoom Out"
        >
          －
        </button>
        <button
          onClick={handleZoomReset}
          className="w-6 h-6 flex items-center justify-center bg-brand-dark/80 border border-brand-cyan/35 text-brand-cyan text-[10px] font-bold rounded hover:bg-brand-cyan/20 active:scale-95 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer"
          title="Reset View"
        >
          ⟲
        </button>
      </div>

      {/* Navigation Legend */}
      <div className="absolute bottom-3 left-3 bg-[#010915]/85 border border-brand-cyan/15 rounded p-2 z-20 font-mono text-[8px] text-left pointer-events-none select-none max-w-xs shadow-md shadow-brand-cyan/5">
        <div className="text-brand-cyan/55 font-bold uppercase tracking-wider mb-1">Navigation Legend</div>
        <div className="flex flex-col gap-1 text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="text-brand-cyan">●</span>
            <span>Drag to reposition nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-brand-cyan">●</span>
            <span>Scroll/Pinch to zoom and pan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-brand-green">⊞ / ⊟</span>
            <span>Click node to expand/collapse</span>
          </div>
        </div>
      </div>
      
      {/* Technical HUD details */}
      <div className="absolute bottom-2 right-2 text-[7px] font-mono text-brand-cyan/35 select-none pointer-events-none">
        SIMUL_MODE: FORCE_DIRECTED_v7.3 // NODES: {nodesRef.current.length}
      </div>
      <div className="absolute top-2 left-2 text-[7px] font-mono text-brand-cyan/35 select-none pointer-events-none">
        PHYSICS: ACTIVE
      </div>
    </div>
  );
};

export default ForceGraph;

