import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, ArrowLeft, Bell, BookOpen, BriefcaseBusiness, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Download, Eye,
  FileCheck2, FileSearch, Filter, Globe2, LayoutDashboard, Languages, Lock,
  Menu, Network, PanelLeftClose, RefreshCw, Search, Settings, ShieldCheck,
  SlidersHorizontal, Sparkles, UserRound, Users, X, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import './styles.css';

const discovery = [
  { d: 'Mon', links: 38 }, { d: 'Tue', links: 52 }, { d: 'Wed', links: 45 }, { d: 'Thu', links: 67 }, { d: 'Fri', links: 61 }, { d: 'Sat', links: 78 }, { d: 'Sun', links: 71 },
];
const caseRows = [
  { id: 'CASE-2418', type: 'Organised theft', entities: 7, priority: 'High', updated: '12 Aug 2026', owner: 'FIU North-East', status: 'Review' },
  { id: 'CASE-2381', type: 'Financial fraud', entities: 11, priority: 'Medium', updated: '09 Aug 2026', owner: 'Cyber Cell', status: 'Active' },
  { id: 'CASE-2297', type: 'Vehicle network', entities: 5, priority: 'High', updated: '02 Aug 2026', owner: 'Field Unit 04', status: 'Review' },
  { id: 'CASE-2214', type: 'Document forgery', entities: 8, priority: 'Low', updated: '29 Jul 2026', owner: 'District Desk', status: 'Closed' },
  { id: 'CASE-2190', type: 'Property fraud', entities: 13, priority: 'Medium', updated: '27 Jul 2026', owner: 'FIU East', status: 'Active' }
];
const entities = [
  ['ENT-00821', 'R. Sharma', 'Person', '9 cases', '94%'],
  ['ENT-01492', 'Northeast Logistics', 'Organisation', '4 cases', '91%'],
  ['ENT-00418', 'Guwahati', 'Place', '18 cases', '—'],
  ['ENT-00277', 'AS01-XX-2418', 'Identifier', '3 cases', '98%']
];
const roleCopy = {
  'Investigator': { title: 'Investigation Workspace', subtitle: 'Find, connect and verify relationships across approved records.', initials: 'IN' },
  'Ministry Admin': { title: 'Command & Oversight', subtitle: 'Monitor platform health, access and investigation activity.', initials: 'AD' },
  'Field Officer': { title: 'Field Intelligence Desk', subtitle: 'Capture observations, verify leads and sync approved evidence.', initials: 'FO' },
  'Public User': { title: 'Public Information Portal', subtitle: 'Submit information and track reference status without exposing restricted data.', initials: 'PU' }
};

function App() {
  const [role, setRole] = useState('Investigator');
  const [page, setPage] = useState('Overview');
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('EN');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [density, setDensity] = useState('Comfortable');

  const copy = roleCopy[role];
  const filteredCases = useMemo(() => caseRows.filter(r => Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  const navigate = (next) => { setPage(next); setMobileOpen(false); };
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const refresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); notify('Workspace data refreshed'); }, 650);
  };

  return <div className={`app ${density === 'Compact' ? 'compact' : ''}`}>
    <Sidebar page={page} role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} navigate={navigate} />
    <main>
      <Header role={role} copy={copy} lang={lang} setLang={setLang} onMenu={() => setMobileOpen(true)} notify={notify} />
      <div className="content">
        <div className="topline">
          <div><span className="eyebrow"><span className="status-dot"/> SECURE INTELLIGENCE WORKSPACE</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
          <div className="role-control"><label>Portal role</label><div className="select-wrap"><Users size={15}/><select value={role} onChange={e => { setRole(e.target.value); setPage('Overview'); }}><option>Investigator</option><option>Ministry Admin</option><option>Field Officer</option><option>Public User</option></select><ChevronDown size={14}/></div></div>
        </div>

        <SearchBar query={query} setQuery={setQuery} onSearch={() => notify(query ? `Searching approved records for “${query}”` : 'Enter a person, case or identifier')} />

        {loading ? <LoadingState /> : <>
          {page === 'Overview' && <Overview role={role} navigate={navigate} onReview={() => setReviewOpen(true)} />}
          {page === 'Network Analysis' && <NetworkPage query={query} notify={notify} />}
          {page === 'Cases' && <CasesPage query={query} setQuery={setQuery} filteredCases={filteredCases} notify={notify} />}
          {page === 'Entities' && <EntitiesPage query={query} />}
          {page === 'Timeline' && <TimelinePage />}
          {page === 'Audit Trail' && <AuditPage />}
          {page === 'Settings' && <SettingsPage density={density} setDensity={setDensity} lang={lang} setLang={setLang} notify={notify} />}
          {page === 'Help & guidance' && <HelpPage />}
        </>}

        <ResponsibleNotice />
        <footer><span>TraceGraph • SIH26189</span><span>Last sync 12:04 IST • RBAC enforced • Audit logging active</span></footer>
      </div>
    </main>
    {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} notify={notify} />}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}

