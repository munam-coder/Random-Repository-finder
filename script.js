let selectlanguages = document.querySelector("#language");
const repoPlaceholder = document.getElementById("repo-placeholder");
const retry = document.querySelector(".retry");
const refresh = document.querySelector(".refresh");

// Load languages from JSON
async function loadlanguages() {
  try {
    let getlanguages = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    let data = await getlanguages.json();

    data.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;       // lang is string
      option.textContent = lang.value; // display same
      selectlanguages.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading languages:", err);
    repoPlaceholder.textContent = "⚠️ Could not load languages.";
  }
}

loadlanguages();

// Fetch and show repo
async function showrepo(language) {
  try {
    repoPlaceholder.textContent = "Repos loading... ⏳";

    let response = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`
    );

    if (!response.ok) {
      throw new Error("Repos are not coming");
    }

    let data = await response.json();

    if (data.items.length === 0) {
      repoPlaceholder.textContent = "❌ Repo not found";
      return;
    }

    // pick random repo from top 10
    let repo = data.items[Math.floor(Math.random() * data.items.length)];

    repoPlaceholder.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description"}</p>
      <div class="repo-stats">
          ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
      </div>
      <a href="${repo.html_url}" target="_blank">🔗 View on GitHub</a>
    `;

    refresh.style.display = "block";
    retry.style.display = "none";
  } catch (error) {
    console.error("Error fetching repos:", error);
    repoPlaceholder.textContent = "⚠️ Could not load repos. Try again!";
    retry.style.display = "block";
    refresh.style.display = "none";
  }
}

// When user selects a language
selectlanguages.addEventListener("change", () => {
  let language = selectlanguages.value;
  if (language) {
    showrepo(language);
  } else {
    repoPlaceholder.textContent = "Select a language";
  }
});

refresh.addEventListener("click", () => {
  let language = selectlanguages.value;
  if (language) {
    showrepo(language);
  } else {
    repoPlaceholder.textContent = "⚠️ Please select a language first!";
  }
});

retry.addEventListener("click", () => {
  let retrylang = selectlanguages.value;
  if (retrylang) {
    showrepo(retrylang); // corrected variable
  } else {
    repoPlaceholder.textContent = "⚠️ Please select a language first!";
  }
});
