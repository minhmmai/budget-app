// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (curr) {
            sum += curr.value;
        })
        data.totals[type] = sum;
    };

    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem;

            data.items[type].length === 0
                ? ID = 0
                : ID = data.items[type][data.items[type].length - 1].id + 1

            // Check item type and create a new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else {
                newItem = new Income(ID, des, val);
            }
            data.items[type].push(newItem);

            // Return new item
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.items[type].map(function(current){
                return current.id
            });

            index = ids.indexOf(id);

            if  (index !== -1) {
                data.items[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            // Calculate the totals of income and expense
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of expense
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }

})();

// USER INTERFACE CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expense--value',
        percentageLabel: '.budget__expense--percentage',
        container: '.container'

    }

    return {
        getInput: function () {
            return {
                // Receive the type of the amount, either inc (income) or exp (expense)
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                // Create  HTML string with placeholder text
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '- -';
            }
        },

        getDOMstrings: function () {
            return DOMstrings
        }
    }
})();

// GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UIController.getDOMstrings();

        // Event listener for mouse click
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        // Event listener for enter key
        document.addEventListener('keydown', function (event) {
            // Older browsers event may have which instead of keyCode property
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function () {

        // 1. Calculate budget
        budgetController.calculateBudget();

        // 2. Return the budget
        var budget = budgetController.getBudget();

        // 3. Display the budget on the UI
        UIController.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input data
        var input = UIController.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget controller
            var newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. Add item to the UI
            UIController.addListItem(newItem, input.type);

            // 4. Clear UI input fields
            UIController.clearFields();

            // 5. Update the budget
            updateBudget();

        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // Separate item id
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from data structure
            budgetController.deleteItem(type, ID);

            // 2. Delete item from the UI

            // 3. Update new budget

        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();