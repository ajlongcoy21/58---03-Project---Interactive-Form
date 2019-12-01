// Declare DOM elements using jquery

//Form

const $formField = $('form');

//Basic Info
const $inputName = $('#name');
const $userTitleSelectDropdown = $('#title');
const $otherTitleInput = $('#other-title');

const $emailInput = $('fieldset #mail');

//T-Shirt Info
const $designSelectDropdown = $('#design');
const $colorSelectDropdown = $('#color');
let $colorDropdownOptions = $('#color option');

//Activities
const $fieldsetActivities = $('.activities');
const $checkBoxes = $('.activities input');

//Payment Info
const $creditCardDiv = $('fieldset #credit-card');

    // sub fields
    const $creditCardNumberInput = $('fieldset #cc-num');
    const $creditCardZipInput = $('fieldset #zip');
    const $creditCardCvvInput = $('fieldset #cvv');

const $paypalDiv = $('fieldset #paypal');
const $bitcoinDiv = $('fieldset #bitcoin');
const $paymentSelectDropdown = $('fieldset #payment');

// Submit button

const $submitButton = $('button');

// Declare variables

    let completeColorDropdownOptions = [];
    let activityCost = 0;
    let dateString = '';
    let tempDateString = '';
    let costLabel = null;
    let formOK = false;

    let nameToolTipText = "Name field cannot contain numbers or special characters";
    let emailToolTipText = "Example: example@gmail.com";
    let ccNumToolTipText = "Must contain 13-16 numbers";
    let ccZipToolTipText = "Must contain 5 numbers";
    let ccCvvToolTipText = "Must contain 3 numbers (i.e. 123)";

// Regex expressions
    const regex = /Puns/i;
    const regex2 = /select/i;

    const regexName = /^[A-Za-z ]+$/i;
    const regexEmail = /^[^@]+@[^@.]+\.[a-z]+$/i;

    const regexCCNum = /\b\d{13,16}\b/i;
    const regexCCZip = /\b\d{5}\b/i;
    const regexCCCvv = /\b\d{3}\b/i;

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

    // Hide payement information
    $creditCardDiv.hide();
    $paypalDiv.hide();
    $bitcoinDiv.hide();

    // Add event listeners to select dropdowns
    
        // Event listener for form submit

        //$submitButton.on('submit', submitFormValidation(event));

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

        // Event listener for activites

        $fieldsetActivities.on('change', function(event){

            updateActivitiesEventSelections(event);
            
        });

        // Event listener for payments

        $paymentSelectDropdown.on('change', function(event){

            updatePaymentInformation();
            
        });

        // Event listener for input fields

        $inputName.on("input", createListener(isValidName));
        $emailInput.on("input", createListener(isValidEmail));
        $creditCardNumberInput.on("input", createListener(isValidCCNum));
        $creditCardZipInput.on("input", createListener(isValidZip));
        $creditCardCvvInput.on("input", createListener(isValidCCV));

        // This event listener is used to redisplay the tool tip when the input gains focus

        $inputName.on("focusin", onFocusListener(isValidName));
        $emailInput.on("focusin", onFocusListener(isValidEmail));
        $creditCardNumberInput.on("focusin", onFocusListener(isValidCCNum));
        $creditCardZipInput.on("focusin", onFocusListener(isValidZip));
        $creditCardCvvInput.on("focusin", onFocusListener(isValidCCV));

        // This event listener is used to hide the tool tip when the input loses focus

        $inputName.on("focusout", offFocusListener());
        $emailInput.on("focusout", offFocusListener());
        $creditCardNumberInput.on("focusout", offFocusListener());
        $creditCardZipInput.on("focusout", offFocusListener());
        $creditCardCvvInput.on("focusout", offFocusListener());

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

    // Make credit card the selected payment option

    $paymentSelectDropdown.val('Credit Card');
    updatePaymentInformation();

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
     function updatePaymentInformation
    Parameters: N/A
    returns: N/A

    Description: 

    This code will update the dislay with the selection from the user for the payment option.

