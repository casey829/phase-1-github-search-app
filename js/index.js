document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchGitHub(searchTerm);
        }
    });

    function searchGitHub(searchTerm) {
        const url = `https://api.github.com/search/users?q=${searchTerm}`;
        fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => {
            console.error("Error searching GitHub users:", error);
        });
    }

    function displayUsers(users) {
        userList.innerHTML = ""; // Clear previous search results
        users.forEach(user => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = user.login;
            link.href = user.html_url;
            link.target = "_blank";
            li.appendChild(link);
            li.addEventListener("click", function() {
                getUserRepos(user.login);
            });
            userList.appendChild(li);
        });
    }

    function getUserRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(repos => {
            displayRepos(repos);
        })
        .catch(error => {
            console.error("Error fetching user repos:", error);
        });
    }

    function displayRepos(repos) {
        reposList.innerHTML = ""; // Clear previous user repos
        if (repos.length === 0) {
            const li = document.createElement("li");
            li.textContent = "This user has no repositories.";
            reposList.appendChild(li);
        } else {
            repos.forEach(repo => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.textContent = repo.name;
                link.href = repo.html_url;
                link.target = "_blank";
                li.appendChild(link);
                reposList.appendChild(li);
            });
        }
    }
});