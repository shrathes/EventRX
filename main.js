// Redirect to login if not logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Show username
const userName = localStorage.getItem("username");
const welcome = document.getElementById("welcomeUser");

if (welcome && userName) {
    welcome.innerHTML = "👋 " + userName;
}

// Login / Logout toggle
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");

if (localStorage.getItem("isLoggedIn") === "true") {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
} else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
}

// Logout function
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    document.cookie = "username=; max-age=0; path=/";

    window.location.href = "login.html";
}
/* =====================================================
   EVENTX - SMART CAMPUS EVENT HUB
   JavaScript
===================================================== */


/* =====================================================
   1. EVENT DATA
===================================================== */

const events = [
    {
        id: 1,
        name: "AI Innovation Hackathon",
        category: "AI/ML",
        date: "20 Aug 2026",
        time: "10:00",
        endTime: "18:00",
        location: "Bangalore",
        description: "Build innovative AI solutions for real-world problems.",
        tags: ["AI/ML", "Hackathon"]
    },

    {
        id: 2,
        name: "WebSprint 2026",
        category: "Web",
        date: "22 Aug 2026",
        time: "11:00",
        endTime: "15:00",
        location: "Bangalore",
        description: "Create modern and responsive web applications.",
        tags: ["Web"]
    },

    {
        id: 3,
        name: "CyberShield Challenge",
        category: "Cybersecurity",
        date: "25 Aug 2026",
        time: "10:00",
        endTime: "16:00",
        location: "Bangalore",
        description: "Test your cybersecurity knowledge and problem-solving skills.",
        tags: ["Cybersecurity"]
    },

    {
        id: 4,
        name: "RoboTech Expo",
        category: "Robotics",
        date: "28 Aug 2026",
        time: "09:00",
        endTime: "17:00",
        location: "Bangalore",
        description: "Explore robotics, automation and next-generation technology.",
        tags: ["Robotics"]
    },

    {
        id: 5,
        name: "CodeForge Competition",
        category: "Hackathon",
        date: "30 Aug 2026",
        time: "10:00",
        endTime: "18:00",
        location: "Bangalore",
        description: "Compete with developers and solve exciting coding challenges.",
        tags: ["Hackathon"]
    },

    {
        id: 6,
        name: "ElectroFest 2026",
        category: "Electronics",
        date: "2 Sep 2026",
        time: "10:00",
        endTime: "16:00",
        location: "Bangalore",
        description: "Discover innovative electronics and embedded projects.",
        tags: ["Electronics"]
    },

    {
        id: 7,
        name: "AI & Robotics Summit",
        category: "AI/ML",
        date: "5 Sep 2026",
        time: "11:00",
        endTime: "17:00",
        location: "Bangalore",
        description: "Discover how artificial intelligence is transforming robotics.",
        tags: ["AI/ML", "Robotics"]
    },

    {
        id: 8,
        name: "Future Hack 2026",
        category: "Hackathon",
        date: "8 Sep 2026",
        time: "09:00",
        endTime: "18:00",
        location: "Bangalore",
        description: "Build creative technology solutions with your team.",
        tags: ["Hackathon", "Web", "AI/ML"]
    }
];


/* =====================================================
   2. LOCAL STORAGE
===================================================== */

let savedEvents =
    JSON.parse(localStorage.getItem("savedEvents")) || [];

let registeredEvents =
    JSON.parse(localStorage.getItem("registeredEvents")) || [];

let currentEvents = [...events];


/* =====================================================
   3. DISPLAY EVENTS
===================================================== */

function displayEvents(eventList) {

    const container = document.getElementById("eventsContainer");

    if (!container) return;

    container.innerHTML = "";

    if (eventList.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">
                <h3>No events found 😕</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    eventList.forEach(event => {

        const match = calculateMatch(event);

        const isSaved = savedEvents.includes(event.id);

        const card = document.createElement("div");

        card.className = "event-card";

        card.innerHTML = `

            <span class="event-category">
                ${event.category}
            </span>

            <h3>${event.name}</h3>

            <p class="event-description">
                ${event.description}
            </p>

            <p class="event-info">
                📅 ${event.date}
            </p>

            <p class="event-info">
                ⏰ ${formatTime(event.time)}
                - ${formatTime(event.endTime)}
            </p>

            <p class="event-info">
                📍 ${event.location}
            </p>

            <span class="match-badge">
                🎯 ${match}% Match
            </span>

            <div
                class="countdown"
                id="countdown-${event.id}">
                Calculating countdown...
            </div>

            <div class="event-actions">

                <button
                    class="save-btn"
                    onclick="toggleSave(${event.id})">

                    ${isSaved ? "❤️ Saved" : "♡ Save"}

                </button>

                <button
                    class="btn primary-btn"
                    onclick="openRegistration(${event.id})">

                    Register

                </button>

            </div>
        `;

        container.appendChild(card);

        startCountdown(event);

    });
}


/* =====================================================
   4. FORMAT TIME
===================================================== */

function formatTime(time) {

    const [hour, minute] = time.split(":");

    let h = parseInt(hour);

    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;

    if (h === 0) {
        h = 12;
    }

    return `${h}:${minute} ${ampm}`;
}


/* =====================================================
   5. SEARCH EVENTS
===================================================== */

function searchEvents() {

    const searchBox = document.getElementById("search");

    const searchText =
        searchBox.value.toLowerCase().trim();


    currentEvents = events.filter(event => {

        return (
            event.name.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText)
        );

    });

    displayEvents(currentEvents);
}


