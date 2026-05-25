import { API_TOKEN } from "./env.js"

function getUserFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("user");
}

async function loadUser() {
    const user = getUserFromURL();
    const cacheKey = `github_user_${user}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
        renderUser(JSON.parse(cached));
        return;
    }

    const headers = { Authorization: `token ${API_TOKEN}` };
    const searchRes = await fetch(`https://api.github.com/search/users?q=${user}`, { headers });
    const searchData = await searchRes.json();
    const login = searchData.items[0].login;

    const userRes = await fetch(`https://api.github.com/users/${login}`, { headers });
    const userData = await userRes.json();

    const repositoryRes = await fetch(`https://api.github.com/users/${login}/repos`, { headers });
    const repositoryData = await repositoryRes.json();

    const starredRes = await fetch(`https://api.github.com/users/${login}/starred`, { headers });
    const starredData = await starredRes.json();
    console.log(starredData);

    const data = { login, userData, repositoryData, starredData };
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    renderUser(data);
}

function renderUser({ login, userData, repositoryData, starredData }) {
    document.getElementById("title").innerHTML = login;
    document.getElementById("profilePicture").innerHTML = `<img src="${userData.avatar_url}" alt="${login}'s profile picture">`;
    document.getElementById("fullName").innerHTML = userData.name ?? login;
    document.getElementById("username").innerHTML = login;
    document.getElementById("githubLink").setAttribute("href", `https://github.com/${login}`);

    const repositories = document.getElementById("repos");
    if (Object.keys(repositoryData).length == 0) {
        repositories.innerHTML = `<p>Nothing here yet...</p>`
    } else {
        repositoryData.forEach(repo => {
        repositories.innerHTML += `
        <li class="repository">
            <span class="repository-language">${repo.language ?? "None" }</span>
            <span class="repository-name"><a href="${repo.html_url}" target="_blank">${repo.name}</a></span>
        </li>`;
        });
    }

    if (Object.keys(starredData).length == 0) {
        starred.innerHTML = `<p>Nothing here yet...</p>`
    } else {
        const starred = document.getElementById("stars");
        starredData.forEach(star => {
            starred.innerHTML += `
            <li class="repository">
                <span class="repository-language">${star.language ?? "None"}</span>
                <span class="repository-name"><a href="${star.html_url}" target="_blank">${star.name}</a></span>
            </li>
            `
        });
    }
}

loadUser();