// Function to fetch GraphQL data for audit ratio
async function fetchAuditData() {
    const query = `
        query User {
            user {
                auditRatio
                totalUp
                totalDown
            }
        }
    `;

    try {
        const response = await fetchGraphQL(query);
        console.log('Audit data:', response);

        if (response?.data?.user && response.data.user.length > 0) {
            const user = response.data.user[0];
            createAuditChart(user);
        } else {
            console.error('Invalid data structure:', response);
            throw new Error('Invalid data received');
        }
    } catch (error) {
        console.error('Error fetching audit data:', error);
    }
}

// Function to convert bytes to KB, MB, or GB
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} Bytes`;
    else if (bytes < 1048576) return `${(bytes / 1000).toFixed(2)} KB`;
    else if (bytes < 1073741824) return `${(bytes / 1000000).toFixed(2)} MB`;
    else return `${(bytes / 1073741824).toFixed(2)} GB`;
}

// Function to create the ApexCharts bar chart showing Total Up and Total Down in readable units (KB/MB)
function createAuditChart(user) {
    const totalUp = user.totalUp;
    const totalDown = user.totalDown;
    const auditRatio = user.auditRatio; // Get the auditRatio

    // Convert bytes to a more readable format (KB or MB)
    const formattedTotalUp = formatBytes(totalUp);
    const formattedTotalDown = formatBytes(totalDown);
    

    // Create Bar Chart showing only Total Up and Total Down
    var options = {
        series: [{
            name: 'Done',
            data: [totalUp]
        }, {
            name: 'Recieved',
            data: [totalDown]
        }],
        chart: {
            type: 'bar',
            height: 350,
            width: '100%',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        colors: ['#00E396', '#FF4560'],
        xaxis: {
            categories: [''],
            labels: {
                formatter: function (value) {
                    return formatBytes(value);  // Format the x-axis values as KB, MB, or GB
                }
            }
        },
        title: {
            text: `Audit Ratio: ${auditRatio.toFixed(1)}`, // Add auditRatio here
            align: 'center',
            style: {
                fontSize: '24px', // Change this value to make the text bigger
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return formatBytes(val);  // Format the value displayed on the bars as KB, MB, or GB
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-difference"), options);
    chart.render();

}

// Function to fetch GraphQL data
async function fetchGraphQL(query) {
    const token = localStorage.getItem('jwt-token');

    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status}`);
    }

    return response.json();
}

// Initialize the Audit Ratio Chart when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchAuditData();
});