/* =====================================================
   6. FILTER EVENTS
===================================================== */

function filterEvents(category) {

    const buttons =
        document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.classList.remove("active");

        if (button.textContent
            .toLowerCase()
            .includes(category.toLowerCase())) {

            button.classList.add("active");
        }

    });


    if (category === "All") {

        currentEvents = [...events];

    } else {

        currentEvents = events.filter(event =>
            event.category === category ||
            event.tags.includes(category)
        );

    }

    displayEvents(currentEvents);
}


/* =====================================================
   7. CALCULATE SMART MATCH
===================================================== */

function calculateMatch(event) {

    const selected =
        Array.from(
            document.querySelectorAll(
                ".interest-options input:checked"
            )
        ).map(input => input.value);


    if (selected.length === 0) {

        return 75;

    }


    let matches = 0;

    selected.forEach(interest => {

        if (event.tags.includes(interest)) {
            matches++;
        }

    });


    const percentage =
        Math.round((matches / selected.length) * 100);


    return Math.max(30, percentage);
}


/* =====================================================
   8. FIND MY MATCH
===================================================== */

function findMatch() {

    const selected =
        Array.from(
            document.querySelectorAll(
                ".interest-options input:checked"
            )
        ).map(input => input.value);


    const result =
        document.getElementById("matchResult");


    if (selected.length === 0) {

        result.innerHTML = `
            <div class="match-result-card">

                <h3>Choose at least one interest 😊</h3>

                <p>
                    Select your interests to find
                    your best event.
                </p>

            </div>
        `;

        return;
    }


    const rankedEvents = events.map(event => {

        let matches = 0;

        selected.forEach(interest => {

            if (event.tags.includes(interest)) {
                matches++;
            }

        });


        const score =
            Math.round(
                (matches / selected.length) * 100
            );


        return {
            event: event,
            score: score
        };

    });


    rankedEvents.sort((a, b) => b.score - a.score);


    const best = rankedEvents[0];

    const finalScore =
        best.score === 0 ? 30 : best.score;


    result.innerHTML = `

        <div class="match-result-card">

            <p>🏆 YOUR BEST MATCH</p>

            <h3>${best.event.name}</h3>

            <div class="match-percentage">
                ${finalScore}% Match
            </div>

            <p>
                📅 ${best.event.date}
                &nbsp; | &nbsp;
                📍 ${best.event.location}
            </p>

            <br>

            <button
                class="btn primary-btn"
                onclick="openRegistration(${best.event.id})">

                Register Now 🚀

            </button>

        </div>
    `;
}


/* =====================================================
   9. SAVE / UNSAVE EVENT
===================================================== */

function toggleSave(eventId) {

    if (savedEvents.includes(eventId)) {

        savedEvents =
            savedEvents.filter(id => id !== eventId);

    } else {

        savedEvents.push(eventId);

    }


    localStorage.setItem(
        "savedEvents",
        JSON.stringify(savedEvents)
    );


    displayEvents(currentEvents);

    updateDashboard();

    displaySavedEvents();
}


/* =====================================================
   10. REGISTRATION MODAL
===================================================== */

function openRegistration(eventId) {

    const event =
        events.find(e => e.id === eventId);


    if (!event) return;


    const modal =
        document.getElementById(
            "registrationModal"
        );


    const selectedEvent =
        document.getElementById(
            "selectedEvent"
        );


    const eventSelect =
        document.getElementById(
            "eventSelect"
        );


    selectedEvent.textContent =
        event.name;


    eventSelect.innerHTML = "";

    events.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item.id;

        option.textContent =
            item.name;

        if (item.id === eventId) {
            option.selected = true;
        }

        eventSelect.appendChild(option);

    });


    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
}


/* =====================================================
   11. CLOSE REGISTRATION
===================================================== */

function closeRegistration() {

    const modal =
        document.getElementById(
            "registrationModal"
        );


    modal.style.display = "none";

    document.body.style.overflow = "auto";

}


/* =====================================================
   12. REGISTER USER
===================================================== */

function registerUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("name")
            .value.trim();


    const email =
        document.getElementById("email")
            .value.trim();


    const college =
        document.getElementById("college")
            .value.trim();


    const eventId =
        parseInt(
            document.getElementById("eventSelect")
                .value
        );


    const message =
        document.getElementById(
            "registrationMessage"
        );


    /* Validation */

    if (name === "") {

        message.innerHTML =
            "❌ Please enter your name.";

        return;
    }


    if (email === "" ||
        !email.includes("@")) {

        message.innerHTML =
            "❌ Please enter a valid email.";

        return;
    }


    if (college === "") {

        message.innerHTML =
            "❌ Please enter your college.";

        return;
    }


    if (!eventId) {

        message.innerHTML =
            "❌ Please select an event.";

        return;
    }


    const selectedEvent =
        events.find(e => e.id === eventId);


    /* Check duplicate registration */

    const alreadyRegistered =
        registeredEvents.some(
            item => item.eventId === eventId
        );


    if (alreadyRegistered) {

        message.innerHTML = `
            ⚠️ You are already registered
            for this event.
        `;

        return;
    }


    /* Check event clash */

    const clash =
        checkEventClash(selectedEvent);


    if (clash) {

        message.innerHTML = `

            ⚠️ <strong>Schedule Conflict!</strong>

            <br>

            You already have another event
            during this time.

            <br><br>

            <strong>${clash.name}</strong>

            <br>

            ${clash.date} |
            ${formatTime(clash.time)}
            -
            ${formatTime(clash.endTime)}

        `;

        return;
    }


    /* Save registration */

    const registration = {

        eventId: selectedEvent.id,

        eventName: selectedEvent.name,

        name: name,

        email: email,

        college: college,

        date: selectedEvent.date,

        time: selectedEvent.time,

        endTime: selectedEvent.endTime

    };


    registeredEvents.push(registration);


    localStorage.setItem(
        "registeredEvents",
        JSON.stringify(registeredEvents)
    );


    message.innerHTML = `

        <div style="
            padding:15px;
            background:#e8f8ef;
            border-radius:10px;
            color:#15803d;
        ">

            🎉 <strong>Registration Successful!</strong>

            <br><br>

            You are registered for
            <strong>${selectedEvent.name}</strong>.

        </div>

    `;


    updateDashboard();

    displayRegisteredEvents();


    setTimeout(() => {

        closeRegistration();

        document.getElementById(
            "registrationForm"
        ).reset();

        message.innerHTML = "";

    }, 2000);

}


/* =====================================================
   13. EVENT CLASH DETECTOR
===================================================== */

function checkEventClash(newEvent) {

    return registeredEvents.find(registered => {

        if (registered.date !== newEvent.date) {
            return false;
        }


        const existingStart =
            timeToMinutes(
                registered.time
            );

        const existingEnd =
            timeToMinutes(
                registered.endTime
            );

        const newStart =
            timeToMinutes(
                newEvent.time
            );

        const newEnd =
            timeToMinutes(
                newEvent.endTime
            );


        return (
            newStart < existingEnd &&
            newEnd > existingStart
        );

    });

}


/* =====================================================
   14. CONVERT TIME TO MINUTES
===================================================== */

function timeToMinutes(time) {

    const [hours, minutes] =
        time.split(":").map(Number);

    return hours * 60 + minutes;
}


/* =====================================================
   15. COUNTDOWN
===================================================== */

function startCountdown(event) {

    const countdownElement =
        document.getElementById(
            `countdown-${event.id}`
        );


    if (!countdownElement) return;


    function updateCountdown() {

        const dateParts =
            event.date.split(" ");


        const day =
            parseInt(dateParts[0]);


        const monthName =
            dateParts[1];


        const year =
            parseInt(dateParts[2]);


        const monthMap = {

            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11

        };


        const [hours, minutes] =
            event.time.split(":")
                .map(Number);


        const target =
            new Date(
                year,
                monthMap[monthName],
                day,
                hours,
                minutes,
                0
            );


        const now =
            new Date();


        const difference =
            target - now;


        if (difference <= 0) {

            countdownElement.innerHTML =
                "🔴 Event Started";

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hoursLeft =
            Math.floor(
                (difference %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );


        const minutesLeft =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );


        const secondsLeft =
            Math.floor(
                (difference %
                    (1000 * 60)) /
                1000
            );


        countdownElement.innerHTML = `
            ⏳ ${days}d
            ${hoursLeft}h
            ${minutesLeft}m
            ${secondsLeft}s
        `;
    }


    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );
}


/* =====================================================
   16. DASHBOARD COUNTERS
===================================================== */

function updateDashboard() {

    const registeredCount =
        document.getElementById(
            "registeredCount"
        );


    const savedCount =
        document.getElementById(
            "savedCount"
        );


    const upcomingCount =
        document.getElementById(
            "upcomingCount"
        );


    if (registeredCount) {

        registeredCount.textContent =
            registeredEvents.length;

    }


    if (savedCount) {

        savedCount.textContent =
            savedEvents.length;

    }


    if (upcomingCount) {

        upcomingCount.textContent =
            registeredEvents.length;

    }

}


/* =====================================================
   17. DISPLAY REGISTERED EVENTS
===================================================== */

function displayRegisteredEvents() {

    const container =
        document.getElementById(
            "registeredEvents"
        );


    if (!container) return;


    if (registeredEvents.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                You haven't registered
                for any events yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    registeredEvents.forEach(item => {

        container.innerHTML += `

            <div class="dashboard-event">

                <strong>
                    ${item.eventName}
                </strong>

            </div>
        `;
    });

} 

/* ==================================
   DARK MODE TOGGLE
================================== */

const darkBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (darkBtn) darkBtn.textContent = "☀️";
}

if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            darkBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            darkBtn.textContent = "🌙";
        }
    });
}