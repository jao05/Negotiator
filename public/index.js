let cityChoice;
let userFirstName;
let userLastName;
let loginUserName;
let loginPassword;

let itemChoice;
let itemYear;
let itemMake;
let itemModel;
let negotiatorSelection


function showLandingPage()
{
    // Load landing page
    // Give option to sign-up or login
    
    // If user alreay exists...login
    loginAsUser();

    // If user doesn't exist...sign-up
    signUpAsUser(); 
}

function loginAsUser()
{
    // Take in required info including new login credentials
    // After valid credentials are provided, load the Start page, otherwise give error msg
    renderStartPage();
}

function signUpAsUser()
{
    // Hide Start Page
    $('.startPage').hide();

    // Hide Landing Page
    $('.landingPage').hide();

    // Show Sign Up Page
    $('.userSignupPage').show();

    // If user clicks "Finish" button, take in required info including new login credentials
    // After valid credentials are entered, add new user to the database collection that holds users and render the Start Page
    //otherwise show meaningful error msg
    $('#userSignupForm').on('submit', function(event){

        event.preventDefault();

        // Store user choices in variables
        userFirstName = $('#userFirstName').val(); 
        userLastName = $('#userLastName').val();         
        loginUserName = $('#username').val();
        loginPassword = $('#password').val();

        let data = {
            
            firstName: userFirstName,
            lastName: userLastName,
            username: loginUserName,
            password: loginPassword
       };

       // Using data stored in variables, create an object to add new user to the database collection that holds users
       let settings = { 
            url: "/users", 
            type: 'POST', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(responseData) { 
                // Display user sign-up message on screen                
                $('.userSignupPage').html(`<p>Thanks ${ responseData.fullName }, you're all signed up!</p>` + 
                    `<button type='submit' id='backToHomeBtn'>Back to Home</button>`);

                // Listen for click on 'backToHomeBtn'
                $('#backToHomeBtn').on('click', function(event){

                    event.preventDefault();

                    // Go back to Start Page
                    location.reload();
                });
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);       
    });

    // If user clicks "Cancel" button, reload the app
    // Listen for click on 'Restart' button
    $('#cancelSignupBtn').on('click', function(event){

        event.preventDefault();

        // Go back to Start Page
        location.reload();
    }); 
}

function renderLandingPage()
{
    // Hide all other pages
    $('.startPage').hide();    
    $('.selectAreaPage').hide();
    $('.itemDetailPage').hide();
    $('.chooseNegotiatorPage').hide();
    $('.negotiatorSignupPage').hide();
    $('.userSignupPage').hide();

    // Listen for click on 'Get Started' button
    $('#getStartedBtn').on('click', function(){

        // Take user to Start Page
        renderStartPage();
    });

    // Listen for click on 'Sign Up' button
    $('#signupBtn').on('click', function(){

        signUpAsUser();
    });
}

function renderStartPage()
{
    // Hide Landing Page
    $('.landingPage').hide();

    // Add 'Restart' button to main element
    $('main').append(`<button type="submit" id="restartBtn">Restart</button>`);

    // Listen for click on 'Restart' button
    $('#restartBtn').on('click', function(){

        // Go back to Start Page
        location.reload();
    });

    // load the Start Page
    $('.startPage').show();    
    // $('.selectAreaPage').hide();
    // $('.itemDetailPage').hide();
    // $('.chooseNegotiatorPage').hide();
    // $('.negotiatorSignupPage').hide();

    // Calling in order to activate the event listener
    makeUserTypeSelection();
}

function makeUserTypeSelection()
{    

    // Listen for click on "Need A Negotiator" button
    $('.needNegotiatorBtn').on('click', function(){
       

        // Allow user to select the area in which the negotiation will take place
        selectArea();

        // Hide the Start Page
        $('.startPage').hide();
    });    
    
    // Listen for click on "Become A Negotiator" button
    $('.becomeNegotiatorBtn').on('click', function(){
        

        // Allow user to select the area in which the negotiation will take place
        signUpAsNegotiator();

        // Hide the Start Page
        $('.startPage').hide();

        // Show Negotiator Sign-up page
        $('.negotiatorSignupPage').show();
    });       
}

function signUpAsNegotiator()
{
    // Take in required info
    // Listen for Negotiator sign-up form submission
    $('.negotiatorSignupForm').on('submit', function(event){

       // Prevent default form submission behavior
       event.preventDefault();

       // Store form inputs into variables
       let negotiatorSignupLocation = $('#negotiatorSignupLocationSelection').val();
       let negotiatorSignupExpertise = $('#negotiatorSignupExpertiseSelection').val();
       let negotiatorSignupFirstName = $('#agentFirstName').val();
       let negotiatorSignupLastName = $('#agentLastName').val();
       
       let data = {
            
            metroArea: negotiatorSignupLocation,
            expertise: negotiatorSignupExpertise,
            agentFirstName: negotiatorSignupFirstName,
            agentLastName: negotiatorSignupLastName
       };

       // Using data stored in variables, create an object to add new negotiator to the database collection that holds Negotiators
       let settings = { 
            url: "/negotiators", 
            type: 'POST', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(data) { 
                console.log(data);
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);

       // Display agent sign-up message on screen
       $('.negotiatorSignupPage').html(`<p>Thanks ${ negotiatorSignupFirstName }, you're all signed up and ready to negotiate in ${ negotiatorSignupLocation }!</p>` + 
            `<p>You will receive notification when you have been matched with a client.</p>`
        );       
    });    
}

function selectArea()
{
    // Show "selectAreaPage"
    $('.selectAreaPage').show();

    // Allow user to choose from a dropdown list of available cities
    // Listen for submission of area choice    
    $('#selectAreaForm').on('submit', function(event){

        // Prevent default form submission behavior
        event.preventDefault();

        // Store city choice in variables        
        cityChoice = $('#citySelection').val();        

        // Hide the Select Area Page
        $('.selectAreaPage').hide();

        // Move to "Select Item Screen"
        selectItemAndAddDetail();
    });    
}

function selectItemAndAddDetail()
{
    // Show "itemDetailPage", but hide the Item Detail Form
    $('.itemDetailPage').show();
    $('.itemDetailForm').hide();

    // Allow user to choose from a dropdown list of items for which we have negotiators
    // Listen for submission of item choice
    $('.nextBtn').on('click', function(){

        // Remove the 'Next' button
        $('.nextBtn').hide();

        // Store item choice
        itemChoice = $('#itemSelection').val();

        // Reveal item detail form, 
        $('.itemDetailForm').show();

        // Listen for 'Done' button submission, 
        $('.itemDetailDoneBtn').on('click', function(event){

            event.preventDefault();

            // then take-in & store item detail inputs from form into variables
            itemYear = $('#itemYear').val();
            itemMake = $('#itemMake').val();
            itemModel = $('#itemModel').val();             

            /*
            // make an (mock)AJAX request using the variable as parameters
            getAndDisplayAgents();
            */

            // Hide Item Detail Page
            $('.itemDetailPage').hide();

            // Using the user's inputs as parameters, display negotiators that fit criteria
            getNegotiatorChoices(cityChoice, itemChoice);
        });
    });  
}

function chooseDifferentCity()
{
    // Provide link to return to "Select Area Screen"
    // **********Back button??**************
}

function getNegotiatorChoices(chosenCity, chosenItem)
{
    // Make an AJAX call that passes in the user's choices as query parameters
    $.getJSON('/negotiators', {chosenCity, chosenItem}, generateNegotiatorChoices);
}

function generateNegotiatorChoices(data)
{    
    // Use as callBack function after request to get a list of negotiator choices

    // Array to hold the generated strings
    let negotiatorStrings = [];

    // For each matched negotiator returned, create a string with the negotiator's info and
    // add the string to the negotiatorStrings array
    for ( let neg = 0; neg < data.negotiators.length; neg++)
    {
        negotiatorStrings.push(`<input type="radio" name="negotiatorChoices" id="choice${neg + 1}" value="${data.negotiators[neg].agentName}" required>${data.negotiators[neg].agentName}`);
    }

    // If no negotiators fit the criteria (meaning there are none in db), return an appropriate message
    if (negotiatorStrings.length == 0)
    {        
        printNoNegotiatorMsg();
    }
    else
    {
        // Call 'displayNegotiatorChoices()' to display choices on screen    
        displayNegotiatorChoices(negotiatorStrings);    
    }    
}

function displayNegotiatorChoices(arrayOfNegotiatorInfoStrings)
{    
    // For each matched negotiator returned, display response negotiator as a radio button choice
    for( string = 0; string < arrayOfNegotiatorInfoStrings.length; string++)
    {
        $('#chooseNegotiatorForm').append(arrayOfNegotiatorInfoStrings[string]);
    }

    // Show the list of negotiators
    $('.chooseNegotiatorPage').show();

    // Call make 'makeNegotiatorSelection()' to allow user to choose a negotiator
    makeNegotiatorSelection();
}

function makeNegotiatorSelection()
{
    // listen for submission after a radio button is clicked
    $('#chooseNegotiatorForm').on('submit', function(event){

        // prevent default form submission behavior
        event.preventDefault();

        // Store selected negotiator's name in a varible
        negotiatorSelection = $('input[name=negotiatorChoices]:checked').val();
        
        // Make a GET request to get ID of the negotiator***************

        // Make a PUT request to create the user, save the negotiator to the user's object
        
        
        // Show Negotiator selection confirmation & message
        $('#matchedAgents').hide();
        $('.chooseNegotiatorPage').append(`<p>Congrats ${userFirstName}, you will be represented well by ${negotiatorSelection}!</p>` + 
            `<p>You'll be contacted shortly to provide more info so that we can get started on your purchase.</p>`);  
        
        // Change the text of the 'Restart' button to 'Done'   
        $('#restartBtn').text('Done');
    });    
}

function printNoNegotiatorMsg()
{    
    // Print message to chooseNegotiatorPage
    $('.chooseNegotiatorPage').html(`<p>Sorry, currently there are no negotiators that fit your criteria, but we're working on it.  Try again later.</p>`);

    // Show chooseNegotiaote Page
    $('.chooseNegotiatorPage').show();
}

function chooseDifferentItem()
{
    // Provide link to return to "Select Item Screen"
    // Or add Back button??
    selectItemAndAddDetail();
}

$(function() {
    
    renderLandingPage();    
})

