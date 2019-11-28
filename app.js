// BUDGET CONTROLLER
var budgetController = (function () {

})();

// USER INTERFACE CONTROLLER
var UIController = (function () {

})();

// GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {

    var ctrlAddItem = function(){
        // 1. Get input data
        // 2. Add item to the budget controller
        // 3. Add item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    //Event listener for enter key
    document.addEventListener('keydown', function (event) {
        // Older browsers event may have which instead of keyCode property
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    })
})(budgetController, UIController);