function Sidebar({ page, role, open, onClose, navigate }) {
  const workspace = [
    ['Overview', LayoutDashboard], ['Network Analysis', Network], ['Cases', BriefcaseBusiness], ['Entities', UserRound], ['Timeline', Clock3], ['Audit Trail', FileCheck2]
  ];
  return <>
    {open && <div className="scrim" onClick={onClose}/>}<aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><div className="brandmark"><Network size={21}/></div><div><b>TraceGraph</b><span>SIH 2026 • SIH26189</span></div><button className="mobile-close" onClick={onClose}><X size={18}/></button></div>
      <div className="portal-pill"><span>{role === 'Ministry Admin' ? 'ADMIN' : role === 'Field Officer' ? 'FIELD' : role === 'Public User' ? 'PUBLIC' : 'INVESTIGATOR'}</span><small>Role-scoped access</small></div>
      <nav><div className="nav-label">WORKSPACE</div>{workspace.map(([label, Icon]) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => navigate(label)}><Icon size={16}/><span>{label}</span>{label === 'Network Analysis' && <em>AI</em>}</button>)}<div className="nav-label">SYSTEM</div><button className={`nav-item ${page === 'Settings' ? 'active' : ''}`} onClick={() => navigate('Settings')}><Settings size={16}/><span>Settings</span></button><button className={`nav-item ${page === 'Help & guidance' ? 'active' : ''}`} onClick={() => navigate('Help & guidance')}><CircleHelp size={16}/><span>Help & guidance</span></button></nav>
      <div className="secure-card"><ShieldCheck size={17}/><div><b>Secure workspace</b><span>Encrypted • Logged • RBAC</span></div></div>
    </aside></>;
}

function Header({ role, copy, lang, setLang, onMenu, notify }) {
  return <header><div className="header-left"><button className="menu-btn" onClick={onMenu}><Menu size={20}/></button><span className="breadcrumb">Investigation Workspace <ChevronRight size={14}/> {copy.title}</span></div><div className="header-right"><button className="header-btn" onClick={() => setLang(lang === 'EN' ? 'हिं' : 'EN')}><Languages size={15}/>{lang}</button><button className="header-icon" onClick={() => notify('No new critical alerts')}><Bell size={17}/><i/></button><div className="avatar">{copy.initials}</div><div className="profile"><b>{role}</b><span>Field Intelligence Unit</span></div></div></header>;
}

