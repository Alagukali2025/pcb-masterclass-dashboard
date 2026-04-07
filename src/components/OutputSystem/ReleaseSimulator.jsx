import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Loader2,
  FolderTree,
  Terminal as TerminalIcon
} from 'lucide-react';
import './OutputSystem.css';

const fileTree = {
  name: 'PROJECT_REL_v1.0',
  children: [
    { name: 'Fabrication', files: ['TopCopper.gbr', 'BotCopper.gbr', 'NC_Drill.drl', 'FabDrawing.pdf'] },
    { name: 'Assembly', files: ['PickPlace.csv', 'BOM.xlsx', 'AsmDrawing.pdf', 'Stencil.gbr'] },
    { name: 'Test', files: ['IPC-D-356.ipc', 'TestPointReport.csv'] }
  ]
};

export default function ReleaseSimulator() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle'); // idle, verifying, success
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-4), msg]); // Keep fewer logs for cleaner terminal
  };

  const handleVerify = () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    setExportStatus('verifying');
    setLogs([]);
    
    const steps = [
      "Initializing AI-Driven DFM Engine...",
      "Validating Gerber X2 Metadata & Layer Polarity...",
      "Scanning for Acute Angle Acid Traps (<90°)...",
      "Verifying Annular Ring Aspect Ratio (Min 5 mil)...",
      "Synchronizing IPC-D-356 Netlist vs Artwork...",
      "Analyzing 0201 Solder Paste Stencil Area Ratios...",
      "Checking PnP Rotation against EIA-481 Standards...",
      "Package Certified: IPC Class 3 Engineering Sign-Off"
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);
        if (index === steps.length - 1) {
          setIsVerifying(false);
          setExportStatus('success');
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div className="release-simulator-block slide-up">
      <div className="simulator-grid">
        <div className="simulator-main">
          <div className="simulator-header">
            <TerminalIcon size={20} className="text-accent" />
            <h3>Manufacturing Release Terminal</h3>
          </div>
          
          <div className={`terminal-output ${isVerifying ? 'active' : (logs.length > 0 ? 'active' : '')}`}>
            {logs.length === 0 && !isVerifying && (
              <div className="log-placeholder">System Idle. Awaiting verification...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="log-line">
                <span className="log-prefix">&gt;</span> {log}
              </div>
            ))}
          </div>
          
          <button 
            className={`export-btn ${exportStatus}`}
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <><Loader2 className="animate-spin" size={20} /> Verifying Design Package...</>
            ) : exportStatus === 'success' ? (
              <><Download size={20} /> Download Production Bundle</>
            ) : (
              <><ShieldCheck size={20} /> Run Manufacturing Check</>
            )}
          </button>
        </div>

        <div className="simulator-sidebar">
          <div className="preview-header">
            <FolderTree size={16} /> Virtual Package Archive
          </div>
          <div className="file-tree">
            <div className="tree-root">/ {fileTree.name}</div>
            {fileTree.children.map((child, i) => (
              <div key={i} className="tree-folder">
                <div className="folder-name">📁 {child.name}</div>
                <div className="folder-files-grid">
                  {child.files.map((f, j) => (
                    <div key={j} className="tree-file">📄 {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
