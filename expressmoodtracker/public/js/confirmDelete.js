function confirmDelete() {
    if (confirm("Are you sure you want to delete this snapshot?")) {
        document.getElementById('deleteForm').submit();
    }
}