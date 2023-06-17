// Section 2: displaying search results and adding cards to deck.

// NOTES!!! 
// need to implement some tests to make sure everything is functioning properly

// BUGS!!!
// 1. deck div does not display, but no network or server error. 
// 2. "card added" notification displays "undefined" instead of card name. - fixed
// 3. when displaying results, results go up page instead of down page and use scroll

// Search results and keeping track of selected cards
let selectedCards = [];

// Search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('search-query').value;
    const type = document.getElementById('type-selector').value;
    const isLegendary = document.getElementById('legendary-checkbox').checked; // grab checkbox value

// section 3: Specified Searching 
    fetch(`http://localhost:7788/search?query=${query}`)
    .then(response => response.json())
    .then(data => {
        console.log('Data returned from API:', data);  // Log the raw data
        // If a type was selected or if legendary checkbox is checked, filter the cards by type and legendary status
        if (type || isLegendary) {
            data = data.filter(card => {
                // If the card must be legendary and it is not, exclude it
                if (isLegendary && (!card.type_line || !card.type_line.startsWith('Legendary'))) {
                    return false;
                }

                // If a type was selected, it must match
                if (type) {
                    // If type_line is not defined on the card, exclude it
                    if (!card.type_line) {
                        return false;
                    }

                    // Split the type_line into an array by the "—" symbol
                    const typeLineArray = card.type_line.split("—");

                    // Check for 'World Enchantment' exception
                    if (type === "World Enchantment" && card.type_line === "World Enchantment") {
                        return true;
                    }

                    // If it's a legendary card, the type is the second word, else it's the first
                    const cardType = card.type_line.startsWith('Legendary') ? typeLineArray[0].split(' ')[1] : typeLineArray[0];

                    // Only keep the cards where the type matches
                    if (cardType.trim() !== type) {
                        return false;
                    }
                }

                return true;
            });
        }

        console.log('Filtered data:', data);

// section 4: Card image display and click action
            const searchResultsDiv = document.getElementById('search-results');
            searchResultsDiv.innerHTML = '';

            data.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.textContent = card.name;

                cardDiv.addEventListener('mouseover', function() {
                    if (card.image_uris) {
                        document.getElementById('card-preview').src = card.image_uris.normal;
                    }
                });

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

// Adding Cards to the deck
document.getElementById('deck-form').addEventListener('submit', function(e) {
    e.preventDefault();

    selectedCards.forEach(card => { // each 'card' is an object with 'id' and 'name'
        fetch('http://localhost:7788/deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId: card.id, cardName: card.name }),
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
            cardDiv.textContent = card.name; 
            deckDiv.appendChild(cardDiv);

            console.log(deckDiv);

            alert(`Card "${card.name}" was added to the deck.`);
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