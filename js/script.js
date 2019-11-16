// Declare DOM elements using jquery

    //Basic Info
    const $inputName = $('#name');
    const $userTitleSelectDropdown = $('#title');
    const $otherTitleInput = $('#other-title');

    //T-Shirt Info
    const $designSelectDropdown = $('#design');
    const $colorSelectDropdown = $('#color');
    let $colorDropdownOptions = $('#color option');

    //Activities
    const $fieldsetActivities = $('.activities');
    const $checkBoxes = $('.activities input');

// Declare variables

    let completeColorDropdownOptions = [];
    let activityCost = 0;
    let dateString = '';
    let tempDateString = '';
    let costLabel = null;

// Regex expressions
    const regex = /Puns/i;
    const regex2 = /select/i;

setupInitialView();

   /***************************************************************************************************************
      function setupInitialView
      Parameters: N/A
      returns: N/A

      Description: 

      Setup initial view setsup the user to start filling out the form quickly by putting focus on the first input
      field of name. 

      It also hides specific fields not needed and creates the event listeners for the form elements that the user
      will interact with.

   ***************************************************************************************************************/

function setupInitialView()
{
    // Make the name input field the focus on loading of webpage
    $inputName.focus();

    // Hide other title input and label
    $otherTitleInput.hide();
    $otherTitleInput.prev().hide();

    // Add event listeners to select dropdowns
    
        // Event listener for userTitleSelectDropdown

        $userTitleSelectDropdown.on('change' ,function(){

            // Get the selected value for user title

            let optionText = $("#title option:selected").text();

            // If the selected user title is Other, show the additional input fields for the user to fill out. If not
            // then hide the input fields as well.

            if (optionText === 'Other') 
            {
                updateViewForOtherTitle(true);   
            }
            else
            {
                updateViewForOtherTitle(false);
            }
            
        });

        // Event listener for designSelectDropdown
        $designSelectDropdown.on('change' ,function(){

            updateColorSelectDropdown();
            
        });

        // Store index[0] in array before removing from list
        completeColorDropdownOptions.push($colorDropdownOptions.eq(0));

        // Remove all color choices from color dropdown list
        for (let index = 1; index < $colorDropdownOptions.length; index++) 
        {
            // Store option in array before removing from list
            completeColorDropdownOptions.push($colorDropdownOptions.eq(index));

            // Remove from dropdown list
            $colorDropdownOptions.eq(index).remove();
        }

        // Hide color dropdown input and label until a design is selected
        $colorSelectDropdown.hide();
        $colorSelectDropdown.prev().hide();

        // Event listener for activites

        $fieldsetActivities.on('change', function(event){

            updateActivitiesEventSelections(event);
            
        });

}

   /***************************************************************************************************************
      function updateViewForOtherTitle
      Parameters: showTitleInput - Boolean
      returns: N/A

      Description: 

      if showTitleInput is true, this code will display the Other Title input label and input text field.

   ***************************************************************************************************************/

function updateViewForOtherTitle(showTitleInput)
{
    // If showTitleInput is true then show the input elements
    // else hide the input elements

    if (showTitleInput) 
    {
        $otherTitleInput.show();
        $otherTitleInput.prev().show();
    } 
    else 
    {
        $otherTitleInput.hide();
        $otherTitleInput.prev().hide();
    }
}

   /***************************************************************************************************************
      function updateColorSelectDropdown
      Parameters: N/A
      returns: N/A

      Description: 

      This code will update the color selection dropdown based on the selection of the design dropdown list.

   ***************************************************************************************************************/

