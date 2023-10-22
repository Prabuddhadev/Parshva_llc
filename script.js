// Function to populate the Supplier dropdown from the API
function populateSupplierDropdown() {
    // Make a GET request to the Supplier API endpoint
    fetch('https://flask-app-backend-740c56041833.herokuapp.com/suppliers')
        .then(response => response.json())
        .then(data => {
            const supplierDropdown = document.getElementById('supplier');
            supplierDropdown.innerHTML = ''; // Clear existing options

            // Add an empty default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select Supplier';
            supplierDropdown.appendChild(defaultOption);

            data.Supplier.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier;
                option.text = supplier;
                supplierDropdown.appendChild(option);
            });
        });
}

// Function to populate the PO Number dropdown based on the selected supplier
function populatePODropdown(selectedSupplier) {
    if (selectedSupplier) {
        // Make a POST request to the PO Details API endpoint
        fetch('https://flask-app-backend-740c56041833.herokuapp.com/po_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ supplier: selectedSupplier })
        })
            .then(response => response.json())
            .then(data => {
                const poDropdown = document.getElementById('po');
                poDropdown.innerHTML = ''; // Clear existing options

                // Add an empty default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = 'Select PO Number';
                poDropdown.appendChild(defaultOption);

                data.purchase_order_details.forEach(po => {
                    const option = document.createElement('option');
                    option.value = po;
                    option.text = po;
                    poDropdown.appendChild(option);
                });
            });
    } else {
        // If no supplier is selected, clear the PO dropdown
        const poDropdown = document.getElementById('po');
        poDropdown.innerHTML = '';
    }
}

// Function to populate the description block based on the selected PO Number
function populateDescription(selectedPO) {
    if (selectedPO) {
        // Make a POST request to the PO Description API endpoint
        fetch('https://flask-app-backend-740c56041833.herokuapp.com/po_disc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ purchase_ordr_num: selectedPO })
        })
            .then(response => response.json())
            .then(data => {
                const description = document.getElementById('description');
                description.innerHTML = data.description.join('<br>');
            });
    } else {
        // If no PO Number is selected, clear the description block
        const description = document.getElementById('description');
        description.innerHTML = '';
    }
}

// Event listeners for dropdowns
document.getElementById('supplier').addEventListener('change', function () {
    const selectedSupplier = this.value;
    populatePODropdown(selectedSupplier);
});

document.getElementById('po').addEventListener('change', function () {
    const selectedPO = this.value;
    populateDescription(selectedPO);
});

// Event listener for the Submit button
document.getElementById('submitButton').addEventListener('click', function () {
    const form = document.getElementById('docketForm');
    const formData = new FormData(form);
    const formObject = {};

    formData.forEach((value, key) => {
        if (key !== 'po') {
            formObject[key] = [value];
        }
    });

    // Fetch the selected PO Number
    const selectedPO = document.getElementById('po').value;

    // Make a POST request to get the PO description
    fetch('https://flask-app-backend-740c56041833.herokuapp.com/po_disc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ purchase_ordr_num: selectedPO })
    })
        .then(response => response.json())
        .then(data => {
            // Add the description to the formObject
            formObject['description'] = [data.description.join(', ')];
            formObject['po_number'] = [data.po_number]

            // Create the request object
            const reqObj = { 'data': formObject };

            // Make a POST request to the 'http://localhost:5000/submit' endpoint
            fetch('https://flask-app-backend-740c56041833.herokuapp.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqObj)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    // Display a success message on the page
                    const message = document.getElementById('message');
                    message.style.color = "green";
                    message.innerHTML = 'Form submitted successfully.';
                } else {
                    
                    const message = document.getElementById('message');
                    message.style.color = "red";
                    message.innerHTML = 'error occured: Please try again.';
                }
            })
                .catch(error => {
                    const message = document.getElementById('message');
                    message.style.color = "red";
                    message.innerHTML = 'error occured: Please try again.';
                    
                    console.error('An error occurred:', error);

                });
            
        });
});

// Populate the Supplier dropdown when the page loads
populateSupplierDropdown();
