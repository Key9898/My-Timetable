const container = document.querySelector(".container");
const timetable = document.querySelector(".timetable");

// Start with completely empty timetable
let timeSlots = [];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function initTimetable() {
    createTimetable();
    addControlButtons();
}

function createTimetable() {
    timetable.innerHTML = `
    <div class="header time">${timeIcon} Time</div>
    ${days.map(day => `<div class="header">${day}</div>`).join('')}
  `;

    // Only show time slots if they exist
    if (timeSlots.length > 0) {
        timeSlots.forEach((slot, rowIdx) => {
            const timeCell = document.createElement("div");
            timeCell.classList.add("header", "time");
            timeCell.textContent = slot;
            timetable.appendChild(timeCell);

            days.forEach((_, colIdx) => {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = rowIdx;
                cell.dataset.col = colIdx;

                const saved = localStorage.getItem(`cell-${rowIdx}-${colIdx}`);
                if (saved) cell.textContent = saved;

                cell.addEventListener("click", () => {
                    const currentText = cell.textContent;
                    const newText = prompt("Enter task:", currentText);
                    if (newText !== null) {
                        cell.textContent = newText;
                        localStorage.setItem(`cell-${rowIdx}-${colIdx}`, newText);
                    }
                });

                timetable.appendChild(cell);
            });
        });
    } else {
        // Show empty state message
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "empty-message";
        emptyMsg.textContent = "No time slots added yet. Click 'Add Time Slot' to begin.";
        emptyMsg.style.gridColumn = "1 / -1";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.padding = "20px";
        emptyMsg.style.color = "#666";
        timetable.appendChild(emptyMsg);
    }
}

function addControlButtons() {
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.innerHTML = `
    <button id="addRowBtn">➕ Add Custom Time Slot</button>
    <button id="removeRowBtn">➖ Remove Last Slot</button>
    <button id="saveBtn">💾 Save</button>
    <button id="resetBtn">🔄 Reset</button>
  `;
    container.insertBefore(controls, timetable);

    document.getElementById("addRowBtn").addEventListener("click", addCustomTimeSlot);
    document.getElementById("removeRowBtn").addEventListener("click", removeLastTimeSlot);
    document.getElementById("saveBtn").addEventListener("click", saveTimetable);
    document.getElementById("resetBtn").addEventListener("click", resetTimetable);
}

function addCustomTimeSlot() {
    const startTime = prompt("Enter start time (e.g., 08:00 or 13:30):");
    if (!startTime) return;

    const endTime = prompt("Enter end time (e.g., 09:00 or 14:45):");
    if (!endTime) return;

    timeSlots.push(`${startTime} - ${endTime}`);
    createTimetable();
}

function removeLastTimeSlot() {
    if (timeSlots.length > 0) {
        timeSlots.pop();
        createTimetable();
    } else {
        alert("No time slots to remove!");
    }
}

function saveTimetable() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const { row, col } = cell.dataset;
        localStorage.setItem(`cell-${row}-${col}`, cell.textContent);
    });
    localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
    alert("Timetable saved!");
}

function resetTimetable() {
    if (confirm("Reset entire timetable? All data will be lost.")) {
        localStorage.clear();
        timeSlots = [];
        createTimetable();
    }
}

const timeIcon = `<svg class="icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="#2980b9" stroke-width="2"/><path d="M10 5.5V10L13.5 12" stroke="#2980b9" stroke-width="2" stroke-linecap="round"/></svg>`;

document.addEventListener("DOMContentLoaded", () => {
    const savedSlots = localStorage.getItem("timeSlots");
    if (savedSlots) timeSlots = JSON.parse(savedSlots);
    initTimetable();
});