function updateColorSelectDropdown()
{
    // Get the selection option from the dropdown

    var optionText = $("#design option:selected").text();

    // Check the text and update the color dropdown option appropriately

    if (optionText === 'Theme - JS Puns') 
    {
        $colorDropdownOptions = $('#color option');

        // Remove all color choices from color dropdown list
        for (let index = 0; index < $colorDropdownOptions.length; index++) 
        {
            // Remove from dropdown list
            $colorDropdownOptions.eq(index).remove();
        }

        // Add all color choices for puns
        for (let index = 0; index < completeColorDropdownOptions.length; index++) 
        {
            testExpression = completeColorDropdownOptions[index].text();
            
            if(regex.test(testExpression))
            {
                // Add element back to dropdown list
                $colorSelectDropdown.append(completeColorDropdownOptions[index]);
            }
        }

        // Show the dropdown selection and the label above

        $colorSelectDropdown.show();
        $colorSelectDropdown.prev().show();

    } 
    else if (optionText === 'Select Theme') 
    {
        $colorDropdownOptions = $('#color option');

        // Remove all color choices from color dropdown list
        for (let index = 0; index < $colorDropdownOptions.length; index++) 
        {
            // Remove from dropdown list
            $colorDropdownOptions.eq(index).remove();
        }

        // Add the first choice telling the user to select a theme
        $colorSelectDropdown.append(completeColorDropdownOptions[0]);

        // Hide the dropdown selection and the label above

        $colorSelectDropdown.hide();
        $colorSelectDropdown.prev().hide();
        
    }
    else
    {
        $colorDropdownOptions = $('#color option');

        // Remove all color choices from color dropdown list
        for (let index = 0; index < $colorDropdownOptions.length; index++) 
        {
            // Remove from dropdown list
            $colorDropdownOptions.eq(index).remove();
        }

        // Add all color choices for puns
        for (let index = 0; index < completeColorDropdownOptions.length; index++) 
        {
            testExpression = completeColorDropdownOptions[index].text();
            
            if(!regex.test(testExpression) && !regex2.test(testExpression))
            {
                // Add element back to dropdown list
                $colorSelectDropdown.append(completeColorDropdownOptions[index]);
            }
        }

        // Show the dropdown selection and the label above

        $colorSelectDropdown.show();
        $colorSelectDropdown.prev().show();
        
    }

}

   /***************************************************************************************************************
      function updateActivitiesEventSelections
      Parameters: event - event 
      returns: N/A

      Description: 

      This function will update the activites event selection list based on the following:

      - if an activity is selected that has a conflicting activity the conflicting activity will be not selectable.
      - as activities are selected, the running cost will be updated. 
           * if the cost is zero the total is not displayed

   ***************************************************************************************************************/

function updateActivitiesEventSelections(event)
{

    if ($(event.target).prop('checked')) 
    {

        activityCost += parseInt($(event.target).data('cost').match(/\d+/g));
        dateString = $(event.target).data('dayAndTime');

        if (costLabel === null) 
        {
            costLabel = $('<label>Total: $' + activityCost + '</label>');
            $fieldsetActivities.append(costLabel);
        }
        else
        {
            $(costLabel).html('Total: $' + activityCost);
        }

        for (let index = 0; index < $checkBoxes.length; index++) 
        {   
            tempDateString = $($checkBoxes[index]).data('dayAndTime');

            if (dateString === tempDateString && event.target !== $checkBoxes[index]) 
            {
                $checkBoxes[index].disabled = true;
                $($checkBoxes[index]).parent().addClass('notSelectable');
            }
            
        }
        
    }
    else
    {
        activityCost -= parseInt($(event.target).data('cost').match(/\d+/g));
        dateString = $(event.target).data('dayAndTime');

        if (activityCost === 0) 
        {
            $fieldsetActivities.children().last().remove();
            costLabel = null;
        }
        else
        {
            $(costLabel).html('Total: $' + activityCost);
        }

        for (let index = 0; index < $checkBoxes.length; index++) 
        {   
            tempDateString = $($checkBoxes[index]).data('dayAndTime');

            if (dateString === tempDateString && event.target !== $checkBoxes[index]) 
            {
                $checkBoxes[index].disabled = false;
                $($checkBoxes[index]).parent().removeClass('notSelectable');
            }
            
        }
    }
}