***************************************************************************************************************/

function updatePaymentInformation()
{
    // Get the selection option from the dropdown

    var optionText = $("#payment option:selected").text();

    if (optionText === "Credit Card") 
    {
        $creditCardDiv.show();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    }
    else if (optionText === 'Bitcoin')
    {
        $bitcoinDiv.show();
        $creditCardDiv.hide();
        $paypalDiv.hide();
    } 
    else if (optionText === "PayPal")
    {
        $paypalDiv.show();
        $creditCardDiv.hide();
        $bitcoinDiv.hide();
    }
    else 
    {
        $creditCardDiv.hide();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    }
    

}

/***************************************************************************************************************
     function showOrHideTip
    Parameters: show - boolean
                element - dom element that is shown or not
    returns: N/A

    Description: 

    This code will show or hide the tool tip for the corresponding input

***************************************************************************************************************/

function showOrHideTip(show, element) 
{
// show element when show is true, hide when false
if (show) 
{
    element.style.display = "inline-block";
} 
else 
{
    element.style.display = "none";
}
}

/***************************************************************************************************************
     functions multiple
    Parameters: regex - regular expression
    returns: N/A

    Description: 

    these functions will compare the input text vs the regex and see if it matches the pattern needed or not.

***************************************************************************************************************/

    function isValidName(userName) 
    {
        return regexName.test(userName);
    }

    function isValidEmail(email) 
    {
        return regexEmail.test(email);
    }

    function isValidCCNum(ccNum) 
    {
        return regexCCNum.test(ccNum);
    }

    function isValidZip(zip) 
    {
        return regexCCZip.test(zip);
    }

    function isValidCCV(ccv) 
    {
        return regexCCCvv.test(ccv);
    }

    function createListener(validator) 
    {
        return e => {
            
            const text = e.target.value;
            const valid = validator(text);

            let toolTipText = '';

            if (valid) 
            {
                e.target.style.background = '#fff';
            } 
            else 
            {
                e.target.style.background = '#fd9898';
            }

            const showTip = !valid;

            if (text === '') 
            {
                toolTipText = 'Input is empty, please type the needed information.'

            } else 
            {
                if (e.target.id === 'name') 
                {
                    toolTipText = nameToolTipText;
                }
                else if (e.target.id === 'mail') 
                {
                    toolTipText = emailToolTipText;
                } 
                else if (e.target.id === 'cc-num')
                {
                    toolTipText = ccNumToolTipText;
                }
                else if (e.target.id === 'zip') 
                {
                    toolTipText = ccZipToolTipText;
                }
                else if (e.target.id === 'cvv')
                {
                    toolTipText = ccCvvToolTipText;
                }
            }

            const tooltip = e.target.nextElementSibling;

            tooltip.textContent = toolTipText;

            showOrHideTip(showTip, tooltip);
        };
    }

    function onFocusListener(validator)
    {
        return e => {
            const text = e.target.value;
            const valid = validator(text);

            if (valid) 
            {
                e.target.style.background = '#fff';
            } 
            else 
            {
                e.target.style.background = '#fd9898';
            }

            const showTip = !valid;

            if (text === '') 
            {
                toolTipText = 'Input is empty, please type the needed information.'

            } else 
            {
                if (e.target.id === 'name') 
                {
                    toolTipText = nameToolTipText;
                }
                else if (e.target.id === 'mail') 
                {
                    toolTipText = emailToolTipText;
                }  
                else if (e.target.id === 'cc-num')
                {
                    toolTipText = ccNumToolTipText;
                }
                else if (e.target.id === 'zip') 
                {
                    toolTipText = ccZipToolTipText;
                }
                else if (e.target.id === 'cvv')
                {
                    toolTipText = ccCvvToolTipText;
                }
            }

            const tooltip = e.target.nextElementSibling;

            tooltip.textContent = toolTipText;

            showOrHideTip(showTip, tooltip);
        };
    }

    function offFocusListener()
    {
        return e => {
            const tooltip = e.target.nextElementSibling;
            showOrHideTip(false, tooltip);
        };
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
            costLabel = $('<label class="darkBlue">Total: $' + activityCost + '</label>');
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

    checkCostValue();
}

