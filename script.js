document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const userNameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector('.stats-card');

    function validateUsername(username) {
        if (username.trim() == "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMaching = regex.test(username);
        if (!isMaching) {
            alert("Invalid UserName");
        }
        return isMaching;
    }
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }

            const data = await response.json();
            console.log("logging data: ", data);

            
            if (data.status === 'error') {
                statsContainer.innerHTML = `<p>User does not exist</p>`;
                return;
            }

            
            if (!data || Object.keys(data).length === 0) {
                statsContainer.innerHTML = `<p>No data found</p>`;
            } else {
              
                displayUserData(data);
            }

        } catch (error) {
            statsContainer.innerHTML = `<p>Error occurred: ${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(data) {
        const totalQues = data.totalQuestions;           
        const totalHardQues = data.totalHard;            
        const totalEasyQues = data.totalEasy;            
        const totalMediumQues = data.totalMedium;        
        const totalQuesSolved = data.totalSolved;       
        const totalHardQuesSolved = data.hardSolved;    
        const totalEasyQuesSolved = data.easySolved;    
        const totalMediumQuesSolved = data.mediumSolved; 

        updateProgress(totalEasyQuesSolved, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(totalMediumQuesSolved, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(totalHardQuesSolved, totalHardQues, hardLabel, hardProgressCircle);        

        const cardData = [
            { label: "Overall Submissions", value: data.totalSolved },
            { label: "Acceptance Rate", value: `${data.acceptanceRate}%` },
            { label: "Contribution Points", value: data.contributionPoints },
            { label: "Global Ranking", value: data.ranking },
            // { label: "Reputation", value: data.reputation },

           
        ];
        cardStatsContainer.innerHTML = cardData.map(
            data => `
                <div class="card"> 
                <h4>${data.label}</h4>
                <p> ${data.value}</p>
                </div>
                `
        ).join("")
    }


    searchButton.addEventListener('click', function () {
        const userName = userNameInput.value; 
        console.log(userName);
        if (validateUsername(userName)) {
            fetchUserDetails(userName)
        }
    })
})

