const url = "https://api-nba-v1.p.rapidapi.com/teams";
const option = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "508635599emshdc731246d26a22bp13e070jsna77ed96f64f6",
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
};

const teamCard = ".team-card";
const teamInput = document.getElementById("teamInput");
const sortBtn = document.querySelectorAll(".sortBtn");

const getPromiseObj = async() => {
    return fetch(url, option)
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
};

const getTeams = async() => {
    return fetch(url, option)
        .then((res) => res.json())
        .then((data) => {
            const nbaTeams = data.response.filter(
                (team) => team.allStar === false && team.nbaFranchise === true
            );
            return nbaTeams;
        });
};

const createCard = async(team) => {
    const id = team.name;
    const abr = team.code;
    const img = team.logo;
    const city = team.city;
    const division = team.leagues.standard.division;
    const conference = team.leagues.standard.conference;

    const teamName = document.createElement("H3");
    teamName.innerHTML = id;
    const teamAbr = document.createElement("H5");
    teamAbr.innerHTML = abr;
    const teamImg = document.createElement("img");
    teamImg.setAttribute("src", img);
    const teamImgCont = document.createElement("div");
    teamImgCont.classList.add("team-img-cont");
    teamImgCont.append(teamImg);
    teamImgCont.classList.add("team-img-cont");
    const teamNameCont = document.createElement("div");
    teamNameCont.append(teamName, teamAbr, teamImgCont);

    const teamCity = document.createElement("p");
    teamCity.innerHTML = `City: ${city}`;
    const teamDivision = document.createElement("p");
    teamDivision.innerHTML = `Division: ${division}`;
    const teamConference = document.createElement("p");
    teamConference.innerHTML = `Conference: ${conference}`;
    const conDivCont = document.createElement("div");
    conDivCont.append(teamCity, teamDivision, teamConference);

    const teamCard = document.createElement("div");
    teamCard.classList.add("team-card");
    teamCard.id = id;
    teamCard.append(teamNameCont, conDivCont);

    const star = document.createElement("a");
    star.classList.add("fav-star");
    star.innerHTML = "&#9734";
    if (checkFav(id)) {
        star.classList.add("is-fav");
        star.addEventListener("click", deleteFav);
    } else {
        star.addEventListener("click", addFav);
    }
    teamCard.appendChild(star);

    document.getElementById("teamCont").append(teamCard);
};

const deleteFav = async(e) => {
    const teamName = e.target.parentElement.id;
    const favArr = localStorage.getItem("fav").split(",");
    favArr.splice(favArr.indexOf(teamName), 1);
    if (favArr.length > 1) {
        localStorage.setItem("fav", favArr.join(","));
        document.getElementById(teamName).remove();
    } else if (favArr.length === 1) {
        localStorage.setItem("fav", favArr[0]);
        document.getElementById(teamName).remove();
    } else {
        localStorage.removeItem("fav");
        document.getElementById(teamName).remove();
    }
};

const addFav = async(e) => {
    const teamName = e.target.parentElement.id;
    let favs = localStorage.getItem("fav");
    if (favs === null) {
        localStorage.setItem("fav", teamName);
        document.getElementById(teamName).remove();
    } else {
        favs += `,${teamName}`;
        localStorage.setItem("fav", favs);
        document.getElementById(teamName).remove();
    }
};

const checkFav = (team) => {
    const fav = localStorage.getItem("fav");
    if (fav === null || fav.length === 2) {
        return false;
    } else {
        const favArr = fav.split(",");
        const foundFav = favArr.find((fav) => fav === team);
        if (foundFav === undefined) return false;
        else return true;
    }
};

const displayCards = async() => {
    getTeams().then((data) => {
        data.forEach((team) => {
            if (!checkFav(team.name)) {
                createCard(team);
            }
        });
    });
};

displayCards();

const filterAlfa = async(sort) => {
    getTeams().then((data) => {
        const teamNameArr = data.map((team) => team.name);
        if (sort === "a-z") teamNameArr.sort();
        else teamNameArr.sort().reverse();

        const filterOutFav = teamNameArr.filter((team) => checkFav(team) === false);

        filterOutFav.forEach((team) => {
            const teamObj = data.find((teamObj) => teamObj.name === team);
            createCard(teamObj);
        });
    });
};

const filterFav = async() => {
    getTeams().then((data) => {
        const fav = localStorage.getItem("fav");
        if (fav !== null) {
            const favArr = fav.split(",");
            favArr.forEach((team) => {
                const teamObj = data.find((teamOb) => teamOb.name === team);
                createCard(teamObj);
            });
        }
    });
};

const sortCards = async(e) => {
    const teamCont = document.getElementById("teamCont");
    const teamCards = document.querySelectorAll(".team-card");
    teamCards.forEach((card) => teamCont.removeChild(card));
    const id = e.target.id;
    if (id === "a-z" || id === "z-a") filterAlfa(id);
    else filterFav();
};

const filterTeams = async(e) => {
    const teamCont = document.querySelectorAll(".team-card");
    teamCont.forEach((item) =>
        document.getElementById("teamCont").removeChild(item)
    );
    getTeams().then((data) => {
        data.forEach((team) => {
            const compName = team.name
                .split("")
                .splice(0, teamInput.value.length)
                .join("")
                .toLowerCase();
            if (compName === teamInput.value.toLowerCase()) {
                if (!checkFav(team.name)) createCard(team);
            }
        });
    });
};

sortBtn.forEach((btn) => btn.addEventListener("click", sortCards));
teamInput.addEventListener("keyup", filterTeams);