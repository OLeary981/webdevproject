/*
This form works to add a snapshot, but will not transfer selected triggers to the controller. 
It has been removed from the addsnapshot.ejs file to let me experiment with other options.

Moving lines 31 and 32 higher up would make sense so that the trigger buttons were in the same part of the code as the levels and notes
But when I do this the buttons no longer grey out when clicked, and don't get added to the array.

*/


document.addEventListener('DOMContentLoaded', function() {
    const selectedTriggers = []; // Initialize an empty array to store selected trigger name
    
    // Add event listener for trigger buttons
    document.querySelectorAll(".trigger-button").forEach((button) => {
        button.addEventListener("click", () => {
            const triggerName = button.dataset.trigger;
            
            // Change button color and disable interaction
            button.classList.add('is-clicked');
            button.disabled = true;
            
            // Add the trigger name to the array
            selectedTriggers.push(triggerName);
            
            console.log("Trigger added:", triggerName);
            console.log("Selected Triggers:", selectedTriggers); // Log the array for debugging
        });
    });

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
        
        // Prepare data to send to the server
        const formData = {
            triggers: selectedTriggers,
            sliderLevels: sliderLevels,
            notes: notesValue
        };
        console.log(formData);
        
        // Trigger form submission
        this.submit(); // 'this' refers to the form element itself
    });
});