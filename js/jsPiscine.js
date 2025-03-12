// Function to fetch GraphQL data for XP progress
async function fetchXPData() {
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
        console.log('XP Data:', response);

        if (response?.data?.user && response.data.user.length > 0) {
            const xpData = response.data.user[0].transactions;
            createXPChart(xpData);
        } else {
            console.error('Invalid data structure:', response);
            throw new Error('Invalid data received');
        }
    } catch (error) {
        console.error('Error fetching XP data:', error);
    }
}

// Function to convert bytes to KB, MB, or GB using base 1000
function formatBytes(bytes) {
    if (bytes < 1000) return `${bytes} Bytes`;
    else if (bytes < 1000000) return `${(bytes / 1000).toFixed(2)} KB`;
    else if (bytes < 1000000000) return `${(bytes / 1000000).toFixed(2)} MB`;
    else return `${(bytes / 1000000000).toFixed(2)} GB`;
}

// Function to create an accumulated XP line chart
function createXPChart(xpData) {
    // Filter only XP from "/bahrain/bh-module/piscine-js/"
    const filteredXP = xpData.filter(item => item.path.startsWith("/bahrain/bh-module/piscine-js/"));

    // Sort XP entries by date (ascending order)
    filteredXP.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Group by date and sum XP for the same date
    const dateXPMap = {};
    filteredXP.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString();  // Get only the date (not time)
        if (!dateXPMap[date]) {
            dateXPMap[date] = 0;
        }
        dateXPMap[date] += item.amount;  // Sum the XP for the same date
    });

    // Prepare data for the graph: dates and accumulated XP
    const uniqueXP = Object.entries(dateXPMap).map(([date, totalXP]) => ({
        date,
        totalXP
    }));

    // Sort data by date
    uniqueXP.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Accumulate XP over time correctly
    let accumulatedXP = 0;
    const xpValues = uniqueXP.map(item => {
        accumulatedXP += item.totalXP;
        return accumulatedXP;
    });

    // Convert XP values to KB/MB/GB format
    const formattedXPValues = xpValues.map(amount => parseFloat((amount / 1000).toFixed(0))); // Convert to KB

    // Generate labels (formatted dates)
    const labels = uniqueXP.map(item => item.date || "Start");

    var options = {
        series: [{
            name: 'Accumulated XP (KB)',
            data: formattedXPValues
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
                rotate: -45, // Rotate labels for better readability
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Total XP (KB)'
            }
        },
        title: {
            text: 'JS Piscine XP Progress',
            align: 'center',
            style: {
                fontSize: '20px'
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-xp"), options);
    chart.render();
}

// Initialize the XP Graph when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchXPData();
});