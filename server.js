const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pcb-dashboard.html'));
});

// NEW: Real IPC-7351 Industrial Standards Data
app.get('/api/ipc-standards', (req, res) => {
    const ipcData = {
        densityLevels: [
            { level: "Level A (Maximum)", condition: "Low component density, high shock/vibration", toe: "0.55 mm", heel: "0.45 mm", side: "0.05 mm" },
            { level: "Level B (Nominal)", condition: "Standard desktop/consumer electronics", toe: "0.35 mm", heel: "0.35 mm", side: "0.03 mm" },
            { level: "Level C (Least)", condition: "High density, mobile/handheld devices", toe: "0.15 mm", heel: "0.15 mm", side: "0.01 mm" }
        ],
        courtyardExcess: [
            { componentSize: "0201 to 0603", excess: "0.15 mm" },
            { componentSize: "0805 to 1210", excess: "0.25 mm" },
            { componentSize: "QFN / BGA", excess: "0.50 mm" },
            { componentSize: "Connectors", excess: "1.00 mm (Minimum)" }
        ]
    };
    res.json(ipcData);
});

// UPGRADED: Professional Engineering Checklist
app.get('/api/checklist', (req, res) => {
    const checklistData = [
        { id: 1, task: "Verify manufacturer recommended land pattern (Datasheet)", completed: true },
        { id: 2, task: "Apply IPC-7351 Density Level B (Nominal) fillets", completed: true },
        { id: 3, task: "Add Courtyard polygon on Courtyard layer", completed: false },
        { id: 4, task: "Ensure 1:1 Paste Mask to Pad ratio (Modify for large thermal pads)", completed: false },
        { id: 5, task: "Add Pin 1 dot/marker to Silkscreen AND Assembly layers", completed: false },
        { id: 6, task: "Clear Silkscreen from all exposed copper pads (Min 0.1mm clearance)", completed: false },
        { id: 7, task: "Map and align 3D STEP model to PCB footprint", completed: false }
    ];
    res.json(checklistData);
});

app.listen(PORT, () => {
    console.log(`PCB Engine running on port ${PORT}`);
});
