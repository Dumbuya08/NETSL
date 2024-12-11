document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');
    const fileName = event.target.filename.value;
    
    for (const file of fileInput.files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = fileName;
            img.style.width = '100px';  // Set the desired width
            listItem.textContent = `${fileName} (${file.name})`;
            listItem.appendChild(img);
            fileList.appendChild(listItem);
        };
        reader.readAsDataURL(file);
    }
});
