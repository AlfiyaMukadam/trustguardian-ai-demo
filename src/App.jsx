import { useEffect, useMemo, useRef, useState } from 'react';
import data from './data/mockData.json';
import ServiceImpactPath from './components/ServiceImpactPath';
import Tooltip from './components/Tooltip';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', chevron: false },
  { label: 'Inventory', icon: 'inventory', chevron: false },
  { label: 'Policies', icon: 'policies', chevron: true },
  { label: 'Integrations', icon: 'integrations', chevron: true },
  { label: 'Discovery & automation tools', icon: 'discovery', chevron: true },
  { label: 'Reporting', icon: 'reporting', chevron: true },
  { label: 'Account', icon: 'account', chevron: true },
];
const topTabs = ['Certificates', 'Endpoints', 'Enrollments'];
const TOOLTIP_TEXT = {
  enableTrustIntelligence:
    'Activates AI-powered risk scoring and contextual insights for the current inventory view.',
  highRiskBanner:
    'Certificates in production with elevated business impact risk. Click to focus on these items.',
  neutralRiskPanel: 'No significant elevated risks detected in the current view.',
  riskBadge:
    'Composite risk score calculated from expiry urgency, redundancy gaps, revenue criticality, and algorithm risk.',
  confidenceTooltip:
    'Confidence reflects reliability of metadata and completeness of risk context.',
  estimatedRiskReduction:
    'Estimated reduction in overall risk if top remediation actions are applied.',
  searchInput: 'Search certificates by common name in the active context.',
  businessUnitFilter: 'Filter certificates by responsible business unit.',
  sortDropdown: 'Sort certificates by risk, expiry, priority, or confidence.',
  savedViews: 'Save the current filter/sort state for quick recall.',
  simulateExpiry: 'Preview downstream service impact if this certificate were to expire.',
  simulationNode: 'Service potentially impacted under simulation.',
  quantumMode: 'Highlight certificates requiring post-quantum readiness planning.',
  quantumDot: 'Algorithm may require future migration for quantum safety.',
  quantumScoreCard: 'Shows how quantum-ready this set of certificates is.',
  migrationPriorityList: 'Certificates recommended for phased quantum migration.',
  showIntelligenceInsights: 'Show detailed AI risk analysis and service impact mapping.',
  serviceImpactPath: 'Visual view of how this certificate impacts services and business flows.',
  impactConfidenceChip: 'Confidence in the accuracy of dependency mapping.',
  aiCopilotToggle: 'Opens an in-page AI assistant panel for remediation actions.',
  autoFixTopRisks:
    'Apply recommended remediation for the highest-priority certificates in view.',
  previewFix: 'Preview risk reduction and business impact before applying remediation.',
  undoAction: 'Undo the last remediation action, restoring previous state.',
  exportCSV: 'Download visible inventory as a CSV file with current filters/sorts.',
  executiveView: 'Switch to business “executive” metrics instead of technical metrics.',
};

function SidebarIcon({ type }) {
  if (type === 'dashboard') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'inventory') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" />
        <path d="M1.5 6h13M1.5 9.5h13" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'policies') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5l5.5 2v4.5c0 3-2.2 5.6-5.5 6.5-3.3-.9-5.5-3.5-5.5-6.5V3.5l5.5-2z" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'integrations') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="3" cy="8" r="1.5" stroke="currentColor" />
        <circle cx="13" cy="3" r="1.5" stroke="currentColor" />
        <circle cx="13" cy="13" r="1.5" stroke="currentColor" />
        <path d="M4.5 8h4M10.5 4.5L8.5 7M10.5 11.5L8.5 9" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'discovery') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'reporting') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 14h12M4 14V8M8 14V5M12 14V2" stroke="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="6" r="3" stroke="currentColor" />
      <path d="M3 14c.7-2 2.5-3 5-3s4.3 1 5 3" stroke="currentColor" />
    </svg>
  );
}

function StatCard({ label, value, color, riskVersion, onClick, active = false }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!riskVersion) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 450);
    return () => clearTimeout(id);
  }, [riskVersion]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-enterprise border bg-white p-2.5 text-left shadow-sm ${
        active ? 'border-primaryBlue' : 'border-neutralBorder'
      } ${pulse ? 'risk-pulse' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 h-[44px] w-1 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <p className="mb-1 text-xs font-semibold text-textSecondary">{label}</p>
          <p className="text-3xl font-semibold leading-none text-textPrimary">{value}</p>
        </div>
      </div>
    </button>
  );
}

function statusPill(risk) {
  if (risk === 'critical') return 'border-[#D32F2F] bg-red-50 text-[#D32F2F]';
  if (risk === 'warning') return 'border-[#F57C00] bg-orange-50 text-[#F57C00]';
  return 'border-[#0174C3] bg-blue-50 text-[#0174C3]';
}

function riskScoreBadge(score) {
  if (score >= 80) return { label: 'High', className: 'border-[#D32F2F] bg-[#D32F2F] text-white' };
  if (score >= 50) return { label: 'Medium', className: 'border-[#F57C00] bg-[#F57C00] text-white' };
  return { label: 'Low', className: 'border-[#0174C3] bg-[#0174C3] text-white' };
}

function breakdownTone(value) {
  if (value >= 75) return '#D32F2F';
  if (value >= 50) return '#F57C00';
  return '#0174C3';
}

function calculateRiskScore(cert) {
  let score = 0;
  if (cert.expiryDays < 7) score += 40;
  else if (cert.expiryDays < 15) score += 30;
  else if (cert.expiryDays < 30) score += 20;
  if (cert.revenueCritical === true) score += 30;
  if (cert.redundancy === false) score += 20;
  if (cert.algorithm === 'RSA-2048') score += 10;
  return Math.min(score, 100);
}

function calculateConfidence(cert) {
  let score = 100;

  const expiry =
    cert.expiryDays ??
    cert.expires_in_days ??
    999;

  const autoRenew =
    cert.autoRenewStatus ??
    cert.auto_renew_status ??
    'Disabled';

  const pqc =
    cert.pqcVulnerable ??
    cert.pqc_vulnerable ??
    false;

  const rating =
    cert.certSecurityRating ??
    cert.cert_security_rating ??
    'NOT_SECURE';

  const redundancy = cert.redundancy ?? false;

  const instances =
    cert.discoveryInstanceCount ??
    cert.discovery_instance_count ??
    0;

  if (expiry <= 7) score -= 30;
  else if (expiry <= 30) score -= 15;
  else if (expiry <= 60) score -= 5;

  if (autoRenew === 'Disabled') score -= 15;

  if (pqc === true) score -= 10;

  if (rating === 'NOT_SECURE') score -= 15;
  else if (rating === 'WARNING') score -= 8;

  if (redundancy === false) score -= 10;

  if (instances === 0) score -= 5;

  return Math.max(score, 0);
}

function getConfidenceBreakdown(cert) {
  const breakdown = [];
  let score = 100;

  const expiry = cert.expiryDays ?? cert.expires_in_days ?? 999;
  const autoRenew = cert.autoRenewStatus ?? cert.auto_renew_status ?? 'Disabled';
  const pqc = cert.pqcVulnerable ?? cert.pqc_vulnerable ?? false;
  const rating = cert.certSecurityRating ?? cert.cert_security_rating ?? 'NOT_SECURE';
  const redundancy = cert.redundancy ?? false;
  const instances = cert.discoveryInstanceCount ?? cert.discovery_instance_count ?? 0;

  if (expiry <= 7) {
    breakdown.push({ label: 'Expiry', value: `Expires in ${expiry} days` });
    score -= 30;
  } else if (expiry <= 30) {
    breakdown.push({ label: 'Expiry', value: `Expires in ${expiry} days` });
    score -= 15;
  } else if (expiry <= 60) {
    breakdown.push({ label: 'Expiry', value: `Expires in ${expiry} days` });
  }

  if (autoRenew === 'Disabled') {
    breakdown.push({ label: 'Auto-renew', value: 'Not scheduled' });
    score -= 15;
  } else {
    breakdown.push({ label: 'Auto-renew', value: 'Scheduled' });
  }

  if (pqc === true) {
    breakdown.push({ label: 'Quantum', value: 'Vulnerable' });
    score -= 10;
  }

  if (rating === 'NOT_SECURE') {
    breakdown.push({ label: 'Security rating', value: 'NOT_SECURE' });
    score -= 15;
  } else if (rating === 'WARNING') {
    breakdown.push({ label: 'Security rating', value: 'WARNING' });
    score -= 8;
  }

  if (redundancy === false) {
    breakdown.push({ label: 'Redundancy', value: 'Not configured' });
    score -= 10;
  } else {
    breakdown.push({ label: 'Redundancy', value: 'Configured' });
  }

  if (instances === 0) {
    breakdown.push({ label: 'Coverage', value: 'No deployment coverage' });
    score -= 5;
  } else {
    breakdown.push({ label: 'Coverage', value: `${instances} mapped instances` });
  }

  return {
    finalScore: Math.max(score, 0),
    breakdown,
  };
}

function calculatePriority(cert) {
  const risk = getLiveRiskScore(cert);
  const revenueWeight = cert.revenueCritical ? 1.5 : 1;
  const envWeight = cert.environment === 'Production' ? 1.3 : 1;
  return Math.round(risk * revenueWeight * envWeight);
}

function getLiveRiskScore(cert) {
  return typeof cert.riskScore === 'number' ? cert.riskScore : calculateRiskScore(cert);
}

function applySummaryFilter(certificates, summaryFilter) {
  if (summaryFilter === 'expired') {
    return certificates.filter(
      (cert) => cert.expiryDays <= 0 || String(cert.status).toLowerCase() === 'expired'
    );
  }
  if (summaryFilter === 'expiringSoon') {
    return certificates.filter((cert) => cert.expiryDays > 0 && cert.expiryDays < 30);
  }
  if (summaryFilter === 'revoked') {
    return certificates.filter((cert) => String(cert.status).toLowerCase() === 'revoked');
  }
  if (summaryFilter === 'issues') {
    return certificates.filter(
      (cert) =>
        (cert.certSecurityRating && cert.certSecurityRating !== 'SECURE') ||
        calculateRiskScore(cert) >= 80
    );
  }
  return certificates;
}

