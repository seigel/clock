function showTime() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    console.log('params', params.size, params.get('server'));
    const apiServer = params.size === 1 ? `/tournamentEvents` : null;

    const date = new Date();
    let h = date.getHours(); // 0 - 23
    const theHour = date.getHours();
    let m = date.getMinutes(); // 0 - 59
    let session = "AM";

    if (h === 0) {
        h = 12;
    }

    if (h === 12) {
        session = "PM";
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    m = (m < 10) ? "0" + m : m;

    var time = h + ":" + m + " " + session;

    if (apiServer) {
        fetch(apiServer).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        }).then(data => {
            console.log('data', data);
            let message = '';
            if (data && data.result) {
                message = `${data.tournament}`;
            }
            document.getElementById("container").innerHTML =
                '<div id="MyClockDisplay" class="clock"></div>' +
                '<div id="TournamentName" class="tournament-name"></div>' +
                '<div id="TournamentEvents" class="tournament-events"></div> ';
            const element = document.getElementById("TournamentName");
            element.innerText = message;
            element.textContent = message;
            const currentDay = new Date().getDate();
            const events = data.events.filter(event => {
                const eventDay = parseInt(event.day);
                const eventHour = parseInt(event.hour)
                return currentDay === eventDay && (theHour - eventHour) < 2;
            });
            console.log('events', events);
            const eventsElement = document.getElementById("TournamentEvents");
            if (events.length > 0) {
                const mappedEvents = events.map(event => {
                    return `<li class="event">${event.hour}${event.min} - ${event.age} ${event.genderMix} ${event.weapon} <span id="${event.id ? `(${event.id})` : ''}">${event.strip ? `( strip : ${event.strip} )` : ""}</span> </li>`;
                }).join('');
                eventsElement.innerHTML = '<ul>' + mappedEvents + '</ul>';
            } else {
                eventsElement.innerHTML = '<div class="event">No Events</div>';
            }
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById("container").innerHTML =
                '<div id="MyClockDisplay" class="clockFull"></div>';

        }).finally(() => {
            document.getElementById("MyClockDisplay").innerText = time;
            document.getElementById("MyClockDisplay").textContent = time;
        });
    } else {
        document.getElementById("container").innerHTML =
            '<div id="MyClockDisplay" class="clockFull"></div>';
        document.getElementById("MyClockDisplay").innerText = time;
        document.getElementById("MyClockDisplay").textContent = time;
    }

    setTimeout(showTime, 15000);
}

showTime();
