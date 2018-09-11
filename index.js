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
        }
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

function getAgents(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_NEGOTIATOR_AGENTS)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayAgents(data) {
    for (index in data.agents) {
       $('body').append(
        '<p>' + data.agents[index].agentName + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayAgents() {
    getAgents(displayAgents);
}

$(function() {
    getAndDisplayAgents();
})