document.addEventListener('DOMContentLoaded', function() {
    const selectedTriggers = []; // Initialize an empty array to store selected trigger names
   
    // Add event listener for form submission
    document.getElementById('snapshot-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect the slider levels
        const sliderLevels = {};
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            sliderLevels[slider.id] = slider.value;
        });
       
        // Get the value of the notes input field
        const notesValue = document.getElementById('notes').value;

        // // Convert selectedTriggers array to a comma-separated string
        // const selectedTriggersString = selectedTriggers.join(',');

        const newElement = document.createElement('input');
        newElement.name = 'triggers';
        newElement.type = 'hidden';
        newElement.value = selectedTriggers;
        this.appendChild(newElement);

       
        // Prepare data to send to the server
        // const formData = {
        //     triggers: selectedTriggers,
        //     sliderLevels: sliderLevels,
        //     notes: notesValue
        // };
        // console.log(formData);
       
        // Trigger form submission
        this.submit(); // 'this' refers to the form element itself
    });

    
document.querySelectorAll(".trigger-checkbox:checked").forEach((checkbox) => {
    selectedTriggers.push(checkbox.dataset.trigger);
    console.log("pushing prechecked boxes now")
    console.log(selectedTriggers);
});

// Add event listeners to checkboxes
document.querySelectorAll(".trigger-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const triggerName = checkbox.dataset.trigger;
        const isChecked = checkbox.checked;

        // Update label style based on checkbox state
        if (isChecked) {
            checkbox.classList.add('is-clicked');
        } else {
            checkbox.classList.remove('is-clicked');
        }

        // Update the selectedTriggers array
        if (isChecked) {
            selectedTriggers.push(triggerName);
        } else {
            const index = selectedTriggers.indexOf(triggerName);
            if (index !== -1) {
                selectedTriggers.splice(index, 1);
            }
        }

        console.log("Trigger added/removed:", triggerName);
        console.log("Selected Triggers:", selectedTriggers); // Log the array for debugging
    });
});

});