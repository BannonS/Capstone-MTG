// Section 2: displaying search results and adding cards to deck.

// Search results and card display and keep track of selected cards
let selectedCards = [];

// Search results and card display
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('search-query').value;

    fetch(`http://localhost:7788/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            const searchResultsDiv = document.getElementById('search-results');
            searchResultsDiv.innerHTML = '';

            data.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.textContent = card.name;
                cardDiv.addEventListener('click', function() {
                    // Add card ID and Name to the selected cards array
                    selectedCards.push({ id: card.id, name: card.name });
            
                    // Add the card name to the deck form input
                    document.getElementById('card-id').value += card.name + ", ";
                });
                searchResultsDiv.appendChild(cardDiv);
            });
        });
});

// Adding cards to a "deck"
document.getElementById('deck-form').addEventListener('submit', function(e) {
    e.preventDefault();

    selectedCards.forEach(card => { // each 'card' is an object with 'id' and 'name'
        fetch('http://localhost:7788/deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId: card.id, cardName: card.name }), // send the id and name
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const deckDiv = document.getElementById('deck');
            const cardDiv = document.createElement('div');
            cardDiv.textContent = data.name; 
            deckDiv.appendChild(cardDiv);

            // Add a notification that the card has been added
            alert(`Card "${data.name}" was added to the deck.`);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });

    // Clear the selected cards array and the deck form input
    selectedCards = [];
    document.getElementById('card-id').value = '';
});

// Section 3: specified searching/reference server.js 

// section 4: card image div display/reference server.js 

// section 5: deck manipulation and organization/reference server.js 