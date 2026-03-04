import { useRef, useState } from 'react';
import Tooltip from './Tooltip';

const defaultDependencyChain = [
  {
    name: 'Certificate',
    descriptor: 'TLS trust anchor',
    icon: 'certificate',
    tooltip: 'The SSL/TLS certificate securing this endpoint.',
  },
  {
    name: 'Load Balancer',
    descriptor: 'Traffic distribution layer',
    icon: 'loadBalancer',
    tooltip: 'Distributes traffic across backend services.',
  },
  {
    name: 'API Gateway',
    descriptor: 'Policy and auth entrypoint',
    icon: 'gateway',
    tooltip: 'Handles authentication and routing.',
  },
  {
    name: 'Payment Service',
    descriptor: 'Transaction processing engine',
    icon: 'payment',
    tooltip: 'Processes payment transactions.',
  },
  {
    name: 'Checkout Flow',
    descriptor: 'Revenue-critical customer path',
    icon: 'checkout',
    tooltip: 'Customer-facing revenue path.',
  },
];

function NodeIcon({ type, impacted }) {
  const stroke = impacted ? '#D32F2F' : '#6B778C';
  if (type === 'certificate') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="11" height="8" rx="1.5" stroke={stroke} />
        <path d="M6 13l2-2 2 2V8H6v5z" stroke={stroke} fill="none" />
      </svg>
    );
  }
  if (type === 'loadBalancer') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2v3M3 8h10M5 13h6" stroke={stroke} />
        <circle cx="3" cy="8" r="1.5" stroke={stroke} />
        <circle cx="13" cy="8" r="1.5" stroke={stroke} />
      </svg>
    );
  }
  if (type === 'gateway') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke={stroke} />
        <path d="M6 8h4M8 6v4" stroke={stroke} />
      </svg>
    );
  }
  if (type === 'payment') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2.5" y="4" width="11" height="8" rx="1.5" stroke={stroke} />
        <path d="M2.5 7h11" stroke={stroke} />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke={stroke} />
      <path d="M5.5 8h5" stroke={stroke} />
    </svg>
  );
}

function ServiceImpactPath({
  simulationMode = false,
  dependencyChain = defaultDependencyChain,
  className = '',
}) {
  const containerRef = useRef(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });

  const handleMouseEnter = (event, node) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const nodeRect = event.currentTarget.getBoundingClientRect();
    if (containerRect) {
      setTooltipPos({
        left: nodeRect.left - containerRect.left + nodeRect.width / 2,
        top: nodeRect.top - containerRect.top - 8,
      });
    }
    setHoverNode({
      ...node,
      confidence: 87,
      revenueImpact: node.revenueImpact || '1.2M',
    });
  };

  return (
    <section
      ref={containerRef}
      className={`relative rounded-enterprise border border-neutralBorder bg-white p-4 text-[#353535] ${className}`}
    >
      <Tooltip text="Confidence in the accuracy of dependency mapping.">
        <div className="mb-3 inline-flex rounded-full bg-[#F0F3F5] px-2.5 py-1 text-xs text-[#6B778C]">
          Impact Confidence: 87%
        </div>
      </Tooltip>
      <Tooltip text="Visual view of how this certificate impacts services and business flows.">
        <h3 className="mb-3 text-sm font-semibold text-[#353535]">Service Impact Path</h3>
      </Tooltip>
      <div>
        {dependencyChain.map((node, index) => {
          const impacted = simulationMode;
          const progressFill = simulationMode
            ? `${Math.round(((index + 1) / (dependencyChain.length - 1 || 1)) * 100)}%`
            : '0%';
          return (
            <div key={node.name} className="relative">
              <div className="relative w-fit max-w-full">
                <div
                  onMouseEnter={(event) => handleMouseEnter(event, node)}
                  onMouseLeave={() => setHoverNode(null)}
                  className={`rounded-enterprise border bg-white px-3 py-2.5 text-sm transition-all duration-200 ease-in-out hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)] ${
                    impacted
                      ? 'border-[#D32F2F] text-[#D32F2F]'
                      : 'border-[#E1E4E8] text-[#353535]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <NodeIcon type={node.icon} impacted={impacted} />
                    <div>
                      <p className="text-sm font-medium leading-5">{node.name}</p>
                      <p className="text-xs text-[#6B778C]">{node.descriptor}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        Revenue Impact: ${node.revenueImpact || '1.2M'}/day
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index < dependencyChain.length - 1 && (
                <div className="mb-2 ml-5 mt-0 h-2.5 w-px bg-[#E1E4E8]">
                  <div
                    className="w-px bg-[#D32F2F] transition-all duration-200 ease-in-out"
                    style={{ height: progressFill }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hoverNode && (
        <div
          className="pointer-events-none absolute z-30 w-[220px] -translate-x-1/2 -translate-y-full rounded-enterprise border border-neutralBorder bg-white p-2 text-xs text-[#353535] shadow-md"
          style={{ left: tooltipPos.left, top: tooltipPos.top }}
        >
          <div className="mb-1 font-semibold">{hoverNode.name}</div>
          <div>{simulationMode ? `${hoverNode.tooltip} This component will be impacted if the certificate becomes invalid.` : hoverNode.tooltip}</div>
          <div className="mt-1">Revenue impact: ${hoverNode.revenueImpact}/day</div>
          <div>Confidence: {hoverNode.confidence}%</div>
        </div>
      )}
    </section>
  );
}

export default ServiceImpactPath;
