const createForm = document.querySelector('.create-form');
const fetchForm = document.querySelector('.fetch-form');
const updateForm = document.querySelector('.update-form')
const deleteForm = document.querySelector('.delete-form')

createForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    const from = document.querySelector('.from-input').value;
    const to = document.querySelector('.to-input').value;
    const amount = document.querySelector('.amount-input').value;

    await createData({from, to, amount});
})

async function createData(data){
    try{
        await fetch('https://acb-api.algoritmika.org/api/transaction',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        document.querySelector('.create-result').textContent = 'Data added.'
    }
    catch (err){
        console.log(err)
    }
}

fetchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.querySelector('.fetch-from-input').value;
    const to = document.querySelector('.fetch-to-input').value;
    fetchDataByFromOrTo(from,to);
})

function fetchDataByFromOrTo(fromValue, toValue) {
    let url = 'https://acb-api.algoritmika.org/api/transaction';
    if (fromValue) {
        url += `?from=${encodeURIComponent(fromValue)}`;
    }
    if (toValue) {
        url +=`fromValue ? &to=${encodeURIComponent(toValue)} : ?to=${encodeURIComponent(toValue)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) { 
                document.querySelector('.fetch-result').textContent = 'Data not found!';
                throw new Error('Data not found!');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) { 
                document.querySelector('.fetch-result').textContent = 'Data not found!';
                return;
            }

            const resultText = data.map(item => 
                `ID: ${item.id}, Amount: ${item.amount}, From: ${item.from}, To: ${item.to}`
            ).join('\n');
            document.querySelector('.fetch-result').textContent = resultText;
        })
        .catch(err => {
            document.querySelector('.fetch-result').textContent = 'Data not found!';
            console.error(err);
        });
}

updateForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const update_id_input = document.querySelector('.update-id-input').value;
    const update_amount_input = document.querySelector('.update-amount-input').value
    const update_from_input = document.querySelector('.update-from-input').value
    const update_to_input = document.querySelector('.update-to-input').value

    const updatedData = {
        from: update_from_input,
        to: update_to_input,
        amount: update_amount_input
    };
    
    updateData(update_id_input,updatedData)
})

function updateData(id, updatedData) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData) 
    })
    .then(response => {
        if (!response.ok) {
            document.querySelector('.update-result').textContent = 'Update failed!';
            throw new Error('Update failed!');
        }
        return response.json(); 
    })
    .then(data => {
        document.querySelector('.update-result').textContent = `Update successfuly: ID: ${data.id}, Amount: ${data.amount}, From: ${data.from}, To: ${data.to}`;
    })
    .catch(err => {
        console.log(err)
        document.querySelector('.update-result').textContent = 'Update failed!';
    });
}


deleteForm.addEventListener('submit',(e) => {

    e.preventDefault()
    const delete_id_input = document.querySelector('.delete-id-input').value
    
    deleteData(delete_id_input)
})

function deleteData(id) {
    const url = `https://acb-api.algoritmika.org/api/transaction/${id}`;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            document.querySelector('.delete-result').textContent = 'Deletion failed!';
            throw new Error('Deletion failed!');
        }
        document.querySelector('.delete-result').textContent = `ID: ${id} deleted!`;
    })
    .catch(err => {
        console.error(err);
        document.querySelector('.delete-result').textContent = 'Deletion failed!';
    });
}