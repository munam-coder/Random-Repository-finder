let selectlanguages = document.querySelector("#language");
const repoPlaceholder = document.querySelector("#repo-placeholder");
let refresh = document.querySelector(".refresh");
let retry = document.querySelector(".retry");

async function loadlanguages() {
    try {
        let getlanguages = await fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json")
        let data = await getlanguages.json()

        data.forEach((lang) => {
            const option = document.createElement("option");
            option.value = lang;
            option.textContent = lang.value;
            selectlanguages.appendChild(option);
        })
    }
    catch (err){
        console.error("data shat hai bhaii", err)
    }
    selectlanguages.value = ""
}

loadlanguages();


async function showrepo() {
    try{

    
     repoPlaceholder.textContent = "Repos loading... ⏳";

     let response = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=1
`)
        if(!response.ok){
            throw new Error("repos are not coming");
            
        }

        let data = await response.json();

        if(data.items.lenght === 0){
            repoPlaceholder.textContent = "Repo not found "
            return;
        }

            let repo = data.items[Math.floor(Math.random() * data.items.lenght)]

              repoPlaceholder.innerHTML = `
            <h3 id="repo-name">${repo.name}</h3>
            <p id="repo-description">${repo.description || "No description"}</p>
            <div class="repo-stats">
                ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
            </div>
        `;
        refresh.style.display = "block";
       }
       catch(error){
          console.error("Error fetching repos:", error);
        repoBox.textContent = "⚠️ Could not load repos. Try again!";
        retryBtn.style.display = "block";
        refreshBtn.style.display = "none";
       }

}
showrepo();
