# theCoderrr
Generate useful HTML5 elements with clean CSS code. Edit visually and export a ready-to-insert block of code into your project. You can edit everything you need without messing up any of the good stuff.

# Documentation
## Cards
Cards are elements that are added within decks. Similar to decks, they are made from an initial template and can be edited (their text can be editied, at times images, etc.)

When you add a new `deck` to your `Page Editor`, it contains `Deck Settings`, which edit the general settings of the deck (its background color, etc.) It also contains cards, which can be added or removed. 

Different decks carry different card types, depending on their outline.

Cards differ from decks in that they are not entirely modular – this means that the elements inside of a card template cannot be added or removed.

**For example:** the `Hero with text overlay` deck has a few cards by default: a `header`, a `subtitle` and two `buttons`. These cards can be added, removed, or re-ordered. 

The fields within the cards themselves, however, cannot be removed. Why, you ask? Say you generate a `button` card. It needs to have text and a link, so you aren't able to remove those fields from its template.

### Card Docs
Since theCoderrr is written in HTML, we structure our templates using html attributes. Card editors, templates and displays are all defined based on different attributes.

#### Custom attributes

| attribute | type 				| values      | description
----------- | --------------- | ----------- | -----------
*These will be added later on.*

#### CSS attributes

| value     | type 				| description
----------- | --------------- | -----------
`card-Editor` | class | This class indicates that the given element has fields that edit a given card.
`card-Display` | class | This class indicates that the given element displays content from the corresponding `card-Editor`.
`card-XY-Editor` | id | A unique ID given to the editor of each card. The `X` represents the unique ID # of the card's parent deck. In Javascript, X is equal to the `$deckIndex` variable when the deck is created. The `Y` represents this card's index # among other cards within its parent deck.
`card-XY-Display` | id | A unique ID given to the visible of each card. The X and Y correspond to the above.

#### Global javascript cardvariables
| variable     | type 			   | space | description
-----------    |-----------      | ----- |-----------

#### javascript functions
| function     | type 			   | arguments | description
-----------    | ------------	   | --- | -----------
`cardId` | dynamic generator | `cardIndex`, `e`, `currentDeckIndex` | This function generates the unique ID for each card, whether it be Display or Editor. It uses the `cardIndex` argument, generated from its parent functions for-loop, indicating the card index relative to the deck parent. currentDeckIndex is simply meant to pass the current value of the global`$deckIndex` variable. **`cardId()`** is called upon a for-loop of each `card` within the **`deckGenerator()`** function.