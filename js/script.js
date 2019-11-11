// Declare DOM elements using jquery

//Basic Info
const $inputName = $('#name');
const $userTitleSelectDropdown = $('#title');
const $otherTitleInput = $('#other-title');

//T-Shirt Info
const $designSelectDropdown = $('#design');
const $colorSelectDropdown = $('#color');
let $colorDropdownOptions = $('#color option');

// Declare variables
let completeColorDropdownOptions = [];

// Regex expressions
const regex = /Puns/i;
const regex2 = /select/i;

setupInitialView();


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

}

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

function updateColorSelectDropdown()
{
    var optionText = $("#design option:selected").text();

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

        $colorSelectDropdown.show();
        $colorSelectDropdown.prev().show();
        
    }

}



