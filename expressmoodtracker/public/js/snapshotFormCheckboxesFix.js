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

        // // Prepare data to send to the server
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
        const triggerNames = checkbox.dataset.trigger.split(',').map(name => name.trim()); // Split and trim trigger names
        selectedTriggers.push(...triggerNames); // Push each trigger name individually
    });

    // Add event listeners to checkboxes
    document.querySelectorAll(".trigger-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const triggerNames = checkbox.dataset.trigger.split(',').map(name => name.trim()); // Split and trim trigger names

            const isChecked = checkbox.checked;
            // Update label style based on checkbox state
            if (isChecked) {
                checkbox.classList.add('is-clicked');
            } else {
                checkbox.classList.remove('is-clicked');
            }

            // Update the selectedTriggers array
            triggerNames.forEach(triggerName => {
                const index = selectedTriggers.indexOf(triggerName);
                if (isChecked && index === -1) {
                    selectedTriggers.push(triggerName); // Push only if not already in the array
                } else if (!isChecked && index !== -1) {
                    selectedTriggers.splice(index, 1); // Remove if unchecked
                }
            });

            console.log("Selected Triggers:", selectedTriggers); // Log the array for debugging
        });
    });

});