/***************************************************************************************************************
     function checkCostValue
    Parameters: N/A
    returns: N/A

    Description: 

    This function will check the cost value to see if the user selected an activity to attend to. If not then
    it will make the border red to indicate to the user that there is an error in that section of the form.

***************************************************************************************************************/

function checkCostValue()
{
    if (activityCost === 0)
    {
        $fieldsetActivities.css('border', 'solid 3px red');
    }
    else
    {
        $fieldsetActivities.css('border', 'none');
    }
}

/***************************************************************************************************************
     function form on submit
    Parameters: N/A
    returns: N/A

    Description: 

    This will check to see if the form has the appropriate fields with data. If not it will display an alert message
    to the user and indicate to the user on the page which fields need input.

***************************************************************************************************************/

$('form').on("submit", function(e){

    // if form is not ok then block submit

    if (!formOK) 
    {
        e.preventDefault();
    }

    // initialize alert message

    let alertMessageText = '';

    // Check name field is valid

    if (!isValidName($inputName.val())) 
    {
        alertMessageText += '- Name is not valid. Please enter a valid name without numbers or special characters.';
        $inputName.css('background-color', '#fd9898');
    }

    // check email field is valid

    if (!isValidEmail($emailInput.val())) 
    {
        $emailInput.css('background-color', '#fd9898');

        if (alertMessageText === '') 
        {
            alertMessageText += '- Email is not valid. Please enter a valid email address.';    
        }
        else
        {
            alertMessageText += '\n\n- Email is not valid. Please enter a valid email address.';
        }
        
    }

    //check to see if user selected an activity to attend

    if (activityCost === 0) 
    {
        if (alertMessageText === '') 
        {
            alertMessageText += '- Please select an activity to attend during the conference.';    
        }
        else
        {
            alertMessageText += '\n\n- Please select an activity to attend during the conference.';
        }

        checkCostValue();
    }

    // Check to see the payment method. if Credit Card is selected check the credit card fields for proper format

    var optionText = $("#payment option:selected").text();

    if (optionText === "Credit Card") 
    {
        if (!isValidCCNum($creditCardNumberInput.val())) 
        {

            $creditCardNumberInput.css('background-color', '#fd9898');

            if (alertMessageText === '') 
            {
                alertMessageText += '- Credit card number is invalid. It must be between 13 and 16 numbers.';
            }
            else
            {
                alertMessageText += '\n\n- Credit card number is invalid. It must be between 13 and 16 numbers.';
            }
            
        }

        if (!isValidCCV($creditCardCvvInput.val())) 
        {

            $creditCardCvvInput.css('background-color', '#fd9898');
            
            if (alertMessageText === '') 
            {
                alertMessageText += '- Credit card ccv is invalid. It must be 3 numbers.';
            } 
            else 
            {
                alertMessageText += '\n\n- Credit card ccv is invalid. It must be 3 numbers.';
            }
            
        }

        if (!isValidZip($creditCardZipInput.val())) 
        {

            $creditCardZipInput.css('background-color', '#fd9898');

            if (alertMessageText === '') 
            {
                alertMessageText += '- Credit card zip is invalid. It must be 5 numbers.';
            } 
            else 
            {
                alertMessageText += '\n\n- Credit card zip is invalid. It must be 5 numbers.';
            }
            
        }

        
    }

    // check to see if any of the needed fields are invalid

    if (alertMessageText === '') 
    {
        // form is ok initiate submit

        formOK = true;
        $(this)[0].submit();
    } 
    else 
    {
        // form is not ok display alert message with missing fields

        alert(alertMessageText);
    }

});


