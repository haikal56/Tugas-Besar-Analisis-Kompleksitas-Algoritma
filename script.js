// Ambil elemen HTML yang diperlukan
const numberInput = document.getElementById('number');
const runBothButton = document.getElementById('run-both');
const iterativeResultSpan = document.getElementById('iterative-result');
const recursiveResultSpan = document.getElementById('recursive-result');
const iterativeTimeSpan = document.getElementById('iterative-time');
const recursiveTimeSpan = document.getElementById('recursive-time');
const complexityDiv = document.getElementById('complexity');
const ctx = document.getElementById('executionChart').getContext('2d');

let chart; // Variable untuk menyimpan instance Chart.js

// Fungsi iteratif untuk menghitung partisi bilangan
function iterativePartition(n) {
    let partitions = [];
    let stack = [[n]];

    while (stack.length > 0) {
        let partition = stack.pop();
        partitions.push(partition);

        let last = partition[partition.length - 1];
        for (let i = last; i >= 1; i--) {
            if (partition.reduce((a, b) => a + b, 0) - last + i <= n) {
                stack.push([...partition.slice(0, -1), i, n - partition.reduce((a, b) => a + b, 0) + last - i]);
            }
        }
    }

    return partitions;
}

// Fungsi rekursif untuk menghitung partisi bilangan
function recursivePartition(n, max = n, prefix = []) {
    if (n === 0) return [prefix];
    let results = [];

    for (let i = Math.min(max, n); i >= 1; i--) {
        results = results.concat(recursivePartition(n - i, i, [...prefix, i]));
    }

    return results;
}

// Fungsi untuk menggambar grafik menggunakan Chart.js
function updateChart(labels, iterativeTimes, recursiveTimes) {
    if (chart) chart.destroy(); // Hapus grafik sebelumnya jika ada

    chart = new Chart(ctx, {
        type: 'line', // Gunakan diagram garis
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Iteratif (ms)',
                    data: iterativeTimes,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4, // Membuat garis melengkung
                },
                {
                    label: 'Rekursif (ms)',
                    data: recursiveTimes,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4, // Membuat garis melengkung
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Waktu Eksekusi (ms)',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Bilangan (n)',
                    },
                },
            },
        },
    });
}

// Fungsi untuk memproses input dan menampilkan hasil
function processInput() {
    const inputValues = numberInput.value
        .split(',')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val) && val > 0);

    let iterativeResults = [];
    let recursiveResults = [];
    let iterativeTimes = [];
    let recursiveTimes = [];
    let labels = [];

    inputValues.forEach(value => {
        // Hitung iteratif
        const iterativeStartTime = performance.now();
        iterativePartition(value);
        const iterativeEndTime = performance.now();

        // Hitung rekursif
        const recursiveStartTime = performance.now();
        recursivePartition(value);
        const recursiveEndTime = performance.now();

        // Simpan hasil dan waktu eksekusi
        iterativeResults.push(`n=${value}`);
        recursiveResults.push(`n=${value}`);
        iterativeTimes.push((iterativeEndTime - iterativeStartTime).toFixed(2));
        recursiveTimes.push((recursiveEndTime - recursiveStartTime).toFixed(2));
        labels.push(`n=${value}`);
    });

    // Update hasil ke dalam HTML
    iterativeResultSpan.textContent = iterativeResults.join(', ');
    recursiveResultSpan.textContent = recursiveResults.join(', ');
    iterativeTimeSpan.textContent = iterativeTimes.join(' ms, ') + ' ms';
    recursiveTimeSpan.textContent = recursiveTimes.join(' ms, ') + ' ms';

    // Perbarui grafik
    updateChart(labels, iterativeTimes, recursiveTimes);
}

// Tampilkan kelas kompleksitas
function displayComplexity() {
    complexityDiv.innerHTML = `
        <p><strong>Iteratif:</strong> O(n * m) (n = nilai bilangan, m = jumlah partisi)</p>
        <p><strong>Rekursif:</strong> O(2^n) (rekursi menghasilkan eksponensial terhadap n)</p>
    `;
}

// Tambahkan event listener pada tombol
runBothButton.addEventListener('click', processInput);

// Tampilkan kompleksitas
displayComplexity();