function exportToCSV(rows, includeRiskScore) {
  const headers = includeRiskScore
    ? ['Common Name', 'Expiry Days', 'Business Unit', 'Status', 'Risk Score']
    : ['Common Name', 'Expiry Days', 'Business Unit', 'Status'];
  const lines = rows.map((cert) =>
    (includeRiskScore
      ? [
          cert.commonName,
          cert.expiryDays,
          cert.businessUnit,
          cert.status,
          getLiveRiskScore(cert),
        ]
      : [
      cert.commonName,
      cert.expiryDays,
      cert.businessUnit,
      cert.status,
        ])
      .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
      .join(',')
  );
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function computeProjectedRiskReduction(visibleCertificates) {
  const totalRiskBefore = visibleCertificates
    .map((cert) => calculateRiskScore(cert))
    .reduce((sum, score) => sum + score, 0);

  const remediationCount = Math.min(3, visibleCertificates.length);
  const remediationCandidates = [...visibleCertificates]
    .sort((a, b) => calculateRiskScore(b) - calculateRiskScore(a))
    .slice(0, remediationCount);

  const cloned = visibleCertificates.map((cert) => ({ ...cert }));
  const candidateIds = new Set(remediationCandidates.map((candidate) => candidate.id));

  cloned.forEach((cert) => {
    if (candidateIds.has(cert.id)) {
      cert.redundancy = true;
      cert.autoRenewStatus = 'Enabled';
    }
  });

  const totalRiskAfter = cloned
    .map((cert) => calculateRiskScore(cert))
    .reduce((sum, score) => sum + score, 0);

  if (totalRiskBefore === 0) return 0;

  const reductionPercent = Math.round(
    ((totalRiskBefore - totalRiskAfter) / totalRiskBefore) * 100
  );
  return reductionPercent;
}

function generateCopilotSuggestions(
  visibleCertificates,
  executiveView,
  role,
  simulationMode,
  quantumMode = false
) {
  const suggestions = [];
  const highRisk = visibleCertificates.filter((cert) => getLiveRiskScore(cert) >= 70);
  const expiringSoon = visibleCertificates.filter((cert) => cert.expiryDays < 15);
  const redundancyGaps = visibleCertificates.filter((cert) => cert.redundancy === false);
  const rsaLegacy = quantumMode
    ? visibleCertificates.filter((cert) => cert.algorithm === 'RSA-2048')
    : [];

  if (highRisk.length > 0) {
    suggestions.push({
      title: 'High-risk certificate exposure detected',
      severity: 'critical',
      description: `${highRisk.length} cert(s) in high-risk range.`,
      count: highRisk.length,
      countLabel: 'cert(s) in high-risk range.',
      filterKey: 'highRisk',
      estimatedImpact: executiveView ? 'Elevated outage risk' : 'Immediate remediation needed',
      recommendedAction: 'Prioritize renewal + backup issuance.',
    });
  }

  if (expiringSoon.length > 0) {
    suggestions.push({
      title: 'Urgent expiry window',
      severity: 'warning',
      description: `${expiringSoon.length} cert(s) expire in <15 days.`,
      count: expiringSoon.length,
      countLabel: 'cert(s) expire in <15 days.',
      filterKey: 'expiring',
      estimatedImpact: 'Possible trust failures',
      recommendedAction: 'Trigger renewal automation.',
    });
  }

  if (redundancyGaps.length > 0) {
    suggestions.push({
      title: 'Redundancy gaps identified',
      severity: 'warning',
      description: `${redundancyGaps.length} cert(s) have no redundancy.`,
      count: redundancyGaps.length,
      countLabel: 'cert(s) have no redundancy.',
      filterKey: 'redundancyGap',
      estimatedImpact: 'Single-point failure risk',
      recommendedAction: 'Assign backup cert path.',
    });
  }

  if (quantumMode && rsaLegacy.length > 0) {
    suggestions.push({
      title: 'Quantum migration candidates',
      severity: 'info',
      description: `${rsaLegacy.length} cert(s) still use RSA-2048.`,
      estimatedImpact: 'Long-term cryptographic migration pressure',
      recommendedAction: 'Plan phased migration to stronger or PQ-ready algorithms.',
    });
  }

  if (simulationMode) {
    suggestions.push({
      title: 'Simulation context active',
      severity: 'info',
      description: `Impact simulation is running for ${visibleCertificates.length} visible certificate(s).`,
      estimatedImpact: 'Projected dependency impact available for decisioning',
      recommendedAction: role === 'executive' ? 'Review business severity and approve mitigation.' : 'Review impacted nodes and execute remediation drill.',
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: 'No immediate action required',
      severity: 'info',
      description: 'Visible certificates are currently within acceptable thresholds.',
      estimatedImpact: 'Low operational risk in current view',
      recommendedAction: 'Continue monitoring and keep auto-renew policies active.',
    });
  }

  return suggestions;
}

function calculateRecommendationConfidence(visibleCertificates) {
  if (!visibleCertificates.length) return 100;
  let score = 100;
  const total = visibleCertificates.length;
  const missingRedundancy = visibleCertificates.filter(
    (cert) => cert.redundancy === undefined || cert.redundancy === null
  ).length;
  const incompleteBusinessUnit = visibleCertificates.filter(
    (cert) => !cert.businessUnit || String(cert.businessUnit).trim() === ''
  ).length;
  const zeroInstances = visibleCertificates.filter((cert) => (cert.instances ?? 0) === 0).length;

  if (missingRedundancy / total > 0.3) score -= 15;
  if (incompleteBusinessUnit > 0) score -= 10;
  if (zeroInstances / total > 0.5) score -= 10;

  return Math.max(score, 50);
}

function highestRiskExplanation(cert) {
  const reasons = [];
  if (cert.expiryDays < 30) reasons.push('Expiring soon');
  if (cert.revenueCritical) reasons.push('Revenue critical');
  if (cert.redundancy === false) reasons.push('No redundancy');
  if (cert.algorithm === 'RSA-2048') reasons.push('Legacy algorithm');
  if (reasons.length === 0) reasons.push('composite risk conditions');
  return `Highest risk due to ${reasons.join(' + ')}`;
}

function RiskBadgeWithTooltip({
  className,
  children,
  cert,
  riskVersion,
  numericValue,
  showHoverDetails = false,
  hoverPosition = 'center',
}) {
  const { finalScore, breakdown } = cert
    ? getConfidenceBreakdown(cert)
    : { finalScore: 87, breakdown: [] };
  const badgeRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(
    typeof numericValue === 'number' ? numericValue : null
  );
  const previousValueRef = useRef(
    typeof numericValue === 'number' ? numericValue : null
  );

  useEffect(() => {
    if (!riskVersion || !badgeRef.current) return undefined;
    badgeRef.current.classList.add('risk-pulse');
    const pulseId = setTimeout(() => {
      badgeRef.current?.classList.remove('risk-pulse');
    }, 300);
    return () => clearTimeout(pulseId);
  }, [riskVersion]);

  useEffect(() => {
    if (typeof numericValue !== 'number') return;
    const previous = previousValueRef.current ?? numericValue;
    const start = performance.now();
    const duration = 400;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = Math.round(previous + (numericValue - previous) * progress);
      setDisplayValue(next);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    previousValueRef.current = numericValue;
  }, [numericValue, riskVersion]);

  return (
      <span className="group relative inline-flex">
      <span ref={badgeRef} className={className}>
        {children}
      </span>
      {showHoverDetails && typeof numericValue === 'number' ? (
        <span
          className={`pointer-events-none absolute top-full z-50 mt-2 w-[180px] rounded bg-[#1F2A37] px-[10px] py-[8px] text-[12px] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 ${
            hoverPosition === 'left'
              ? 'right-0'
              : hoverPosition === 'right'
                ? 'left-0'
                : 'left-1/2 -translate-x-1/2'
          }`}
        >
          <div className="text-left font-medium">
            Risk score: {displayValue ?? numericValue}
          </div>
        </span>
      ) : null}
      </span>
  );
}

function InventoryRow({
  cert,
  index,
  intelligenceEnabled,
  executiveView,
  quantumMode,
  selected,
  expanded,
  onToggleRow,
  onToggleExpand,
  onOpenDetail,
  riskVersion,
  detailColSpan,
}) {
  const rowRef = useRef(null);

  useEffect(() => {
    if (!riskVersion || !rowRef.current) return undefined;
    rowRef.current.classList.add('row-recalc');
    const t = setTimeout(() => {
      rowRef.current?.classList.remove('row-recalc');
    }, 350);
    return () => clearTimeout(t);
  }, [riskVersion]);

  return (
    <>
    <tr
      ref={rowRef}
      onClick={() => onOpenDetail(cert)}
      data-risk-version={riskVersion}
      className={`cursor-pointer border-t border-neutralBorder ${selected ? 'bg-blue-50' : 'bg-white'} hover:bg-slate-50`}
    >
      <td className="px-2.5 py-1.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleExpand(cert.id)}
            className="inline-flex h-5 w-5 items-center justify-center rounded border border-neutralBorder text-[11px] text-textSecondary"
            title="Toggle details"
          >
            {expanded ? '−' : '+'}
          </button>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleRow(cert.id)}
            className="h-4 w-4 rounded border-neutralBorder"
          />
        </div>
      </td>
      <td className="max-w-[300px] px-2.5 py-1.5">
        <div className="truncate text-primaryBlue">{cert.commonName}</div>
        {index === 0 && intelligenceEnabled && (
          <div className="mt-1 text-[12px] text-[#5F6B7A]">
            {highestRiskExplanation(cert)}
          </div>
        )}
      </td>
      <td className="px-2.5 py-1.5">{cert.seatType}</td>
      <td className="px-2.5 py-1.5">{cert.caVendor}</td>
      {!executiveView && (
        <td className="px-2.5 py-1.5">
          <span className="inline-flex items-center gap-2">
            {cert.algorithm}
            {quantumMode && cert.algorithm === 'RSA-2048' ? (
              <Tooltip text={TOOLTIP_TEXT.quantumDot}>
                <span
                  className="inline-block h-[6px] w-[6px] rounded-full bg-[#6B5BFF]"
                  title="Quantum migration priority"
                />
              </Tooltip>
            ) : null}
          </span>
        </td>
      )}
      <td className="px-2.5 py-1.5">
        <RiskBadgeWithTooltip
          className={`rounded-enterprise border px-2 py-0.5 text-xs font-semibold ${statusPill(cert.risk)}`}
          cert={cert}
          riskVersion={riskVersion}
        >
          {cert.status}
        </RiskBadgeWithTooltip>
      </td>
      {intelligenceEnabled && (
        <td className="px-2.5 py-1.5">
          <RiskBadgeWithTooltip
            className={`rounded-enterprise border px-2 py-0.5 text-xs font-semibold ${
              riskScoreBadge(getLiveRiskScore(cert)).className
            }`}
            cert={cert}
            riskVersion={riskVersion}
            numericValue={getLiveRiskScore(cert)}
            showHoverDetails
          >
            {riskScoreBadge(getLiveRiskScore(cert)).label}
          </RiskBadgeWithTooltip>
        </td>
      )}
      <td className="px-2.5 py-1.5">{cert.validTo}</td>
      <td className="px-2.5 py-1.5">{cert.validFrom}</td>
      <td className="max-w-[220px] truncate px-2.5 py-1.5">{cert.businessUnit}</td>
      {!executiveView && (
        <td className="px-2.5 py-1.5">{cert.instances > 0 ? cert.instances : '—'}</td>
      )}
      {executiveView && (
        <td className="px-2.5 py-1.5">
          {cert.revenueCritical ? '$1.2M/day' : '$180K/day'}
        </td>
      )}
      {executiveView && (
        <td className="px-2.5 py-1.5">
          {calculateRiskScore(cert) >= 80
            ? 'Critical'
            : calculateRiskScore(cert) >= 50
              ? 'Elevated'
              : 'Moderate'}
        </td>
      )}
    </tr>
    {expanded && (
      <tr className="border-t border-neutralBorder bg-[#F9FAFB]">
        <td colSpan={detailColSpan} className="px-3 py-2 text-xs text-textSecondary">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div>
              <p className="font-semibold text-textPrimary">Trend</p>
              <p>Expiry in {cert.expiryDays} days</p>
            </div>
            <div>
              <p className="font-semibold text-textPrimary">Renewal</p>
              <p>Auto-renew: {cert.autoRenewStatus ?? 'Disabled'}</p>
            </div>
            <div>
              <p className="font-semibold text-textPrimary">Coverage</p>
              <p>{cert.instances ?? 0} deployed instances</p>
            </div>
          </div>
        </td>
      </tr>
    )}
    </>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState('Inventory');
  const [activeTab, setActiveTab] = useState('Certificates');
  const [detailTab, setDetailTab] = useState('Certificate');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);
  const [executiveView, setExecutiveView] = useState(false);
  const [sortMode, setSortMode] = useState('risk');
  const [kpiFilter, setKpiFilter] = useState('all');
  const [summaryFilter, setSummaryFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ businessUnit: '', status: '' });
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [showKPIs, setShowKPIs] = useState({ risk: true, quantum: true });
  const [expandedRows, setExpandedRows] = useState({});
  const [savedViews, setSavedViews] = useState([]);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [fixOverrides, setFixOverrides] = useState({});
  const [previewFixResults, setPreviewFixResults] = useState(null);
  const [previousInventoryState, setPreviousInventoryState] = useState(null);
  const [remediationStrategy, setRemediationStrategy] = useState('balanced');
  const [copilotActivity, setCopilotActivity] = useState([]);
  const [showCopilotTimeline, setShowCopilotTimeline] = useState(false);
  const [copilotIndicatorSeen, setCopilotIndicatorSeen] = useState(false);
  const [animatingDetail, setAnimatingDetail] = useState(false);
  const [detailImpactVisible, setDetailImpactVisible] = useState(false);
  const [riskVersion, setRiskVersion] = useState(0);
  const [showUpdatedNote, setShowUpdatedNote] = useState(false);
  const [kpiPulse, setKpiPulse] = useState(false);

  const [intelligenceEnabled, setIntelligenceEnabled] = useState(false);
  const [quantumMode, setQuantumMode] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const detailOpenTimeoutRef = useRef(null);

  const bumpRiskVersion = () => setRiskVersion((prev) => prev + 1);

  const sourceInventory = useMemo(
    () =>
      data.inventory.map((cert) => ({
        ...cert,
        environment: cert.environment ?? 'Production',
      })),
    []
  );
  const workingInventory = useMemo(
    () =>
      sourceInventory.map((cert) => ({
        ...cert,
        ...(fixOverrides[cert.id] ?? {}),
      })),
    [sourceInventory, fixOverrides]
  );

  const intelligenceInventory = useMemo(() => {
    if (!intelligenceEnabled) return workingInventory;
    const enriched = workingInventory.map((row) => {
      const baseScore = calculateRiskScore(row);
      const adjustedScore = simulationMode ? Math.max(baseScore - 10, 0) : baseScore;
      return { ...row, riskScore: adjustedScore };
    });
    return [...enriched].sort((a, b) => getLiveRiskScore(b) - getLiveRiskScore(a));
  }, [intelligenceEnabled, simulationMode, workingInventory]);

  const baseFilteredInventory = useMemo(() => {
    const loweredSearch = searchText.toLowerCase();
    return intelligenceInventory.filter(
      (cert) =>
        cert.commonName.toLowerCase().includes(loweredSearch) &&
        (!filters.businessUnit || cert.businessUnit === filters.businessUnit) &&
        (!filters.status || cert.status === filters.status)
    );
  }, [intelligenceInventory, searchText, filters]);

  const summaryScopedInventory = useMemo(() => {
    return applySummaryFilter(baseFilteredInventory, summaryFilter);
  }, [baseFilteredInventory, summaryFilter]);

  const contextualHighRiskCerts = useMemo(
    () =>
      summaryScopedInventory.filter(
        (cert) => calculateRiskScore(cert) >= 70 && cert.environment === 'Production'
      ),
    [summaryScopedInventory]
  );

  const revenueImpactedCount = useMemo(
    () => contextualHighRiskCerts.filter((cert) => cert.revenueCritical === true).length,
    [contextualHighRiskCerts]
  );

  const trustGuardianScopedInventory = useMemo(() => {
    if (!showHighRiskOnly) return summaryScopedInventory;
    const highRiskIds = new Set(contextualHighRiskCerts.map((cert) => cert.id));
    return summaryScopedInventory.filter((cert) => highRiskIds.has(cert.id));
  }, [showHighRiskOnly, summaryScopedInventory, contextualHighRiskCerts]);

  const displayedInventory = useMemo(() => {
    let filtered = trustGuardianScopedInventory;
    if (kpiFilter === 'highRisk') {
      filtered = filtered.filter((cert) => getLiveRiskScore(cert) >= 80);
    } else if (kpiFilter === 'expiring') {
      filtered = filtered.filter((cert) => cert.expiryDays < 30);
    } else if (kpiFilter === 'revenueCritical') {
      filtered = filtered.filter((cert) => cert.revenueCritical);
    } else if (kpiFilter === 'redundancyGap') {
      filtered = filtered.filter((cert) => cert.redundancy === false);
    }
    return [...filtered].sort((a, b) => {
      if (sortMode === 'priority') return calculatePriority(b) - calculatePriority(a);
      if (sortMode === 'expirySoon') return a.expiryDays - b.expiryDays;
      if (sortMode === 'confidenceLow') return calculateConfidence(a) - calculateConfidence(b);
      if (sortMode === 'revenueCritical') {
        if (a.revenueCritical === b.revenueCritical) {
          return calculateRiskScore(b) - calculateRiskScore(a);
        }
        return a.revenueCritical ? -1 : 1;
      }
      return calculateRiskScore(b) - calculateRiskScore(a);
    });
  }, [trustGuardianScopedInventory, sortMode, kpiFilter]);

  const inventory = displayedInventory;
  const uniqueBusinessUnits = useMemo(
    () => [...new Set(sourceInventory.map((cert) => cert.businessUnit))],
    [sourceInventory]
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(sourceInventory.map((cert) => cert.status))],
    [sourceInventory]
  );
  const appliedFilters = useMemo(() => {
    const items = [];
    if (searchText.trim()) {
      items.push({ key: 'search', label: `Search = ${searchText.trim()}` });
    }
    if (filters.businessUnit) {
      items.push({ key: 'businessUnit', label: `Business unit = ${filters.businessUnit}` });
    }
    if (filters.status) {
      items.push({ key: 'status', label: `Status = ${filters.status}` });
    }
    if (summaryFilter !== 'all') {
      const summaryMap = {
        expired: 'Summary = Expired certificates',
        expiringSoon: 'Summary = Expiring soon',
        revoked: 'Summary = Revoked',
        issues: 'Summary = Certificates with issues',
      };
      items.push({ key: 'summary', label: summaryMap[summaryFilter] ?? 'Summary filter active' });
    }
    if (kpiFilter !== 'all') {
      const kpiMap = {
        highRisk: 'KPI = High Risk (80+)',
        expiring: 'KPI = Expiry Under 30 Days',
        revenueCritical: 'KPI = Revenue Critical Certs',
        redundancyGap: 'KPI = Redundancy Gaps',
      };
      items.push({ key: 'kpi', label: kpiMap[kpiFilter] ?? 'KPI filter active' });
    }
    if (showHighRiskOnly) {
      items.push({ key: 'highRiskOnly', label: 'TrustGuardian = High-risk only' });
    }
    return items;
  }, [searchText, filters, summaryFilter, kpiFilter, showHighRiskOnly]);
  const copilotContextCertificates = useMemo(() => {
    if (selectedCertificate) {
      const match = inventory.find((cert) => cert.id === selectedCertificate.id);
      return [match ?? selectedCertificate];
    }
    if (selectedRows.length > 0) {
      const selectedSet = new Set(selectedRows);
      const rows = inventory.filter((cert) => selectedSet.has(cert.id));
      if (rows.length > 0) return rows;
    }
    return inventory;
  }, [selectedCertificate, selectedRows, inventory]);
  const copilotSuggestions = useMemo(
    () =>
      generateCopilotSuggestions(
        copilotContextCertificates,
        executiveView,
        executiveView ? 'executive' : 'analyst',
        simulationMode,
        quantumMode
      ),
    [copilotContextCertificates, executiveView, simulationMode, quantumMode]
  );
  const recommendationConfidence = useMemo(
    () => calculateRecommendationConfidence(copilotContextCertificates),
    [copilotContextCertificates]
  );
  const urgentSuggestionCount = useMemo(
    () =>
      copilotContextCertificates.filter((cert) => getLiveRiskScore(cert) >= 70).length,
    [copilotContextCertificates]
  );
  const showCopilotUrgentIndicator =
    intelligenceEnabled && urgentSuggestionCount > 0 && !copilotIndicatorSeen;

  const logCopilotActivity = (action, detail) => {
    setCopilotActivity((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        action,
        detail,
      },
      ...prev,
    ]);
  };

  const snapshotBeforeMutation = () => {
    setPreviousInventoryState(JSON.parse(JSON.stringify(fixOverrides)));
  };
  const removeAppliedFilter = (key) => {
    if (key === 'search') setSearchText('');
    if (key === 'businessUnit') setFilters((prev) => ({ ...prev, businessUnit: '' }));
    if (key === 'status') setFilters((prev) => ({ ...prev, status: '' }));
    if (key === 'summary') setSummaryFilter('all');
    if (key === 'kpi') setKpiFilter('all');
    if (key === 'highRiskOnly') setShowHighRiskOnly(false);
  };
  const clearAllFilters = () => {
    setSearchText('');
    setFilters({ businessUnit: '', status: '' });
    setSummaryFilter('all');
    setKpiFilter('all');
    setShowHighRiskOnly(false);
  };

  const projectedReduction = useMemo(
    () => computeProjectedRiskReduction(inventory),
    [inventory]
  );

  const highRiskCount = trustGuardianScopedInventory.filter((item) => getLiveRiskScore(item) >= 80).length;
  const expiringSoonCount = trustGuardianScopedInventory.filter((item) => item.expiryDays < 30).length;
  const averageRiskScore =
    trustGuardianScopedInventory.length > 0
      ? Math.round(
          trustGuardianScopedInventory.reduce((sum, cert) => sum + getLiveRiskScore(cert), 0) /
            trustGuardianScopedInventory.length
        )
      : 0;
  const revenueCriticalCount = trustGuardianScopedInventory.filter((item) => item.revenueCritical).length;
  const quantumReadinessScore =
    trustGuardianScopedInventory.length > 0
      ? Math.round(
          (trustGuardianScopedInventory.filter((item) => item.algorithm !== 'RSA-2048').length /
            trustGuardianScopedInventory.length) *
            100
        )
      : 0;
  const summaryBaseInventory = useMemo(() => {
    let filtered = [...baseFilteredInventory];
    if (showHighRiskOnly) {
      filtered = filtered.filter(
        (cert) => calculateRiskScore(cert) >= 70 && cert.environment === 'Production'
      );
    }
    if (intelligenceEnabled) {
      if (kpiFilter === 'highRisk') {
        filtered = filtered.filter((cert) => getLiveRiskScore(cert) >= 80);
      } else if (kpiFilter === 'expiring') {
        filtered = filtered.filter((cert) => cert.expiryDays < 30);
      } else if (kpiFilter === 'revenueCritical') {
        filtered = filtered.filter((cert) => cert.revenueCritical);
      } else if (kpiFilter === 'redundancyGap') {
        filtered = filtered.filter((cert) => cert.redundancy === false);
      }
    }
    return filtered;
  }, [baseFilteredInventory, showHighRiskOnly, intelligenceEnabled, kpiFilter]);

  const inventorySummary = useMemo(() => {
    const totalCertificates = summaryBaseInventory.length;
    const expired = summaryBaseInventory.filter(
      (cert) => cert.expiryDays <= 0 || String(cert.status).toLowerCase() === 'expired'
    ).length;
    const expiringSoon = summaryBaseInventory.filter(
      (cert) => cert.expiryDays > 0 && cert.expiryDays < 30
    ).length;
    const revoked = summaryBaseInventory.filter(
      (cert) => String(cert.status).toLowerCase() === 'revoked'
    ).length;
    const issues = summaryBaseInventory.filter(
      (cert) =>
        (cert.certSecurityRating && cert.certSecurityRating !== 'SECURE') ||
        calculateRiskScore(cert) >= 80
    ).length;
    return {
      totalCertificates,
      expired,
      expiringSoon,
      revoked,
      issues,
    };
  }, [summaryBaseInventory]);
  const inventoryDependencyNodes = displayedInventory.slice(0, 4).map((cert, index) => ({
    id: cert.id,
    name: cert.commonName,
    impacted: simulationMode && calculateRiskScore(cert) >= 80 && index < 3,
  }));
  const detailDependencyChain = useMemo(() => {
    const iconMap = {
      Certificate: 'certificate',
      'Load Balancer': 'loadBalancer',
      'F5 Load Balancer': 'loadBalancer',
      'API Gateway': 'gateway',
      'Legacy API': 'gateway',
      'Payment Service': 'payment',
      'Billing Service': 'payment',
      'Checkout Flow': 'checkout',
      'Invoice Generation': 'checkout',
    };
    const tooltipMap = {
      Certificate: 'The SSL/TLS certificate securing this endpoint.',
      'Load Balancer': 'Distributes traffic across backend services.',
      'F5 Load Balancer': 'Distributes traffic across backend services.',
      'API Gateway': 'Handles authentication and routing.',
      'Legacy API': 'Handles authentication and routing.',
      'Payment Service': 'Processes payment transactions.',
      'Billing Service': 'Processes payment transactions.',
      'Checkout Flow': 'Customer-facing revenue path.',
      'Invoice Generation': 'Customer-facing revenue path.',
    };
    if (!selectedCertificate) return undefined;
    const path = data.serviceImpactPaths?.[selectedCertificate.id];
    if (!path) return undefined;
    return path.map((item) => ({
      name: item.node,
      descriptor: item.label,
      icon: iconMap[item.node] ?? 'checkout',
      tooltip: tooltipMap[item.node] ?? 'Impacted business service in trust path.',
      revenueImpact: item.revenueImpact,
    }));
  }, [selectedCertificate]);
  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleExpandedRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const detailColSpan = intelligenceEnabled ? 11 : 10;

  const handleSimulateFix = (cert) => {
    if (!cert) return;
    snapshotBeforeMutation();
    setFixOverrides((prev) => ({
      ...prev,
      [cert.id]: {
        ...(prev[cert.id] ?? {}),
        autoRenewStatus: 'Enabled',
        redundancy: true,
      },
    }));
    logCopilotActivity('Simulate Fix', `Applied to ${cert.commonName}`);
    bumpRiskVersion();
  };

  const handlePreviewFix = () => {
    const current = copilotContextCertificates.map((cert) => ({ ...cert }));
    const shouldFix = (cert) => {
      const score = getLiveRiskScore(cert);
      if (remediationStrategy === 'conservative') {
        return score >= 80 && cert.environment === 'Production';
      }
      if (remediationStrategy === 'aggressive') {
        return cert.revenueCritical === true;
      }
      return score >= 70 || cert.expiryDays < 15;
    };
    const after = current.map((cert) =>
      shouldFix(cert) ? { ...cert, autoRenewStatus: 'Enabled', redundancy: true } : cert
    );
    const affectedIds = current
      .filter((cert) => shouldFix(cert))
      .map((cert) => cert.id);

    const currentAvgRisk =
      current.length > 0
        ? Math.round(
            current.reduce((sum, cert) => sum + getLiveRiskScore(cert), 0) /
              current.length
          )
        : 0;
    const afterAvgRisk =
      after.length > 0
        ? Math.round(
            after.reduce((sum, cert) => sum + calculateRiskScore(cert), 0) / after.length
          )
        : 0;
    const currentHighRiskCount = current.filter(
      (cert) => getLiveRiskScore(cert) >= 70
    ).length;
    const afterHighRiskCount = after.filter((cert) => calculateRiskScore(cert) >= 70).length;
    const currentRiskTotal = current.reduce(
      (sum, cert) => sum + getLiveRiskScore(cert),
      0
    );
    const afterRiskTotal = after.reduce((sum, cert) => sum + calculateRiskScore(cert), 0);
    const downtimeReduction =
      currentRiskTotal > 0
        ? Math.round(((currentRiskTotal - afterRiskTotal) / currentRiskTotal) * 100)
        : 0;

    setPreviewFixResults({
      affectedIds,
      currentAvgRisk,
      afterAvgRisk,
      currentHighRiskCount,
      afterHighRiskCount,
      downtimeReduction,
      riskDelta: currentAvgRisk - afterAvgRisk,
      impactDelta: currentHighRiskCount - afterHighRiskCount,
    });
    logCopilotActivity(
      'Preview Used',
      `${remediationStrategy} strategy previewed for ${affectedIds.length} certificates`
    );
  };

  const handleApplyPreviewFix = () => {
    if (!previewFixResults || previewFixResults.affectedIds.length === 0) return;
    snapshotBeforeMutation();
    setFixOverrides((prev) => {
      const next = { ...prev };
      previewFixResults.affectedIds.forEach((id) => {
        next[id] = {
          ...(next[id] ?? {}),
          autoRenewStatus: 'Enabled',
          redundancy: true,
        };
      });
      return next;
    });
    logCopilotActivity('Auto-Fix Applied', `Applied preview to ${previewFixResults.affectedIds.length} certificates`);
    setPreviewFixResults(null);
    bumpRiskVersion();
  };

  const handleUndoFix = () => {
    if (!previousInventoryState) return;
    setFixOverrides(JSON.parse(JSON.stringify(previousInventoryState)));
    setPreviousInventoryState(null);
    logCopilotActivity('Undo Applied', 'Restored previous certificate remediation state');
    bumpRiskVersion();
  };

  const applyCopilotSuggestionFilter = (filterKey) => {
    if (!filterKey) return;
    setKpiFilter(filterKey);
    logCopilotActivity('Copilot Filter Applied', `Applied ${filterKey} filter from suggestion card`);
  };

  const resetToOriginalInventoryState = () => {
    setIntelligenceEnabled(false);
    setShowHighRiskOnly(false);
    setSelectedRows([]);
    setQuantumMode(false);
    setSimulationMode(false);
    setSortMode('risk');
    setKpiFilter('all');
    setSummaryFilter('all');
    setSearchText('');
    setFilters({ businessUnit: '', status: '' });
    setExpandedRows({});
    setFixOverrides({});
    setPreviewFixResults(null);
    setPreviousInventoryState(null);
    setRemediationStrategy('balanced');
    setCopilotActivity([]);
    setShowCopilotTimeline(false);
    setCopilotIndicatorSeen(false);
    setFiltersPanelOpen(false);
    setExecutiveView(false);
    setActiveTab('Certificates');
    setCopilotOpen(false);
    bumpRiskVersion();
  };

  const openCertificateDetail = (cert) => {
    setAnimatingDetail(true);
    if (detailOpenTimeoutRef.current) {
      clearTimeout(detailOpenTimeoutRef.current);
    }
    detailOpenTimeoutRef.current = setTimeout(() => {
      setSelectedCertificate(cert);
      setDetailTab('Certificate');
      setAnimatingDetail(false);
    }, 250);
  };

  useEffect(
    () => () => {
      if (detailOpenTimeoutRef.current) {
        clearTimeout(detailOpenTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (
      selectedCertificate &&
      detailTab === 'Trust Intelligence Insights' &&
      intelligenceEnabled
    ) {
      setDetailImpactVisible(false);
      const id = setTimeout(() => setDetailImpactVisible(true), 20);
      return () => clearTimeout(id);
    }
    setDetailImpactVisible(false);
    return undefined;
  }, [selectedCertificate, detailTab, intelligenceEnabled]);

  useEffect(() => {
    if (!riskVersion) return;
    setKpiPulse(true);
    const pulseId = setTimeout(() => setKpiPulse(false), 450);
    return () => {
      clearTimeout(pulseId);
    };
  }, [riskVersion]);

  useEffect(() => {
    if (!riskVersion) return;
    setShowUpdatedNote(true);
    setLastUpdated(Date.now());
    const t = setTimeout(() => {
      setShowUpdatedNote(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [riskVersion]);

  useEffect(() => {
    setPreviewFixResults(null);
  }, [searchText, filters, summaryFilter, kpiFilter, sortMode]);

  useEffect(() => {
    if (!intelligenceEnabled) {
      setCopilotIndicatorSeen(false);
    }
  }, [intelligenceEnabled]);

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f7] font-sans text-textPrimary">
      <div className="flex h-screen flex-col md:flex-row">
        <aside className="relative w-full border-r border-neutralBorder bg-[#024f86] text-white md:w-60 md:flex-shrink-0">
          <div className="flex h-14 items-center gap-3 bg-[#2f3237] px-3">
            <div className="grid h-8 w-8 place-items-center rounded border border-white/60 text-sm font-semibold">
              TL
            </div>
            <p className="text-lg font-semibold tracking-wide">TRUST LIFECYCLE</p>
          </div>
          <nav className="pt-4">
            {navItems.map((item) => {
              const isActive = item.label === activeNav;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveNav(item.label)}
                  className={`group flex w-full items-center justify-between px-[18px] py-3.5 text-left text-base font-normal transition-[background-color] duration-200 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
                    isActive ? 'bg-[#1478bd]' : 'hover:bg-[#0e5f99]'
                  }`}
                >
                  <span className="flex items-center gap-3 text-white transition-colors duration-200 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)]">
                    <span className="text-xs">
                      <SidebarIcon type={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.chevron ? <span className="text-xs">⌄</span> : null}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 text-4xl text-white/90">digicert`ONE</div>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto bg-[#f3f5f7] p-0 transition-all">
          <div className="flex h-14 items-center justify-between border-b border-neutralBorder bg-[#f3f5f7] px-4">
            <span className="text-sm text-textSecondary">Inventory</span>
            <div className="flex items-center gap-6 text-sm text-textPrimary">
              <span className="text-xs text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
              {intelligenceEnabled && (
                <Tooltip text={TOOLTIP_TEXT.aiCopilotToggle}>
                  <button
                    type="button"
                    onClick={() =>
                      setCopilotOpen((prev) => {
                        const next = !prev;
                        if (next) setCopilotIndicatorSeen(true);
                        return next;
                      })
                    }
                    title={`${urgentSuggestionCount} urgent remediation suggestions available`}
                    className="rounded-enterprise border border-primaryBlue bg-white px-3 py-1 text-xs font-semibold text-primaryBlue shadow-sm"
                  >
                    <span className="inline-flex items-center gap-2">
                      AI Copilot
                      {showCopilotUrgentIndicator ? (
                        <span className="inline-block h-2 w-2 rounded-full bg-[#0174C3]" />
                      ) : null}
                    </span>
                  </button>
                </Tooltip>
              )}
              <span>Manage all</span>
              <span className="text-primaryBlue">⌄</span>
              <span className="text-primaryBlue">?</span>
              <span className="text-primaryBlue">▦</span>
              <span className="text-primaryBlue">●</span>
            </div>
          </div>
          <div className="p-3">
          {selectedCertificate ? (
            <>
              <div className="mb-4 flex items-center gap-1 text-sm">
                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="font-semibold text-primaryBlue"
                >
                  Inventory
                </button>
                <span className="text-textSecondary">/</span>
                <span className="text-textSecondary">Certificate details</span>
              </div>

              <div className="mb-section flex items-center justify-between">
                <h2 className="text-4xl font-semibold tracking-tight text-textPrimary">
                  {selectedCertificate.commonName}
                </h2>
                <div className="flex items-center gap-3">
                  <Tooltip text={TOOLTIP_TEXT.showIntelligenceInsights}>
                  <label className="flex items-center gap-2 text-sm text-[#353535]">
                    <span>Show Intelligence Insights</span>
                    <button
                      type="button"
                      onClick={() =>
                        setIntelligenceEnabled((prev) => {
                          const next = !prev;
                          if (!next && detailTab === 'Trust Intelligence Insights') {
                            setDetailTab('Certificate');
                          }
                          return next;
                        })
                      }
                      className={`relative h-5 w-10 rounded-full transition-colors duration-200 ease-in-out ${
                        intelligenceEnabled ? 'bg-[#0174C3]' : 'bg-[#DDE3E8]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200 ease-in-out ${
                          intelligenceEnabled ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </label>
                  </Tooltip>
                  <button
                    type="button"
                    className="rounded-enterprise border border-primaryBlue bg-primaryBlue px-4 py-2 text-sm font-semibold text-white"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-enterprise border border-neutralBorder bg-white px-3 py-2 text-sm font-semibold text-textSecondary"
                  >
                    ⋮
                  </button>
                </div>
              </div>

              <section className="mb-section rounded-enterprise border border-neutralBorder bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-textSecondary">Certificate status</p>
                    <RiskBadgeWithTooltip
                      className={`mt-3 inline-block rounded-enterprise border px-2 py-0.5 text-xs font-semibold ${statusPill(
                        selectedCertificate.risk
                      )}`}
                      cert={selectedCertificate}
                      riskVersion={riskVersion}
                    >
                      {selectedCertificate.status}
                    </RiskBadgeWithTooltip>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary">Common name</p>
                    <p className="mt-3 text-xl font-normal text-textPrimary">
                      {selectedCertificate.commonName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary">Validity</p>
                    <p className="mt-3 text-xl font-normal text-textPrimary">
                      {selectedCertificate.validFrom} - {selectedCertificate.validTo}
                    </p>
                  </div>
                </div>
              </section>

              <div className="mb-section border-b border-neutralBorder">
                <div className="flex gap-2 text-sm">
                  {[
                    'Certificate',
                    'Instances',
                    ...(intelligenceEnabled ? ['Trust Intelligence Insights'] : []),
                    'Additional details',
                  ].map((tab) => {
                    const isActive = detailTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setDetailTab(tab)}
                        className={`rounded-t-enterprise px-4 py-2 ${
                          isActive
                            ? 'border-b-2 border-textPrimary bg-slate-200 font-semibold text-textPrimary'
                            : 'text-textSecondary'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_220px]">
                <div>
                  {detailTab === 'Certificate' && (
                    <>
                      <section className="mb-section border-b border-neutralBorder pb-8">
                        <h3 className="mb-5 text-2xl font-normal text-textPrimary">Properties</h3>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                          <div>
                            <dt className="text-xs text-textSecondary">Common name</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.commonName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">Validity</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.validFrom} - {selectedCertificate.validTo}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">SANs</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.commonName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">Signature algorithm</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.algorithm}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">Serial number</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.id.toUpperCase()}A9B7C2D4
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">Issuing certificate authority</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">
                              {selectedCertificate.caVendor}
                            </dd>
                          </div>
                        </dl>
                      </section>

                      <section className="pt-8">
                        <h3 className="mb-5 text-2xl font-normal text-textPrimary">Contacts</h3>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                          <div>
                            <dt className="text-xs text-textSecondary">Organization contact</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">—</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-textSecondary">Technical contact</dt>
                            <dd className="mt-1 text-sm font-normal text-textPrimary">—</dd>
                          </div>
                        </dl>
                      </section>
                    </>
                  )}

                  {detailTab === 'Instances' && (
                    <>
                      <section className="mb-4">
                        <p className="mb-4 text-2xl text-textPrimary">
                          Total Instances:{' '}
                          <span className="font-semibold">
                            {selectedCertificate.instances > 0 ? selectedCertificate.instances : 0}
                          </span>
                        </p>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            className="rounded-enterprise border border-primaryBlue bg-primaryBlue px-4 py-2 text-sm font-semibold text-white"
                          >
                            Filter
                          </button>
                          <button
                            type="button"
                            className="rounded-enterprise border border-primaryBlue px-3 py-2 text-sm text-primaryBlue"
                          >
                            ▦
                          </button>
                        </div>
                      </section>
                      <section className="rounded-enterprise border border-neutralBorder bg-white">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-slate-100 text-left text-xs uppercase text-textSecondary">
                            <tr>
                              <th className="px-4 py-3">Location</th>
                              <th className="px-4 py-3">Application</th>
                              <th className="px-4 py-3">Connector</th>
                              <th className="px-4 py-3">Automation status</th>
                              <th className="px-4 py-3" />
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-neutralBorder">
                              <td className="max-w-[280px] truncate px-4 py-3 text-primaryBlue">
                                https://automationtriggervault1.vault.azure.net/certificates/cert
                              </td>
                              <td className="px-4 py-3">—</td>
                              <td className="px-4 py-3">Azure Key Vault 12feb</td>
                              <td className="px-4 py-3">—</td>
                              <td className="px-4 py-3 text-right">↓ ⓘ ⋮</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="flex items-center justify-end gap-6 border-t border-neutralBorder px-4 py-3 text-sm text-textSecondary">
                          <span>Page Size: 25</span>
                          <span>1 to 1 of 1</span>
                          <span>Page 1 of 1</span>
                        </div>
                      </section>
                    </>
                  )}

                  {detailTab === 'Trust Intelligence Insights' && intelligenceEnabled && (
                    <section className="border-t border-neutralBorder bg-white p-section text-[#353535]">
                      <h3 className="mb-4 text-lg font-semibold">Trust Intelligence Insights</h3>
                      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="space-y-5">
                          <div>
                            <p className="mb-2 text-sm text-textSecondary">Risk Score</p>
                            <RiskBadgeWithTooltip
                              className={`inline-block rounded-enterprise border px-4 py-2 text-xl font-semibold ${
                                riskScoreBadge(getLiveRiskScore(selectedCertificate)).className
                              }`}
                              cert={selectedCertificate}
                              riskVersion={riskVersion}
                              numericValue={getLiveRiskScore(selectedCertificate)}
                              showHoverDetails
                              hoverPosition="right"
                            >
                              {riskScoreBadge(getLiveRiskScore(selectedCertificate)).label}
                            </RiskBadgeWithTooltip>
                          </div>
                          <div>
                            <p className="mb-3 text-sm font-semibold">Risk Breakdown</p>
                            {[
                              {
                                label: 'Expiry Risk',
                                value: selectedCertificate.expiryDays < 30 ? 86 : 34,
                              },
                              {
                                label: 'Algorithm Strength',
                                value: selectedCertificate.algorithm === 'RSA-2048' ? 72 : 38,
                              },
                              {
                                label: 'Environment Exposure',
                                value: selectedCertificate.businessUnit.includes('Automation') ? 57 : 41,
                              },
                              {
                                label: 'Revenue Criticality',
                                value: selectedCertificate.revenueCritical ? 90 : 28,
                              },
                            ].map((item) => (
                              <div key={item.label} className="mb-3">
                                <div className="mb-1 flex items-center justify-between text-sm">
                                  <span>{item.label}</span>
                                  <span>{item.value}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-[#E1E4E8]">
                                  <div
                                    className="h-2 rounded-full transition-all duration-200 ease-in-out"
                                    style={{
                                      width: `${item.value}%`,
                                      backgroundColor: breakdownTone(item.value),
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <ServiceImpactPath
                          simulationMode={simulationMode}
                          dependencyChain={detailDependencyChain}
                          className={`transition-all duration-[220ms] ease-out ${
                            detailImpactVisible
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-[6px] opacity-0'
                          }`}
                        />
                      </div>
                      <div className="mt-6 rounded-enterprise border border-neutralBorder bg-white p-4">
                        <p className="text-sm text-[#353535]">
                          This certificate expires in {selectedCertificate.expiryDays} days and secures
                          a production payment service without redundancy. Failure would disrupt checkout
                          flow.
                        </p>
                      </div>
                    </section>
                  )}

                  {detailTab === 'Additional details' && (
                    <section>
                      <dl className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
                        <div>
                          <dt className="text-xs text-textSecondary">Business unit</dt>
                          <dd className="mt-2 text-lg font-normal text-textPrimary">
                            {selectedCertificate.businessUnit} Business Unit
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-textSecondary">Seat ID</dt>
                          <dd className="mt-2 text-lg font-normal text-textPrimary">
                            {selectedCertificate.commonName}_26Mar02_BGFQPe
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-textSecondary">Seat type</dt>
                          <dd className="mt-2 text-lg font-normal text-textPrimary">{selectedCertificate.seatType}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-textSecondary">Certificate Owners</dt>
                          <dd className="mt-2 text-lg font-normal text-textPrimary">—</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-textSecondary">Tags</dt>
                          <dd className="mt-2 text-lg font-normal text-textPrimary">—</dd>
                        </div>
                      </dl>
                      <div className="mt-12 space-y-8 text-sm">
                        <div>
                          <p className="mb-2 text-2xl font-normal text-textPrimary">Custom attributes</p>
                          <div className="border-t border-dashed border-neutralBorder pt-3 text-textSecondary">
                            No custom attributes found. Select + to add custom attributes.
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-2xl font-normal text-textPrimary">Internal notes</p>
                          <div className="border-t border-dashed border-neutralBorder pt-3 text-textSecondary">Empty notes</div>
                        </div>
                        <div>
                          <p className="mb-2 text-2xl font-normal text-textPrimary">Enrollment notes</p>
                          <div className="border-t border-dashed border-neutralBorder pt-3 text-textSecondary">Empty notes</div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                {detailTab === 'Certificate' && (
                  <aside className="pt-2">
                    <h4 className="mb-4 text-2xl font-semibold text-textPrimary">On this page</h4>
                    <div className="border-l border-neutralBorder pl-4 text-sm text-textSecondary">
                      <p className="mb-3">Properties</p>
                      <p>Contacts</p>
                    </div>
                  </aside>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-section flex items-center justify-between">
                <h2 className="text-4xl font-semibold text-textPrimary">Inventory</h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-enterprise border border-primaryBlue bg-primaryBlue px-4 py-1.5 text-sm font-semibold text-white"
                  >
                    Admin web request
                  </button>
                  <button
                    type="button"
                    className="rounded-enterprise border border-primaryBlue bg-white px-4 py-1.5 text-sm font-semibold text-primaryBlue"
                  >
                    + Add integration
                  </button>
                  <button
                    type="button"
                    className="px-1 text-sm font-semibold text-primaryBlue"
                  >
                    Need help?
                  </button>
                  {!intelligenceEnabled ? (
                    <Tooltip text={TOOLTIP_TEXT.enableTrustIntelligence} position="right">
                      <button
                        type="button"
                        onClick={() => {
                          setIntelligenceEnabled(true);
                          setShowHighRiskOnly(false);
                          setKpiFilter('all');
                        }}
                        className="rounded-enterprise border border-primaryBlue bg-primaryBlue px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Enable Trust Intelligence
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      onClick={resetToOriginalInventoryState}
                      className="rounded-enterprise border border-primaryBlue px-3 py-1.5 text-xs font-semibold text-primaryBlue"
                    >
                      Disable Trust Intelligence
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-section border-b border-neutralBorder">
                <div className="flex gap-6 text-sm">
                  {topTabs.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 ${isActive ? 'border-b-2 border-textPrimary font-semibold text-textPrimary' : 'text-textSecondary'}`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-section grid grid-cols-1 gap-2 xl:grid-cols-5">
                <StatCard
                  label="Total certificates"
                  value={inventorySummary.totalCertificates.toLocaleString()}
                  color="#1E88E5"
                  riskVersion={riskVersion}
                  active={summaryFilter === 'all'}
                  onClick={() => setSummaryFilter('all')}
                />
                <StatCard
                  label="Expired certificates"
                  value={inventorySummary.expired.toLocaleString()}
                  color="#D32F2F"
                  riskVersion={riskVersion}
                  active={summaryFilter === 'expired'}
                  onClick={() => setSummaryFilter((prev) => (prev === 'expired' ? 'all' : 'expired'))}
                />
                <StatCard
                  label="Expiring soon"
                  value={inventorySummary.expiringSoon.toLocaleString()}
                  color="#F57C00"
                  riskVersion={riskVersion}
                  active={summaryFilter === 'expiringSoon'}
                  onClick={() =>
                    setSummaryFilter((prev) => (prev === 'expiringSoon' ? 'all' : 'expiringSoon'))
                  }
                />
                <StatCard
                  label="Revoked"
                  value={inventorySummary.revoked.toLocaleString()}
                  color="#D32F2F"
                  riskVersion={riskVersion}
                  active={summaryFilter === 'revoked'}
                  onClick={() => setSummaryFilter((prev) => (prev === 'revoked' ? 'all' : 'revoked'))}
                />
                <StatCard
                  label="Certificates with issues"
                  value={inventorySummary.issues.toLocaleString()}
                  color="#D32F2F"
                  riskVersion={riskVersion}
                  active={summaryFilter === 'issues'}
                  onClick={() => setSummaryFilter((prev) => (prev === 'issues' ? 'all' : 'issues'))}
                />
              </div>
              {intelligenceEnabled && (
                <div className="mb-section">
                  <div className="rounded-enterprise border-l-4 border-[#0174C3] bg-white p-2.5">
                    <div className="text-sm text-gray-500">Projected Risk Reduction</div>
                    <div className="text-xl font-semibold text-[#0174C3]">
                      {projectedReduction}%
                    </div>
                  </div>
                </div>
              )}

              {intelligenceEnabled && (
                <section className="mb-section rounded-enterprise border border-primaryBlue bg-blue-50 p-2.5 shadow-sm">
                  {contextualHighRiskCerts.length > 0 && (
                    <Tooltip text={TOOLTIP_TEXT.highRiskBanner}>
                      <button
                        type="button"
                        onClick={() => setShowHighRiskOnly((prev) => !prev)}
                        className="mb-2 w-full rounded-enterprise border border-[#E1E4E8] border-l-4 border-l-[#0174C3] bg-[#E8F1FA] px-3 py-1.5 text-left text-sm text-[#353535]"
                      >
                        TrustGuardian detected {contextualHighRiskCerts.length} high-risk production
                        certificates
                        {revenueImpactedCount > 0 ? ' affecting revenue services' : ''}
                      </button>
                    </Tooltip>
                  )}
                  {contextualHighRiskCerts.length === 0 && (
                    <Tooltip text={TOOLTIP_TEXT.neutralRiskPanel}>
                    <div className="mb-2 rounded-enterprise border border-[#DDE3E8] bg-[#F5F7FA] px-3 py-3 text-center text-[#353535]">
                      <p className="text-base font-semibold">
                        TrustGuardian detected no elevated risks.
                      </p>
                      <p className="mt-1 text-sm text-textSecondary">
                        All monitored certificates are within healthy thresholds.
                      </p>
                    </div>
                    </Tooltip>
                  )}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-primaryBlue">TrustGuardian AI is active</h3>
                      <p className="text-xs text-textSecondary">
                        Inventory is now risk-ranked with AI recommendations and live scoring.
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-textSecondary">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={showKPIs.risk}
                            onChange={() =>
                              setShowKPIs((prev) => ({ ...prev, risk: !prev.risk }))
                            }
                          />
                          Risk KPI
                        </label>
                        {quantumMode && (
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={showKPIs.quantum}
                              onChange={() =>
                                setShowKPIs((prev) => ({ ...prev, quantum: !prev.quantum }))
                              }
                            />
                            Quantum KPI
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip text={TOOLTIP_TEXT.sortDropdown}>
                      <label className="inline-flex items-center gap-2 rounded-enterprise border border-neutralBorder bg-white px-2 py-1 text-xs text-textSecondary">
                        <span className="font-semibold">Sort</span>
                        <select
                          value={sortMode}
                          onChange={(event) => setSortMode(event.target.value)}
                          className="bg-transparent text-xs text-textPrimary outline-none"
                        >
                          <option value="risk">Risk score (high to low)</option>
                          <option value="priority">Priority (high to low)</option>
                          <option value="expirySoon">Expiry (soonest first)</option>
                          <option value="confidenceLow">Confidence (low to high)</option>
                          <option value="revenueCritical">Revenue critical first</option>
                        </select>
                      </label>
                      </Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.executiveView}>
                        <label className="inline-flex items-center gap-1 rounded-enterprise border border-neutralBorder bg-white px-2 py-1 text-xs text-textSecondary">
                          <input
                            type="checkbox"
                            checked={executiveView}
                            onChange={() => setExecutiveView((prev) => !prev)}
                            className="h-3.5 w-3.5"
                          />
                          Executive
                        </label>
                      </Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.simulateExpiry}><button
                        type="button"
                        onClick={() =>
                          setSimulationMode((prev) => {
                            const next = !prev;
                            logCopilotActivity('Simulation Toggled', next ? 'Simulation enabled' : 'Simulation disabled');
                            bumpRiskVersion();
                            return next;
                          })
                        }
                        className={`rounded-enterprise border px-2 py-1 text-xs font-semibold ${
                          simulationMode
                            ? 'border-[#015A99] bg-[#015A99] text-white'
                            : 'border-[#0174C3] bg-[#0174C3] text-white hover:bg-[#015A99]'
                        }`}
                      >
                        {simulationMode ? 'Simulation On' : 'Simulate Expiry'}
                      </button></Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.quantumMode} position="right"><button
                        type="button"
                        onClick={() =>
                          setQuantumMode((prev) => {
                            const next = !prev;
                            logCopilotActivity('Quantum Mode Toggled', next ? 'Quantum mode enabled' : 'Quantum mode disabled');
                            bumpRiskVersion();
                            return next;
                          })
                        }
                        className={`rounded-enterprise border px-2 py-1 text-xs font-semibold ${
                          quantumMode
                            ? 'border-[#6B5BFF] bg-[#6B5BFF] text-white'
                            : 'border-neutralBorder bg-white text-textSecondary'
                        }`}
                      >
                        Quantum Readiness View {quantumMode ? 'On' : 'Off'}
                      </button></Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.aiCopilotToggle} position="right"><button
                        type="button"
                        onClick={() =>
                          setCopilotOpen((prev) => {
                            const next = !prev;
                            if (next) setCopilotIndicatorSeen(true);
                            return next;
                          })
                        }
                        className={`rounded-enterprise border px-2 py-1 text-xs font-semibold ${
                          copilotOpen
                            ? 'border-[#0174C3] bg-[#0174C3] text-white'
                            : 'border-neutralBorder bg-white text-textSecondary'
                        }`}
                      >
                        AI Copilot
                      </button></Tooltip>
                    </div>
                  </div>
                  <div className={`grid grid-cols-1 gap-1.5 ${quantumMode ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}>
                    {showKPIs.risk && (
                      <>
                    <button
                      type="button"
                      onClick={() => setKpiFilter('all')}
                      className={`rounded-enterprise border bg-white p-2 text-left ${
                        kpiFilter === 'all' ? 'border-primaryBlue' : 'border-neutralBorder'
                      }`}
                    >
                      <p className="text-xs text-textSecondary">Average Risk Score</p>
                      <p className={`text-2xl font-semibold text-textPrimary ${kpiPulse ? 'risk-pulse' : ''}`}>{averageRiskScore}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setKpiFilter((prev) => (prev === 'highRisk' ? 'all' : 'highRisk'))}
                      className={`rounded-enterprise border bg-white p-2 text-left ${
                        kpiFilter === 'highRisk' ? 'border-primaryBlue' : 'border-neutralBorder'
                      }`}
                    >
                      <p className="text-xs text-textSecondary">High Risk (80+)</p>
                      <p className={`text-2xl font-semibold text-textPrimary ${kpiPulse ? 'risk-pulse' : ''}`}>{highRiskCount}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setKpiFilter((prev) => (prev === 'expiring' ? 'all' : 'expiring'))}
                      className={`rounded-enterprise border bg-white p-2 text-left ${
                        kpiFilter === 'expiring' ? 'border-primaryBlue' : 'border-neutralBorder'
                      }`}
                    >
                      <p className="text-xs text-textSecondary">Expiry Under 30 Days</p>
                      <p className={`text-2xl font-semibold text-textPrimary ${kpiPulse ? 'risk-pulse' : ''}`}>{expiringSoonCount}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setKpiFilter((prev) => (prev === 'revenueCritical' ? 'all' : 'revenueCritical'))
                      }
                      className={`rounded-enterprise border bg-white p-2 text-left ${
                        kpiFilter === 'revenueCritical' ? 'border-primaryBlue' : 'border-neutralBorder'
                      }`}
                    >
                      <p className="text-xs text-textSecondary">Revenue Critical Certs</p>
                      <p className={`text-2xl font-semibold text-textPrimary ${kpiPulse ? 'risk-pulse' : ''}`}>{revenueCriticalCount}</p>
                    </button>
                      </>
                    )}
                    {showKPIs.quantum && quantumMode && (
                      <Tooltip text={TOOLTIP_TEXT.quantumScoreCard}>
                      <div className="rounded-enterprise border border-neutralBorder border-l-4 border-l-[#6B5BFF] bg-white p-1.5">
                        <p className="text-xs text-textSecondary">Quantum Readiness Score</p>
                        <p className="text-2xl font-semibold text-textPrimary">{quantumReadinessScore}%</p>
                      </div>
                      </Tooltip>
                    )}
                    {showKPIs.risk && (
                    <Tooltip text={TOOLTIP_TEXT.estimatedRiskReduction}>
                    <div className="rounded-enterprise border border-neutralBorder border-l-[3px] border-l-[#0174C3] bg-white p-1.5">
                      <p className="text-xs text-textSecondary">Estimated Downtime Risk Reduction</p>
                      <p className="text-2xl font-semibold text-[#0174C3]">
                        {projectedReduction}%
                      </p>
                      <p className="mt-1 text-xs text-textSecondary">
                        Based on proactive remediation modeling
                      </p>
                    </div>
                    </Tooltip>
                    )}
                  </div>

                  {showUpdatedNote && (
                    <div className="mt-1 text-xs text-[#6B7280] animate-fade-in-out">
                      Re-evaluated just now
                    </div>
                  )}

                  <section
                    className={`relative mt-3 rounded-enterprise border border-neutralBorder bg-white p-2.5 transition-all duration-200 ease-in-out ${
                      animatingDetail ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'
                    }`}
                  >
                    {simulationMode && (
                      <div className="pointer-events-none absolute inset-0 rounded-enterprise bg-[rgba(11,31,51,0.2)]" />
                    )}
                    <div className="relative z-10">
                      <Tooltip text={TOOLTIP_TEXT.simulationNode} position="left">
                        <p className="mb-3 text-sm font-semibold text-[#353535]">Dependency chain</p>
                      </Tooltip>
                      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                        {inventoryDependencyNodes.map((node) => (
                          <div
                            key={node.id}
                            className={`rounded-enterprise border px-2.5 py-1.5 text-sm ${
                              node.impacted
                                ? 'border-[#D32F2F] bg-[#FDECEA] text-[#D32F2F]'
                                : 'border-[#DDE3E8] bg-[#F0F3F5] text-[#353535]'
                            }`}
                          >
                            {node.name}
                          </div>
                        ))}
                      </div>
                      {simulationMode && (
                        <div className="mt-2 rounded-enterprise border border-neutralBorder border-l-4 border-l-[#D32F2F] bg-white p-1.5 text-sm text-[#353535]">
                          Expiry simulation impact: 3 dependent endpoints would require renewal within 48 hours.
                        </div>
                      )}
                    </div>
                  </section>

                  {quantumMode && (
                    <Tooltip text={TOOLTIP_TEXT.migrationPriorityList}>
                    <section className="mt-3 rounded-enterprise border border-neutralBorder bg-white p-2.5">
                      <p className="mb-3 text-sm font-semibold text-[#353535]">Migration priorities</p>
                      <ol className="space-y-2 text-sm text-[#353535]">
                        {displayedInventory
                          .filter((item) => item.algorithm === 'RSA-2048')
                          .slice(0, 3)
                          .map((item, index) => (
                            <li key={item.id} className="border-l-2 border-l-[#6B5BFF] pl-3">
                              {index + 1}. {item.commonName}
                            </li>
                          ))}
                      </ol>
                    </section>
                    </Tooltip>
                  )}
                </section>
              )}

              <section className="rounded-enterprise border border-neutralBorder bg-white shadow-sm">
                  <div className="border-b border-neutralBorder px-2.5 py-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-textPrimary">Certificate inventory</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tooltip text={TOOLTIP_TEXT.searchInput}>
                        <input
                          type="text"
                          placeholder="Search certificates..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          className="rounded-enterprise border border-neutralBorder px-2 py-1.5 text-sm"
                        />
                      </Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.businessUnitFilter}>
                        <select
                          value={filters.businessUnit}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, businessUnit: e.target.value }))
                          }
                          className="rounded-enterprise border border-neutralBorder px-2 py-1.5 text-sm"
                        >
                          <option value="">All Business Units</option>
                          {uniqueBusinessUnits.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </Tooltip>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="rounded-enterprise border border-neutralBorder px-2 py-1.5 text-sm"
                      >
                        <option value="">All Statuses</option>
                        {uniqueStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Tooltip text={TOOLTIP_TEXT.savedViews}>
                        <button
                          type="button"
                          onClick={() =>
                            setSavedViews((prev) => [...prev, { searchText, filters }])
                          }
                          className="rounded-enterprise border border-neutralBorder bg-white px-2.5 py-1.5 text-xs"
                        >
                          Save View
                        </button>
                      </Tooltip>
                      <Tooltip text={TOOLTIP_TEXT.exportCSV} position="right">
                        <button
                          type="button"
                          onClick={() => exportToCSV(inventory, intelligenceEnabled)}
                          className="rounded-enterprise bg-[#0052CC] px-2.5 py-1.5 text-xs text-white"
                        >
                          Export CSV
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  {savedViews.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {savedViews.map((view, i) => (
                        <button
                          type="button"
                          key={`${view.searchText}-${i}`}
                          onClick={() => {
                            setSearchText(view.searchText);
                            setFilters(view.filters);
                          }}
                          className="rounded-enterprise border border-neutralBorder bg-white px-2 py-1 text-xs text-textSecondary"
                        >
                          View {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 rounded-enterprise border border-neutralBorder bg-[#F7F8FA] px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setFiltersPanelOpen((prev) => !prev)}
                      className="mb-2 flex items-center gap-2"
                    >
                      <span className="text-[10px] text-textSecondary">
                        {filtersPanelOpen ? '▲' : '▼'}
                      </span>
                      <p className="text-sm font-semibold text-textPrimary">Applied filters</p>
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6E7781] px-1 text-[11px] text-white">
                        {appliedFilters.length}
                      </span>
                    </button>
                    {filtersPanelOpen && (
                      <div className="flex flex-wrap items-center gap-2">
                        {appliedFilters.length === 0 ? (
                          <span className="text-xs text-textSecondary">No filters applied</span>
                        ) : (
                          appliedFilters.map((filter) => (
                            <button
                              key={filter.key}
                              type="button"
                              onClick={() => removeAppliedFilter(filter.key)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#E6E8EB] px-2.5 py-1 text-xs text-[#353535]"
                              title="Remove filter"
                            >
                              <span>{filter.label}</span>
                              <span className="text-[#6E7781]">×</span>
                            </button>
                          ))
                        )}
                        {appliedFilters.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllFilters}
                            className="ml-1 text-sm font-semibold text-[#0174C3]"
                          >
                            Clear all filters ×
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-textSecondary">
                      <tr>
                        <th className="w-10 px-2.5 py-1.5 text-left" />
                        <th className="px-2.5 py-1.5 text-left">Common name</th>
                        <th className="px-2.5 py-1.5 text-left">Seat type</th>
                        <th className="px-2.5 py-1.5 text-left">CA vendor</th>
                        {!executiveView && <th className="px-2.5 py-1.5 text-left">Algorithm</th>}
                        <th className="px-2.5 py-1.5 text-left">Status</th>
                        {intelligenceEnabled && <th className="px-2.5 py-1.5 text-left">Risk score</th>}
                        <th className="px-2.5 py-1.5 text-left">Valid to</th>
                        <th className="px-2.5 py-1.5 text-left">Valid from</th>
                        <th className="px-2.5 py-1.5 text-left">Business unit</th>
                        {!executiveView && <th className="px-2.5 py-1.5 text-left">Instances</th>}
                        {executiveView && <th className="px-2.5 py-1.5 text-left">Revenue Exposure</th>}
                        {executiveView && <th className="px-2.5 py-1.5 text-left">Outage Risk</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((cert, index) => {
                        const selected = selectedRows.includes(cert.id);
                        const expanded = !!expandedRows[cert.id];
                        return (
                          <InventoryRow
                            key={cert.id}
                            cert={cert}
                            index={index}
                            intelligenceEnabled={intelligenceEnabled}
                            executiveView={executiveView}
                            quantumMode={quantumMode}
                            selected={selected}
                            expanded={expanded}
                            onToggleRow={toggleRow}
                            onToggleExpand={toggleExpandedRow}
                            onOpenDetail={openCertificateDetail}
                            riskVersion={riskVersion}
                            detailColSpan={detailColSpan}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          </div>
        </main>

        <aside
          className={`flex flex-col border-l border-neutralBorder bg-white transition-all ${
            copilotOpen ? 'w-full p-3 md:w-72' : 'w-0 overflow-hidden p-0'
          }`}
        >
          <div className="flex-1 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-textPrimary">AI Copilot</h3>
              <button
                type="button"
                onClick={() => setCopilotOpen(false)}
                className="rounded-enterprise border border-neutralBorder px-2 py-1 text-xs text-textSecondary"
              >
                x
              </button>
            </div>
          <Tooltip text={TOOLTIP_TEXT.confidenceTooltip}>
            <div className="mt-2 inline-flex items-center rounded-full bg-[#F0F3F5] px-2.5 py-1 text-[11px] text-[#6B778C]">
              Recommendation Confidence: {recommendationConfidence}%
            </div>
          </Tooltip>
          <p className="mt-1 text-xs text-textSecondary">
            Scope: {selectedCertificate ? selectedCertificate.commonName : `${copilotContextCertificates.length} cert(s)`}
          </p>
            <div className="mt-3 space-y-2">
            {copilotSuggestions.slice(0, 3).map((item, index) => (
              <div key={index} className="rounded-enterprise border border-neutralBorder bg-white p-2 text-xs text-textPrimary shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-[12px]">{item.title}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase ${
                      item.severity === 'critical'
                        ? 'bg-red-50 text-[#D32F2F]'
                        : item.severity === 'warning'
                          ? 'bg-orange-50 text-[#F57C00]'
                          : 'bg-blue-50 text-[#0174C3]'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className="mb-1 text-xs text-textSecondary">
                  {typeof item.count === 'number' && item.filterKey ? (
                    <>
                      <button
                        type="button"
                        onClick={() => applyCopilotSuggestionFilter(item.filterKey)}
                        className="mr-1 font-semibold text-primaryBlue underline"
                      >
                        {item.count}
                      </button>
                      {item.countLabel}
                    </>
                  ) : (
                    item.description
                  )}
                </p>
                <p className="text-xs text-textSecondary">
                  <span className="font-semibold text-textPrimary">Action:</span> {item.recommendedAction}
                </p>
              </div>
            ))}
            </div>
          </div>
          <div className="mt-2 rounded-enterprise border border-neutralBorder bg-white p-2.5">
            <div className="mb-2 text-sm font-medium">Recommended Actions</div>
            <label className="mb-2 inline-flex items-center gap-2 text-xs text-textSecondary">
              <span className="font-semibold">Strategy</span>
              <select
                value={remediationStrategy}
                onChange={(event) => setRemediationStrategy(event.target.value)}
                className="rounded-enterprise border border-neutralBorder bg-white px-2 py-1 text-xs text-textPrimary outline-none"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              <Tooltip text={TOOLTIP_TEXT.previewFix}>
                <button
                  className="rounded border border-[#0174C3] px-3 py-1 text-xs text-[#0174C3]"
                  onClick={handlePreviewFix}
                  type="button"
                >
                  Preview Fix
                </button>
              </Tooltip>
              {previewFixResults && (
                <button
                  className="rounded bg-[#0174C3] px-3 py-1 text-xs text-white"
                  onClick={handleApplyPreviewFix}
                  type="button"
                >
                  Apply Fix
                </button>
              )}
              <Tooltip text={TOOLTIP_TEXT.autoFixTopRisks}>
                <button
                  className="rounded bg-[#0174C3] px-3 py-1 text-xs text-white"
                  onClick={() => {
                  snapshotBeforeMutation();
                  const affectedIds = copilotContextCertificates
                    .filter((cert) => {
                      const score = getLiveRiskScore(cert);
                      if (remediationStrategy === 'conservative') {
                        return score >= 80 && cert.environment === 'Production';
                      }
                      if (remediationStrategy === 'aggressive') {
                        return cert.revenueCritical === true;
                      }
                      return score >= 70 || cert.expiryDays < 15;
                    })
                    .map((cert) => cert.id);
                  setFixOverrides((prev) => {
                    const next = { ...prev };
                    affectedIds.forEach((id) => {
                      next[id] = {
                        ...(next[id] ?? {}),
                        autoRenewStatus: 'Enabled',
                        redundancy: true,
                      };
                    });
                    return next;
                  });
                  logCopilotActivity(
                    'Auto-Fix Applied',
                    `${remediationStrategy} strategy applied to ${affectedIds.length} certificates`
                  );
                  bumpRiskVersion();
                  }}
                  type="button"
                >
                  Auto-Fix Top Risks
                </button>
              </Tooltip>
              <button
                className="rounded border border-[#0174C3] px-3 py-1 text-xs text-[#0174C3]"
                onClick={() => handleSimulateFix(copilotContextCertificates[0])}
                type="button"
              >
                Simulate Fix
              </button>
              <button className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700" type="button">
                Mark Remediated
              </button>
              {previousInventoryState && (
                <Tooltip text={TOOLTIP_TEXT.undoAction}>
                  <button
                    className="ml-2 rounded border border-neutralBorder px-3 py-1 text-xs text-textSecondary"
                    onClick={handleUndoFix}
                    type="button"
                  >
                    Undo
                  </button>
                </Tooltip>
              )}
            </div>
            {previewFixResults && (
              <div className="mb-3 rounded-enterprise border border-neutralBorder bg-[#F9FAFB] p-3 text-xs text-textSecondary">
                <p className="mb-2 font-semibold text-textPrimary">Current vs After Fix</p>
                <div className="grid grid-cols-2 gap-2">
                  <p>Avg risk: <span className="text-textPrimary">{previewFixResults.currentAvgRisk}</span></p>
                  <p>After: <span className="text-textPrimary">{previewFixResults.afterAvgRisk}</span></p>
                  <p>High-risk certs: <span className="text-textPrimary">{previewFixResults.currentHighRiskCount}</span></p>
                  <p>After: <span className="text-textPrimary">{previewFixResults.afterHighRiskCount}</span></p>
                </div>
                <p className="mt-2">
                  Risk delta: <span className="font-semibold text-[#0174C3]">{previewFixResults.riskDelta}</span>
                </p>
                <p>
                  Impact delta: <span className="font-semibold text-[#0174C3]">{previewFixResults.impactDelta}</span>
                </p>
                <p>
                  Downtime risk reduction: <span className="font-semibold text-[#0174C3]">{previewFixResults.downtimeReduction}%</span>
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowCopilotTimeline((prev) => !prev)}
              className="text-xs font-semibold text-primaryBlue"
            >
              {showCopilotTimeline ? 'Hide activity timeline' : 'Show activity timeline'}
            </button>
            {showCopilotTimeline && (
              <div className="mt-2 max-h-36 space-y-1 overflow-auto text-xs text-textSecondary">
                {copilotActivity.length === 0 ? (
                  <p>No activity yet.</p>
                ) : (
                  copilotActivity.map((item) => (
                    <p key={item.id}>
                      {new Date(item.timestamp).toLocaleTimeString()} - {item.action}
                      {item.detail ? `: ${item.detail}` : ''}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
