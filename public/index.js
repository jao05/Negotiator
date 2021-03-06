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



function loginAsUser()
{
    // If users clicks Cancel button
    $('#cancelLoginBtn').on('click', function(event){

        event.preventDefault();

        // Go back to Start Page
        location.reload();
    });

    // After credentials are submitted, validate them
    $('.loginForm').on('submit', function(event){

        event.preventDefault();

        // Take in required info including new login credentials
        let loginUserName = $('#loginUsername').val();
        let loginPassword = $('#loginPassword').val();

        // Make POST request
        //If credentials are valid, load the Start page,
        let data = {           
            
            username: loginUserName,
            password: loginPassword
       };

       // Using data stored in variables, login as the appropriate user
       let settings = { 
            url: "/users/login", 
            type: 'POST', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(responseData) {                 
                localStorage.setItem('user', JSON.stringify(responseData));
                
                // Hide Login Page
                $('.loginPage').hide();
                $('#logoutBtn').show(); 
                $('.startPage').show();
                $('#showProfileBtn').show();
            },
            error: function(responseData){

                $('#loginError').show();
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);        
    });    
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
                localStorage.setItem('user', JSON.stringify(responseData));
                // Display user sign-up message on screen                
                $('.userSignupPage').html(`<p>Thanks ${ responseData.fullName }, you're all signed up!</p>`);
                $('#logoutBtn').show();
                $('.startPage').show();                
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);       
    });

    // If user clicks "Cancel" button, reload the app    
    $('#cancelSignupBtn').on('click', function(event){

        event.preventDefault();

        // Go back to Start Page
        location.reload();
    }); 
}

function renderLandingPage()
{
    // Show Landing
    $('.landingPage').show();

    // Hide the Logout button
    $('#logoutBtn').hide();

    // Hide all other pages
    $('.loginPage').hide();
    $('.startPage').hide();    
    $('.selectAreaPage').hide();
    $('.itemDetailPage').hide();
    $('.chooseNegotiatorPage').hide();
    $('.negotiatorSignupPage').hide();
    $('.userSignupPage').hide();

    
    // Listen for click on 'Login' button   
    $('#loginBtn').on('click', function(){

        // Render Login Page
        renderLoginPage();        

        // Hide Landing Page
        $('.landingPage').hide();        
    });
    

    // Listen for click on 'Sign Up' button
    $('#signupBtn').on('click', function(){

        signUpAsUser();
    });
}

function renderLoginPage()
{
    // Show Login Page
    $('.loginPage').show();
    loginAsUser();
}

function renderStartPage()
{
    // Show Logout button
    $('#logoutBtn').show(); 

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

    // Calling in order to activate the event listener
    makeUserTypeSelection();
}