function SearchBar({ query, setQuery, onSearch }) { return <div className="global-search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch()} placeholder="Search person, case ID, organisation, place or identifier…"/><kbd>⌘ K</kbd><button onClick={onSearch}>Search</button></div>; }

function Overview({ role, navigate, onReview }) {
  const metrics = role === 'Ministry Admin' ? [['Active cases', '1,284', '+12.4%', BriefcaseBusiness], ['Approved records', '48.2K', '+8.7%', Database], ['Review SLA', '93%', '+4.1%', Activity], ['Access events', '12.8K', 'Audited', ShieldCheck]] : role === 'Field Officer' ? [['Assigned cases', '42', '+6', BriefcaseBusiness], ['Pending sync', '08', '2 urgent', RefreshCw], ['Leads to verify', '19', '-4', Sparkles], ['Evidence uploads', '164', '+18%', FileCheck2]] : role === 'Public User' ? [['Submitted reports', '14', 'This month', FileSearch], ['Under review', '05', 'In progress', Clock3], ['Resolved', '09', 'Status available', Check], ['Privacy status', 'Protected', 'RBAC', Lock]] : [['Cases analysed', '1,284', '+12.4%', FileSearch], ['Entities resolved', '8,642', '+8.7%', UserRound], ['Candidate links', '3,918', '+18.2%', Network], ['Pending reviews', '46', '-9.1%', Clock3]];
  return <>
    <section className="metric-grid">{metrics.map(([label, value, trend, Icon]) => <div className="metric" key={label}><div className="metric-icon"><Icon size={17}/></div><div><span>{label}</span><strong>{value}</strong><small className={trend.startsWith('-') || trend === '93%' ? 'positive' : ''}>{trend}</small></div></div>)}</section>
    <section className="two-col"><div className="card chart-card"><CardHead title="Relationship discovery" subtitle="AI-ranked candidate links surfaced" action="Last 7 days"/><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={discovery}><XAxis dataKey="d" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="links" strokeWidth={2.4} fillOpacity={0.08}/></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span><i/> Candidate links</span><span>Peak: 78</span></div></div>
      <div className="card"><CardHead title="Review queue" subtitle="Evidence-backed leads requiring human review" action="View all" onAction={onReview}/><div className="queue">{[['Shared identifier','CASE-2418 ↔ CASE-2297','92%'],['Repeated association','Person ↔ Organisation','87%'],['Common location','Guwahati • 3 cases','81%']].map((x,i)=><button className="queue-row" key={x[0]} onClick={onReview}><div className="queue-icon">{i === 0 ? <ShieldCheck size={15}/> : <Sparkles size={15}/>}</div><div><b>{x[0]}</b><span>{x[1]}</span></div><strong>{x[2]}</strong><ChevronRight size={14}/></button>)}</div><div className="traceable"><Check size={15}/><span><b>Traceable AI:</b> every surfaced lead can point to supporting records.</span></div></div></section>
    <section className="card quick-actions"><CardHead title="Investigator shortcuts" subtitle="Start from the task, not the technology."/><div className="shortcut-grid"><button onClick={() => navigate('Network Analysis')}><Network/><b>Explore a network</b><span>Expand an entity neighbourhood</span></button><button onClick={() => navigate('Cases')}><FileSearch/><b>Compare cases</b><span>Find shared entities and attributes</span></button><button onClick={() => navigate('Entities')}><UserRound/><b>Resolve an entity</b><span>Review identity candidates</span></button><button onClick={() => navigate('Timeline')}><Clock3/><b>View timeline</b><span>Understand relationships over time</span></button></div></section>
    <section className="card cases-card"><CardHead title="Recent investigations" subtitle="Cases available in your current role scope" action="Open case list" onAction={() => navigate('Cases')}/><CaseTable rows={caseRows.slice(0,4)}/></section>
  </>;
}
function CardHead({ title, subtitle, action, onAction }) { return <div className="card-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button className="ghost-btn" onClick={onAction}>{action}<ChevronRight size={14}/></button>}</div>; }
function CaseTable({ rows }) { return <div className="table-wrap"><table><thead><tr><th>CASE</th><th>TYPE</th><th>NETWORK</th><th>PRIORITY</th><th>UPDATED</th><th>STATUS</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td><b>{r.id}</b></td><td>{r.type}</td><td>{r.entities} entities</td><td><Badge value={r.priority}/></td><td>{r.updated}</td><td><Badge value={r.status}/></td></tr>)}</tbody></table></div>; }
function Badge({ value }) { return <span className={`badge ${value.toLowerCase().replaceAll(' ','-')}`}>{value}</span>; }

