const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('file-list');

// Handle file upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload file.');
        }

        const result = await response.json();
        alert(result.message);
        loadFiles(); // Refresh the file list
    } catch (error) {
        alert(error.message);
    }
});

// Load and display the list of uploaded files
async function loadFiles() {
    try {
        const response = await fetch('/files');
        if (!response.ok) {
            throw new Error('Failed to fetch files.');
        }

        const files = await response.json();
        fileList.innerHTML = ''; // Clear the current list
        files.forEach(({ filename, filepath }) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = filepath;
            link.textContent = filename;
            link.download = filename;
            li.appendChild(link);
            fileList.appendChild(li);
        });
    } catch (error) {
        console.error(error.message);
    }
}

// Load files on page load
loadFiles();
