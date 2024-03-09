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
});