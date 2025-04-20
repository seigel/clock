const API_URL = 'http://epic-bee-checkin:1333/tournamentEvents';
// const API_URL = 'http://192.168.0.32:1333/tournament';


function showTime() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    console.log('params', params.size, params.get('server'));
    const apiServer = params.size === 1 ? `http://${params.get('server')}:1333/tournamentEvents` : null;

    const date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let session = "AM";

    if (h == 0) {
        h = 12;
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
                return currentDay === eventDay;
            });
            const eventsElement = document.getElementById("TournamentEvents");
            if (events.length > 0) {
                const mappedEvents = events.map(event => {
                    return `<li class="event">${event.hour}${event.min} - ${event.age} ${event.genderMix} ${event.weapon}</li>`;
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