function NetworkPage({ query, notify }) { return <section className="network-page"><div className="page-toolbar"><div><h2>Relationship graph</h2><p>Evidence-backed connections. Select a node or edge to inspect provenance.</p></div><div className="toolbar-actions"><button className="ghost-btn"><Filter size={14}/> Filters</button><button className="primary-btn" onClick={() => notify('Graph layout recalculated')}><Zap size={14}/> Recalculate</button></div></div><div className="network-layout"><div className="graph-card"><div className="graph-top"><span className="live-chip"><i/> LIVE GRAPH</span><span>128 nodes • 246 edges</span></div><div className="graph-canvas"><div className="grid-bg"/><div className="edge e1"/><div className="edge e2"/><div className="edge e3"/><div className="edge e4"/><Node x="50%" y="48%" main label={query || 'R. Sharma'} meta="Person • 94% match"/><Node x="25%" y="28%" label="CASE-2418" meta="Case"/><Node x="77%" y="26%" label="Northeast Logistics" meta="Organisation"/><Node x="25%" y="72%" label="Guwahati" meta="Place"/><Node x="78%" y="70%" label="AS01-XX-2418" meta="Identifier"/></div><div className="graph-legend"><span><i className="dot person"/>Person</span><span><i className="dot case"/>Case</span><span><i className="dot org"/>Organisation</span><span><i className="dot place"/>Place</span></div></div><aside className="relationship-panel"><div className="panel-title"><div><span className="eyebrow">SELECTED RELATIONSHIP</span><h3>Shared identifier</h3></div><span className="confidence">92%</span></div><div className="relationship-flow"><b>R. Sharma</b><span>shares</span><b>AS01-XX-2418</b></div><div className="why"><Sparkles size={16}/><div><b>Why surfaced</b><p>Identifier appears across 3 approved records with matching vehicle context.</p></div></div><h4>Supporting records</h4>{['CASE-2418 • Incident report','CASE-2297 • Vehicle record','REG-00821 • Identifier index'].map(x => <div className="record" key={x}><FileCheck2 size={15}/><span>{x}</span><Eye size={14}/></div>)}<button className="primary-btn full" onClick={() => notify('Review opened with evidence context')}>Review evidence</button></aside></div></section>; }
function Node({ x,y,label,meta,main }) { return <div className={`node ${main ? 'main' : ''}`} style={{left:x,top:y}}><div className="node-circle"><Network size={main ? 20 : 15}/></div><div className="node-label"><b>{label}</b><span>{meta}</span></div></div>; }