function makeUserTypeSelection()
{    

    // Listen for click on "Need A Negotiator" button
    $('.needNegotiatorBtn').on('click', function(){
       

        // Hide User Signup page
        $('.userSignupPage').hide();

        // Allow user to select the area in which the negotiation will take place
        selectArea();

        // Hide the Start Page
        $('.startPage').hide();
    });    
    
    // Listen for click on "Become A Negotiator" button
    $('.becomeNegotiatorBtn').on('click', function(){
        

        // Hide User Signup page
        $('.userSignupPage').hide();

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
       let negotiatorFirstName = JSON.parse(localStorage.getItem('user')).firstName;
       let negotiatorLastName = JSON.parse(localStorage.getItem('user')).lastName;       
       let data = {
            
            metroArea: negotiatorSignupLocation,
            expertise: negotiatorSignupExpertise,
            agentFirstName: negotiatorFirstName,
            agentLastName: negotiatorLastName
       };

       // Using data stored in variables, create an object to add new negotiator to the database collection that holds Negotiators
       let settings = { 
            url: "/negotiators", 
            type: 'POST', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(responseNegotiatorData) { 
                console.log(responseNegotiatorData);
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);

       // Display agent sign-up message on screen
       $('.negotiatorSignupPage').html(`<p>Thanks ${ negotiatorFirstName }, you're all signed up and ready to negotiate in ${ negotiatorSignupLocation }!</p>` + 
            `<p>You will receive notification when you have been matched with a client.</p>`
        );       
    });    
}


function showProfileDetails() 
{
    // Hide all other pages
    $('.landingPage').hide();
    $('.loginPage').hide();
    $('.startPage').hide();    
    $('.selectAreaPage').hide();
    $('.itemDetailPage').hide();
    $('.chooseNegotiatorPage').hide();
    $('.negotiatorSignupPage').hide();
    $('.userSignupPage').hide();

    // Show the profile details div
    $('.profilePage').show();
    $('#hideProfileBtn').show();

    // Hide the showProfileBtn
    $('#showProfileBtn').hide();    

    let user = JSON.parse(localStorage.getItem('user'));    

    $('#displayAttributes').html(`<header>Current Profile:</header>>
                    <div id='shownProfileName'>Name: ${user.firstName}</div> 
                    <div id='shownProfileArea'>Area: ${user.metroArea}</div> 
                    <div id='shownProfileItem'>Item: ${user.selectedItem}</div>`);

    $('#modifyAttrForm').on('submit', function(event) {
        event.preventDefault();

        // Store city choice in variables        
        let modifiedCityChoice = $('#modifyCitySelection').val();

        // Store city choice in variables        
        let modifiedItemChoice = $('#modifyItemSelection').val();        

        let data = {
            // Needed to parse this to JSON to use
            userID: user.id,
            metroArea: modifiedCityChoice,
            selectedItem: modifiedItemChoice                       
       };       
       
       let settings = { 
            url: "users/edit", 
            type: 'PUT', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(responseUpdatedProfileData) {                 
        
                $('#hideProfileBtn').hide();
                $('#showProfileBtn').show();
                $('.profilePage').hide();
                $('.startPage').show();

                localStorage.setItem('user', JSON.stringify(responseUpdatedProfileData));                
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);
    });
}

function deleteUserProfile()
{    
    user = JSON.parse(localStorage.getItem('user'));    

    // If user clicks on the DELETE button:
    // 1. Send a request to remove the user from the db.
    let data = {            
        userID: user.id          
    };

    let settings = { 
        url: `users/${user.id}`, 
        type: 'DELETE', 
        data: JSON.stringify(data), 
        dataType: 'json', 
        contentType: 'application/json; charset= utf-8', 
        success: function() {         
            //Redirect to landingPage.
            $('.landingPage').show();
            $('#logoutBtn').hide();
            $('#hideProfileBtn').hide();            
            $('#showProfileBtn').hide();
            $('.profilePage').hide();                        
        }
    };

    // Pass the object as parameter for the AJAX request
    $.ajax(settings);

    
    // 2. Clear user from local storage.
    localStorage.setItem('user', null); 
}

function hideProfileDetails()
{
    // Hide the profile details div
    $('.profilePage').hide();
    
    // Hide the hideProfileBtn
    $('#hideProfileBtn').hide();

    // Show the startPage again
    $('.startPage').show();

    // Show the showProfileBtn again
    $('#showProfileBtn').show();
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

            // Hide Item Detail Page
            $('.itemDetailPage').hide();

            // Using the user's inputs as parameters, display negotiators that fit criteria
            getNegotiatorChoices(cityChoice, itemChoice);
        });
    });  
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
        negotiatorStrings.push(`<div><input type="radio" name="negotiatorChoices" id="choice${neg + 1}" value="${data.negotiators[neg].id}" required>${data.negotiators[neg].agentName}</div>`);
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
        $('#chooseNegotiatorForm').prepend(arrayOfNegotiatorInfoStrings[string]);
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
        
        // Make a PUT request to store new values to user's object
        
        let data = {
            // Needed to parse this to JSON to use
            userID: JSON.parse(localStorage.getItem('user')).id,
            metroArea: cityChoice,
            selectedItem: itemChoice,
            selectedNegotiator: negotiatorSelection            
       };       
       
       let settings = { 
            url: "/users", 
            type: 'PUT', 
            data: JSON.stringify(data), 
            dataType: 'json', 
            contentType: 'application/json; charset= utf-8', 
            success: function(responseNegotiatorData) { 
                // Show Negotiator selection confirmation & message
                $('#matchedAgents').hide();
                $('.chooseNegotiatorPage').append(`<p>Congrats! You will be represented well by ${responseNegotiatorData.agentName}!</p>` + 
                    `<p>You'll be contacted shortly (actually you won't...this company isn't real yet) to provide more info so that we can get started on your purchase.</p>`);  
        
                // Change the text of the 'Restart' button to 'Done'   **********************
                $('#restartBtn').text('Done');
            }
       };
        
       // Pass the object as parameter for the AJAX request
       $.ajax(settings);        
    });    
}

function printNoNegotiatorMsg()
{    
    // Print message to chooseNegotiatorPage
    $('.chooseNegotiatorPage').html(`<p>Sorry, currently there are no negotiators that fit your criteria, but we're working on it.  Try again later.</p>`);

    // Show chooseNegotiaote Page
    $('.chooseNegotiatorPage').show();
}

function checkLoginStatus()
{
    if (localStorage.getItem('user'))
    {
        $('.landingPage').hide();
        $('.startPage').show();
    }
    else
    {
        $('#logoutBtn').hide();
    }
}

function logOut()
{
    $('#logoutBtn').on('click', function(){

        // Hide profilePage, showProfileBtn & hideProfileBtn
        $('.profilePage').hide();
        $('#showProfileBtn').hide();
        $('#hideProfileBtn').hide();   

        // Clear user in localStorage
        localStorage.removeItem('user');

        $('#logoutBtn').hide();
        $('.landingPage').show();
        renderLandingPage();
    });
}

$(function() {       
    
    localStorage.clear();
    renderLandingPage();   
    loginAsUser();
    checkLoginStatus();
    logOut();
    makeUserTypeSelection();
})