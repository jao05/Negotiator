let MOCK_NEGOTIATOR_AGENTS = {
    "agents": [
        {
            "id": "1111111",
            "expertise": "Cars",
            "agentId": "aaaaaa",
            "agentName": "John Doe"            
        },
        {
            "id": "2222222",
            "expertise": "Cars",
            "agentId": "bbbbbbb",
            "agentName": "Jane Doe",            
        },
        {
            "id": "333333",
            "expertise": "Homes",
            "agentId": "cccc",
            "agentName": "Jim Doe",            
        },
        {
            "id": "4444444",
            "expertise": "Homes",
            "agentId": "ddddd",
            "agentName": "Jackie Doe",            
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