function CasesPage({ query, setQuery, filteredCases, notify }) { return <section className="card page-card"><div className="page-toolbar"><div><h2>Cases</h2><p>Search, filter and review only the cases permitted by your role.</p></div><button className="primary-btn" onClick={() => notify('Export prepared for approved records') }><Download size={14}/> Export</button></div><div className="filterbar"><div className="mini-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter cases…"/></div><button className="ghost-btn"><SlidersHorizontal size={14}/> Priority</button><button className="ghost-btn">Status <ChevronDown size={14}/></button><span className="result-count">{filteredCases.length} results</span></div><CaseTable rows={filteredCases}/>{filteredCases.length === 0 && <EmptyState text="No approved cases match this search."/>}</section>; }
function EntitiesPage({ query }) { const rows = entities.filter(x => x.join(' ').toLowerCase().includes(query.toLowerCase())); return <section className="card page-card"><div className="page-toolbar"><div><h2>Entity resolution</h2><p>Review candidate matches before records are connected.</p></div><span className="safe-chip"><ShieldCheck size={14}/> Human review required</span></div><div className="entity-list">{rows.map(e=><div className="entity-row" key={e[0]}><div className="entity-avatar">{e[2] === 'Person' ? <UserRound size={16}/> : e[2] === 'Place' ? <Globe2 size={16}/> : <Database size={16}/>}</div><div className="entity-main"><b>{e[1]}</b><span>{e[0]} • {e[2]}</span></div><span>{e[3]}</span><strong>{e[4]}</strong><button className="ghost-btn">Review <ChevronRight size={13}/></button></div>)}</div>{!rows.length && <EmptyState text="No matching entities found."/>}</section>; }
function TimelinePage(){ return <section className="card page-card"><CardHead title="Investigation timeline" subtitle="Trace relationships across dates, locations and events."/><div className="timeline">{[['12 Aug 2026','CASE-2418 updated','New supporting record attached','High'],['09 Aug 2026','CASE-2381 linked','Shared entity candidate surfaced','Medium'],['02 Aug 2026','CASE-2297 created','Vehicle record ingested','High'],['29 Jul 2026','CASE-2214 closed','Evidence review completed','Low']].map(x=><div className="timeline-row" key={x[0]}><div className="timeline-dot"/><div><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p></div><Badge value={x[3]}/></div>)}</div></section>; }
function AuditPage(){ return <section className="card page-card"><div className="page-toolbar"><div><h2>Audit trail</h2><p>Immutable-style activity view for accountability and review.</p></div><span className="safe-chip"><Lock size={14}/> Access events logged</span></div><div className="audit-table">{[['12:04','Investigator','Opened CASE-2418','Allowed'],['11:58','AI service','Surfaced candidate link #3918','Recorded'],['11:41','Field Officer','Uploaded approved record','Allowed'],['11:10','Admin','Changed role permission','Logged']].map(x=><div className="audit-row" key={x[0]}><time>{x[0]}</time><b>{x[1]}</b><span>{x[2]}</span><Badge value={x[3]}/></div>)}</div></section>; }
function SettingsPage({ density, setDensity, lang, setLang, notify }){ return <section className="settings-grid"><div className="card page-card"><CardHead title="Workspace preferences" subtitle="Adjust presentation without changing access controls."/><label className="setting"><span>Language</span><select value={lang} onChange={e=>setLang(e.target.value)}><option>EN</option><option>हिं</option></select></label><label className="setting"><span>Density</span><select value={density} onChange={e=>setDensity(e.target.value)}><option>Comfortable</option><option>Compact</option></select></label><button className="primary-btn" onClick={()=>notify('Preferences saved')}>Save preferences</button></div><div className="card page-card"><CardHead title="Security posture" subtitle="Controls shown here are read-only for this prototype."/><div className="security-list"><div><ShieldCheck/><span><b>Role-based access</b><small>Enabled for all portals</small></span><Badge value="Active"/></div><div><Lock/><span><b>Encryption</b><small>Protected transport and storage</small></span><Badge value="Active"/></div><div><FileCheck2/><span><b>Audit logging</b><small>Investigation actions recorded</small></span><Badge value="Active"/></div></div></div></section>; }
function HelpPage(){ return <section className="help-grid"><div className="card page-card"><CardHead title="How TraceGraph works" subtitle="A six-step explainable intelligence workflow."/>{['Ingest approved records','Extract people, organisations, places, cases and dates','Resolve candidate identities','Connect evidence-backed relationships','Rank useful patterns','Explain every surfaced lead with provenance'].map((x,i)=><div className="help-step" key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><ChevronRight size={14}/></div>)}</div><div className="card page-card"><div className="help-callout"><BookOpen size={18}/><b>Design principle</b><p>Scan → expand → verify → decide. AI supports investigation; it does not declare guilt.</p></div><div className="help-callout"><AlertTriangle size={18}/><b>Need assistance?</b><p>Connect this panel to your department SOPs, escalation contacts and approved data-handling guidance.</p></div></div></section>; }
function LoadingState(){ return <div className="state-card"><RefreshCw className="spin" size={22}/><b>Syncing workspace…</b><span>Fetching the latest approved records.</span></div>; }
function EmptyState({text}){ return <div className="empty"><Search size={22}/><b>{text}</b><span>Try a different term or remove a filter.</span></div>; }
function ResponsibleNotice(){ return <div className="notice"><ShieldCheck size={17}/><div><b>Responsible intelligence</b><span>AI suggestions are leads only. Evidence and human review remain the basis for investigative decisions.</span></div><button>Governance note</button></div>; }
function ReviewModal({onClose,notify}){ return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">REVIEW QUEUE</span><h2>Candidate relationship</h2></div><button onClick={onClose}><X size={18}/></button></div><div className="modal-confidence"><span>Confidence</span><strong>92%</strong></div><div className="modal-body"><div><b>Shared identifier</b><p>R. Sharma ↔ AS01-XX-2418</p></div><div className="evidence-box"><FileCheck2 size={17}/><div><b>Evidence available</b><span>3 approved records • 2 matching attributes • 1 common event context</span></div></div></div><div className="modal-actions"><button className="ghost-btn" onClick={onClose}>Close</button><button className="primary-btn" onClick={()=>{notify('Lead marked for human validation');onClose();}}><Check size={15}/> Mark for validation</button></div></div></div>; }

createRoot(document.getElementById('root')).render(<App/>);
