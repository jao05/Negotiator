let MOCK_NEGOTIATOR_AGENTS = {
    "agents": [
        {
            "id": "1111111",
            "expertise": "Cars",            
            "agentName": "John Carson",
            "metroArea": "New York City"           
        },
        {
            "id": "2222222",
            "expertise": "Cars",            
            "agentName": "Jane Doe",
            "metroArea": "Atlanta"          
        },
        {
            "id": "333333",
            "expertise": "Homes",            
            "agentName": "Jim Homer",
            "metroArea": "Los Angeles"         
        },
        {
            "id": "4444444",
            "expertise": "Boats",            
            "agentName": "Jackie Boatman",
            "metroArea": "Miami"          
        },
        {
            "id": "555555",
            "expertise": "Cars",            
            "agentName": "Joe Schmoe",
            "metroArea": "New York City"           
        },
        {
            "id": "666666",
            "expertise": "Planes",            
            "agentName": "Jet Li",
            "metroArea": "Hong Kong"          
        },
        {
            "id": "777777",
            "expertise": "Homes",            
            "agentName": "Napoleon Bonaparte",
            "metroArea": "Paris"         
        },
        {
            "id": "888888",
            "expertise": "Homes",            
            "agentName": "Hillary Bush",
            "metroArea": "Miami"          
        }
    ]
};

let cityChoice;
let userFirstName;
let userLastName;

let itemChoice;
let itemYear;
let itemMake;
let itemModel;


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
    // Take in required info including new login credentials
    // After valid credentials are entered, add new user to the database collection that holds users, otherwise show meaningful error msg
    
    // After user sign-up, load the Start page
    renderStartPage();
}




// ********************START HERE FOR MVP, AND WORRY ABOUT LOGINS & SIGN-INS LATER??********************************

function renderStartPage()
{
    // Hide Landing Page
    $('.landingPage').hide();

    // load the Start Page
    $('.startPage').show();
    $('.selectAreaPage').hide();
    $('.itemDetailPage').hide();
    $('.chooseNegotiatorPage').hide();
    $('.negotiatorSignupPage').hide();

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
    $('.negotiatorSignupDoneBtn').on('click', function(event){

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
    $('.goToCityBtn').on('click', function(){

        // Store user choices in variables
        userFirstName = $('#userFirstName').val(); 
        userLastName = $('#userLastName').val(); 
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

            console.log(userFirstName);
            console.log(userLastName);
            console.log(cityChoice);
            console.log(itemChoice);

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
        negotiatorStrings.push(`<input type="radio" name="negotiatorChoices" id="choice${neg + 1}" value="${data.negotiators[neg].agentName}">${data.negotiators[neg].agentName}`);
    }

    // Call 'displayNegotiatorChoices()' to display choices on screen    
    displayNegotiatorChoices(negotiatorStrings);
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
    $('#confirmNegotiatorBtn').on('click', function(event){

        // prevent default form submission behavior
        event.preventDefault();

        // Store selected negotiator's name in a varible
        let negotiatorSelection = $('input[name=negotiatorChoices]:checked').val();
        
        // **********Save the negotiator to the user's object*********NOT NOW, MAYBE LATER************
        
        // Show Negotiator selection confirmation & message
        $('#matchedAgents').hide();
        $('.chooseNegotiatorPage').append(`<p>Congrats ${userFirstName}, you will be represented well by ${negotiatorSelection}!</p>` + 
            `<p>You will be contacted shortly to provide more info about your purchase.</p>`);        
    });    
}

function chooseDifferentItem()
{
    // Provide link to return to "Select Item Screen"
    // Or add Back button??
    selectItemAndAddDetail();
}


// ************** TAKEN FORM THINKFUL PROGRAM - TOP ****************************

function getAgents(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_NEGOTIATOR_AGENTS)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayAgents(data) {
    for (index in data.agents) {
       $('#matchedAgents').html(
        '<p>' + data.agents[index].agentName + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayAgents() {
    getAgents(displayAgents);

    // Hide Item Detail Page
    $('.itemDetailPage').hide();

    // Show Agents List
    $('.chooseNegotiatorPage').show();
}

$(function() {
    
    renderStartPage();
})

// ************** TAKEN FORM THINKFUL PROGRAM - BOTTOM ****************************