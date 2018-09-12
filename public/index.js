let MOCK_NEGOTIATOR_AGENTS = {
    "agents": [
        {
            "id": "1111111",
            "expertise": "Cars",
            "agentId": "aaaaaa",
            "agentName": "John Carson",
            "metroArea": "New York City"           
        },
        {
            "id": "2222222",
            "expertise": "Cars",
            "agentId": "bbbbbbb",
            "agentName": "Jane Doe",
            "metroArea": "Atlanta"          
        },
        {
            "id": "333333",
            "expertise": "Homes",
            "agentId": "cccc",
            "agentName": "Jim Homer",
            "metroArea": "Los Angeles"         
        },
        {
            "id": "4444444",
            "expertise": "Boats",
            "agentId": "ddddd",
            "agentName": "Jackie Boatman",
            "metroArea": "Miami"          
        },
        {
            "id": "555555",
            "expertise": "Cars",
            "agentId": "eeeee",
            "agentName": "Joe Schmoe",
            "metroArea": "New York City"           
        },
        {
            "id": "666666",
            "expertise": "Planes",
            "agentId": "fffff",
            "agentName": "Jet Li",
            "metroArea": "Hong Kong"          
        },
        {
            "id": "777777",
            "expertise": "Homes",
            "agentId": "ggggg",
            "agentName": "Napoleon Bonaparte",
            "metroArea": "Paris"         
        },
        {
            "id": "888888",
            "expertise": "Homes",
            "agentId": "hhhhh",
            "agentName": "Hillary Bush",
            "metroArea": "Miami"          
        }
    ]
};

let cityChoice;

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
    });       
}

function signUpAsNegotiator()
{
    // Take in required info
    // Add new Negotiator to the database collection that holds Negotiators
}

function selectArea()
{
    // Show "selectAreaPage"
    $('.selectAreaPage').show();

    // Allow user to choose from a dropdown list of available cities
    // Listen for submission of area choice    
    $('.goToCityBtn').on('click', function(){

        // Store area choice in a variable
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

            console.log(itemYear);
            console.log(itemMake);
            console.log(itemModel);

            // make an AJAX request using the variable as parameters
            getAndDisplayAgents();
        });
    });    
}

function chooseDifferentCity()
{
    // Provide link to return to "Select Area Screen"
}

function populateNegotiatorList() // ***************THIS IS getAndDisplayAgents()**********
{
    // Use item detail variables to query the Negotiator collection in the db & return matches in a radio button list
}

function chooseNegotiator()
{
    // listen for submission after a radio button is clicked
    // Show Negotiator selection confirmation & message
}

function chooseDifferentItem()
{
    // Provide link to return to "Select Item Screen"
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
    // getAndDisplayAgents();
    renderStartPage();
})

// ************** TAKEN FORM THINKFUL PROGRAM - BOTTOM ****************************