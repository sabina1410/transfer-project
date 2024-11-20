const createForm = document.querySelector('.create-form');
const fetchForm = document.querySelector('.fetch-form');
const updateForm = document.querySelector('.update-form');
const deleteForm = document.querySelector('.delete-form');
const fetchResultContainer = document.querySelector(".fetch-result");


document.addEventListener('DOMContentLoaded', () => {
    fetchAllTransactions();
});


async function fetchAllTransactions() {
    const url = 'https://acb-api.algoritmika.org/api/transaction';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch transactions.');
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            fetchResultContainer.innerHTML = '<p>No transactions available.</p>';
            return;
        }

        
        displayTransactions(data.reverse());
    } catch (err) {
        console.error(err);
        fetchResultContainer.innerHTML = '<p>Failed to fetch transactions.</p>';
    }
}


function displayTransactions(data) {
    const resultHTML = data.map(item => {
        return `
            <div class="transfer-card">
                <h3>Transaction ID: ${item.id}</h3>
                <p><span>Amount:</span> <span class="amount">${item.amount}</span></p>
                <p><span>From:</span> ${item.from}</p>
                <p><span>To:</span> ${item.to}</p>
            </div>
        `;
    }).join('');

    fetchResultContainer.innerHTML = resultHTML;
}


createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const from = document.querySelector('.from-input').value.trim();
    const to = document.querySelector('.to-input').value.trim();
    const amount = document.querySelector('.amount-input').value.trim();

    if (!from || !to || !amount) {
        document.querySelector('.create-result').textContent = 'All fields are required.';
        return;
    }

    await createData({ from, to, amount });
});


async function createData(data) {
    try {
        const response = await fetch('https://acb-api.algoritmika.org/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to add transaction.');
        }

        const newTransaction = await response.json();

        
        prependTransaction(newTransaction);

        document.querySelector('.create-result').textContent = 'Data added.';
    } catch (err) {
        console.error(err);
        document.querySelector('.create-result').textContent = 'Failed to add transaction.';
    }
}


function prependTransaction(transaction) {
    const transactionHTML = `
        <div class="transfer-card">
            <h3>Transaction ID: ${transaction.id}</h3>
            <p><span>Amount:</span> <span class="amount">${transaction.amount}</span></p>
            <p><span>From:</span> ${transaction.from}</p>
            <p><span>To:</span> ${transaction.to}</p>
        </div>
    `;


    fetchResultContainer.insertAdjacentHTML('afterbegin', transactionHTML);
}


fetchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.querySelector('.fetch-from-input').value.trim();
    const to = document.querySelector('.fetch-to-input').value.trim();
    fetchDataByFromOrTo(from, to);
});


function fetchDataByFromOrTo(fromValue, toValue) {
    let url = 'https://acb-api.algoritmika.org/api/transaction';
    const params = [];

    if (fromValue) {
        params.push(`from=${encodeURIComponent(fromValue)}`);
    }
    if (toValue) {
        params.push(`to=${encodeURIComponent(toValue)}`);
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) { 
                throw new Error('Data not found!');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) { 
                fetchResultContainer.innerHTML = '<p>Data not found!</p>';
                return;
            }

            
            displayTransactions(data.reverse());
        })
        .catch(err => {
            console.error(err);
            fetchResultContainer.innerHTML = '<p>Data not found!</p>';
        });
}


updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const update_id_input = document.querySelector('.update-id-input').value.trim();
    const update_amount_input = document.querySelector('.update-amount-input').value.trim();
    const update_from_input = document.querySelector('.update-from-input').value.trim();
    const update_to_input = document.querySelector('.update-to-input').value.trim();

    if (!update_id_input || !update_amount_input || !update_from_input || !update_to_input) {
        document.querySelector('.update-result').textContent = 'All fields are required.';
        return;
    }

    const updatedData = {
        from: update_from_input,
        to: update_to_input,
        amount: update_amount_input,
    };

    updateData(update_id_input, updatedData);
});


function updateData(id, updatedData) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Update failed!');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.update-result').textContent = `Update successful: ID: ${data.id}, Amount: ${data.amount}, From: ${data.from}, To: ${data.to}`;
            fetchAllTransactions(); 
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.update-result').textContent = 'Update failed!';
        });
}


deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const delete_id_input = document.querySelector('.delete-id-input').value.trim();

    if (!delete_id_input) {
        document.querySelector('.delete-result').textContent = 'ID is required.';
        return;
    }

    deleteData(delete_id_input);
});


function deleteData(id) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Deletion failed!');
            }
            document.querySelector('.delete-result').textContent = `ID: ${id} deleted!`;
            fetchAllTransactions(); 
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.delete-result').textContent = 'Deletion failed!';
        });
}








