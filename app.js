// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

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

            ids = data.items[type].map(function (current) {
                return current.id
            });

            index = ids.indexOf(id);

            if (index !== -1) {
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
        },

        calculatePercentages: function () {
            data.items.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function () {
            var allPercentages;

            allPercentages = data.items.exp.map(function (current) {
                return current.getPercentage();
            })
            return allPercentages;

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
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }
        dec = numSplit[1];

        return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + dec
    };

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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '- -';
            }
        },

        displayPercentages: function (percentages) {
            var fields, nodeListForEach;

            fields = document.querySelectorAll(DOMstrings.expPercentageLabel);

            nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '- -';
                }
            });
        },

        displayMonth: function () {
            var now, year, month, months;

            now = new Date();
            year = now.getFullYear();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = months[now.getMonth() - 1];

            document.querySelector(DOMstrings.dateLabel).textContent = month + ', ' + year;
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

    var updatePercentages = function () {
        var percentages;

        // 1. Calculate the percentages
        budgetController.calculatePercentages();

        // 2. Read percentages from budget controller
        percentages = budgetController.getPercentages();
        console.log(percentages);

        // 3. Update the percentages on UI
        UIController.displayPercentages(percentages);
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

            // 6. Update the percentages
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // Separate item id
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from data structure
            budgetController.deleteItem(type, ID);

            // 2. Delete item from the UI
            UIController.deleteListItem(itemID);

            // 3. Update new budget
            updateBudget();

            // 4. Update the percentages
            updatePercentages();
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
            UIController.displayMonth();
        }
    }
})(budgetController, UIController);

appController.init();