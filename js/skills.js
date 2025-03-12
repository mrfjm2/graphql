// Function to fetch skill transactions from GraphQL API
async function fetchSkillData() {
    const query = `
        query Transaction {
            transaction(order_by: { createdAt: asc }, where: { type: { _iregex: "skill" } }) {
                type
                amount
                createdAt
            }
        }
    `;

    try {
        const response = await fetchGraphQL(query); // Ensure fetchGraphQL is defined
        console.log("Skill Data:", response);

        if (response?.data?.transaction && response.data.transaction.length > 0) {
            const skillData = response.data.transaction;
            createSkillChart(skillData);
        } else {
            console.error("Invalid data structure:", response);
            throw new Error("Invalid data received");
        }
    } catch (error) {
        console.error("Error fetching skill data:", error);
    }
}

// Function to clean up skill names (remove underscores & capitalize words)
function formatSkillName(skillType) {
    return skillType
        .replace(/_/g, " ")   // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}

// Function to calculate the highest amount per skill
function calculateSkillAmounts(transactions) {
    console.log("Raw Transactions Data:", transactions);

    // Group skill types and find the highest amount per skill
    const skillMaxAmounts = transactions.reduce((acc, { type, amount }) => {
        if (!acc[type] || amount > acc[type]) {
            acc[type] = amount; // Store the highest amount for each skill type
        }
        return acc;
    }, {});

    console.log("Max Amounts Per Skill:", skillMaxAmounts);

    // Convert to an array for chart usage, with cleaned names
    return Object.entries(skillMaxAmounts).map(([type, amount]) => ({
        type: formatSkillName(type), // Format skill name
        amount,
    }));
}

// Function to create a skill bar chart
function createSkillChart(skillData) {
    const skillAmounts = calculateSkillAmounts(skillData);

    // Prepare data for ApexCharts
    const chartOptions = {
        series: [{
            name: 'Skill Amount',
            data: skillAmounts.map(({ amount }) => amount) // Use the highest amount directly
        }],
        chart: {
            type: 'bar',
            height: 400,
            width: "100%",
            responsive: true
        },
        xaxis: {
            categories: skillAmounts.map(({ type }) => type), // Skill names without underscores
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Highest Skill Amount'
            }
        },
        title: {
            text: 'Skill Distribution',
            align: 'center',
            style: {
                fontSize: '20px'
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        }
    };

    // Render the chart
    const chart = new ApexCharts(document.querySelector("#chart-skills"), chartOptions);
    chart.render();
}

// Initialize the skill graph when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSkillData();
});