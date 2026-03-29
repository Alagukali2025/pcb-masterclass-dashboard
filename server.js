const express = require('express');
const path = require('path');

const app = express();
// Cloud servers use process.env.PORT. If it's not there, it uses 3000.
const PORT = process.env.PORT || 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pcb-dashboard.html'));
});

// Send dynamic data to the frontend
app.get('/api/checklist', (req, res) => {
    const checklistData = [
        { id: 1, task: "Checked datasheet tolerances", completed: true },
        { id: 2, task: "Added Pin 1 indicator", completed: true },
        { id: 3, task: "Verified 3D model alignment", completed: false }
    ];
    res.json(checklistData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
