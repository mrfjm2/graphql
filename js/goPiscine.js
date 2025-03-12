// Function to fetch GraphQL data for all Piscine Quest & Checkpoint XP progress
async function fetchPiscineXPData() {
    const query = `
        query User {
            user {
                transactions {
                    amount
                    path
                    createdAt
                }
            }
        }
    `;

    try {
        const response = await fetchGraphQL(query);
        console.log('Raw XP Data:', response); // Debugging log

        if (response?.data?.user && response.data.user.length > 0) {
            const xpData = response.data.user[0].transactions;
            createPiscineXPChart(xpData);
        } else {
            console.error('Invalid data structure:', response);
        }
    } catch (error) {
        console.error('Error fetching Piscine XP data:', error);
    }
}

// Function to create an accumulated XP line chart for all quests & checkpoints
function createPiscineXPChart(xpData) {
    // Filter XP for quests and checkpoints
    const filteredXP = xpData.filter(item =>
        item.path.startsWith("/bahrain/bh-piscine/quest-") ||
        item.path.startsWith("/bahrain/bh-piscine/checkpoint-")
    );

    console.log("Filtered XP Data:", filteredXP); // Debugging log

    if (filteredXP.length === 0) {
        console.warn("No XP data found for quests or checkpoints.");
        return;
    }

    // Sort XP entries by date
    filteredXP.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Group XP by date and sum XP for the same day
    const dateXPMap = {};
    filteredXP.forEach(item => {
        const date = new Date(item.createdAt).toISOString().split('T')[0]; // Normalize to YYYY-MM-DD
        if (!dateXPMap[date]) {
            dateXPMap[date] = 0;
        }
        dateXPMap[date] += item.amount; // Sum XP for the same date
    });

    // Convert the grouped data into sorted arrays
    let accumulatedXP = 0;
    const labels = [];
    const xpValues = [];

    Object.entries(dateXPMap).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .forEach(([date, totalXP]) => {
            labels.push(date);
            accumulatedXP += totalXP;
            xpValues.push(Math.round(accumulatedXP / 1000)); // Convert XP to KB
        });

    console.log("Final XP Values:", xpValues); // Debugging log
    console.log("Final Labels (Dates):", labels); // Debugging log

    // Chart options
    var options = {
        series: [{
            name: 'Accumulated XP (KB)',
            data: xpValues
        }],
        chart: {
            type: 'line',
            height: 350,
            width: "100%",
            responsive: true
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: labels,
            labels: {
                rotate: -45,
                style: { fontSize: '12px' }
            }
        },
        yaxis: {
            title: { text: 'Total XP (KB)' }
        },
        title: {
            text: 'Go Piscine XP Progress',
            align: 'center',
            style: { fontSize: '20px' }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-piscine-xp"), options);
    chart.render();
}

// Initialize the Piscine XP Graph when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchPiscineXPData();
});