// BUDGET CONTROLLER
var budgetController = (function () {

})();

// USER INTERFACE CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add_btn'
    }

    return {
        getInput: function () {
            return {
                // Receive the type of the amount, either inc (income) or exp (expense)
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

// GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UIController.getDOMstrings;

        // Event listener for mouse click
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        // Event listener for enter key
        document.addEventListener('keydown', function (event) {
            // Older browsers event may have which instead of keyCode property
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function () {
        // 1. Get input data
        var input = UIController.getInput();

        // 2. Add item to the budget controller
        // 3. Add item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
     }
})(budgetController, UIController);

appController.init();