const apiUrl = "https://api.github.com/orgs/Pelagornis/repos?per_page=100";
const excludeRepos = ["github-template", "github-labels", "badge"];
const perPage = 9;

let allRepos = [];
let filteredRepos = [];
let currentPage = 1;

async function fetchRepos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        allRepos = data.filter(repo => !excludeRepos.includes(repo.name));
        filteredRepos = [...allRepos];
        renderRepos();
    } catch (error) {
        console.error("GitHub API Error:", error);
    }
}

function renderRepos() {
    const repoList = document.getElementById("repo-list");
    repoList.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const reposToShow = filteredRepos.slice(start, end);

    reposToShow.forEach(repo => {
        const li = document.createElement("li");
        li.innerHTML = `
        <article class="repo">
            <a href="${repo.html_url}" target="_blank">
                <h2>${repo.name}</h2>
                <p>${repo.description}</p>
                <div class="repo-star">
                    <img src="/assets/images/icons/star.svg" alt="Star"></img>
                    <span>${repo.stargazers_count}</span>
                </div>
            </a>
        </article>
        `;
        repoList.appendChild(li);
    });

    updatePagination();
}

function filterRepos() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    filteredRepos = allRepos.filter(repo =>
        repo.name.toLowerCase().includes(searchInput) || 
        (repo.description && repo.description.toLowerCase().includes(searchInput))
    );

    currentPage = 1;
    renderRepos();
}

function updatePagination() {    
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage * perPage >= filteredRepos.length;
}

function nextPage() {
    if (currentPage * perPage < filteredRepos.length) {
        currentPage++;
        renderRepos();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderRepos();
    }
}

document.addEventListener("DOMContentLoaded", fetchRepos);
