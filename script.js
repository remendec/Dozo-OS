// Asegurarse de que el DOM esté completamente cargado antes de asignar eventos
document.addEventListener('DOMContentLoaded', function() {
    const formElement = document.getElementById('dietForm');
    const resetButton = document.getElementById('reset');
    const resultDiv = document.getElementById('result');

    console.log('Form element:', formElement);
    if (!formElement) {
        console.error('Error: No se encontró un elemento con ID "dietForm".');
        return;
    }

    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        generateDiet();
    });

    resetButton.addEventListener('click', function() {
        console.log('Reset button clicked');
        try {
            formElement.reset();
            resultDiv.innerHTML = '';
            console.log('Form reset and result cleared successfully');
        } catch (error) {
            console.error('Error al usar form.reset:', error);
            const inputs = formElement.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            resultDiv.innerHTML = '';
            console.log('Fallback: Form fields reset manually and result cleared');
        }
    });
});

// Función para determinar la temporada basada en la fecha actual
function getSeason() {
    const month = new Date().getMonth() + 1; // 0-11 a 1-12
    if ([12, 1, 2].includes(month)) return 'summer';
    if ([3, 4, 5].includes(month)) return 'autumn';
    if ([6, 7, 8].includes(month)) return 'winter';
    if ([9, 10, 11].includes(month)) return 'spring';
}

// Función para mezclar un arreglo (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Simulación de consulta a Grok como base de datos dinámica
function fetchFoodsFromGrok(category, location, season, dietType, conditions, allergies) {
    const baseFoods = {
        carbs: { all: [], breakfast: [] },
        proteins: { all: [], breakfast: [] },
        vegetables: [],
        fruits: [],
        snacks: []
    };

    const locationData = {
        santiago: {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Sandías'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Brócoli', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Manzanas', 'Pomelos'],
                snacks: ['Almendras', 'Nueces', 'Higos secos']
            }
        },
        concepcion: {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Arándanos'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Brócoli', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Manzanas', 'Pomelos'],
                snacks: ['Almendras', 'Nueces', 'Higos secos']
            }
        },
        'vina-del-mar': {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Arándanos'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Brócoli', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Manzanas', 'Pomelos'],
                snacks: ['Almendras', 'Nueces', 'Higos secos']
            }
        },
        'la-serena': {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Arándanos'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Brócoli', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Manzanas', 'Pomelos'],
                snacks: ['Almendras', 'Nueces', 'Higos secos']
            }
        }
    };

    if (!locationData[location]) {
        console.warn(`No hay datos para la ubicación: ${location}`);
        return baseFoods;
    }

    const seasonalData = locationData[location][season] || {};
    const selectedDiet = seasonalData[dietType] || seasonalData;

    const filteredFoods = JSON.parse(JSON.stringify(selectedDiet || {}));

    if (conditions.includes('diabetes')) {
        filteredFoods.carbs.all = (filteredFoods.carbs.all || []).filter(food => food !== 'Maíz');
        filteredFoods.carbs.breakfast = (filteredFoods.carbs.breakfast || []).filter(food => food !== 'Pan integral');
    }
    if (conditions.includes('celiac')) {
        filteredFoods.carbs.all = (filteredFoods.carbs.all || []).filter(food => food !== 'Trigo' && food !== 'Pan integral');
        filteredFoods.carbs.breakfast = (filteredFoods.carbs.breakfast || []).filter(food => food !== 'Trigo' && food !== 'Pan integral');
    }
    if (allergies.length > 0) {
        allergies.forEach(allergy => {
            if (filteredFoods.snacks) {
                filteredFoods.snacks = filteredFoods.snacks.filter(snack => !snack.toLowerCase().includes(allergy.toLowerCase()));
            }
        });
    }

    ['carbs', 'proteins', 'vegetables', 'fruits', 'snacks'].forEach(category => {
        const items = filteredFoods[category];
        if (Array.isArray(items)) {
            shuffleArray(items);
        } else if (typeof items === 'object') {
            Object.keys(items).forEach(subCategory => {
                shuffleArray(items[subCategory]);
            });
        }
    });

    return { ...baseFoods, ...filteredFoods };
}

// Función principal para generar la dieta
function generateDiet() {
    const name = document.getElementById('name').value;
    const sex = document.getElementById('sex').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(cb => cb.value);
    const allergies = document.getElementById('allergies').value.split(',').map(a => a.trim()).filter(a => a);
    const dietType = document.getElementById('dietType').value;
    const location = document.getElementById('location').value;
    const meals = Array.from(document.querySelectorAll('input[name="meal"]:checked')).map(cb => cb.value);
    const days = parseInt(document.getElementById('days').value);

    if (!name || !sex || !age || !weight || !height || !activity || !goal || meals.length === 0 || !dietType || !location || !days) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    let bmr;
    if (sex === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
        low: 1.2,
        light: 1.375,
        moderate: 1.55,
        high: 1.725,
        intense: 1.9
    };

    let tdee = bmr * activityMultipliers[activity];

    if (goal === 'lose') {
        tdee -= 500;
    } else if (goal === 'gain') {
        tdee += 500;
    }

    const calories = tdee;

    const baseProportions = {
        breakfast: { min: 0.2, max: 0.25 },
        lunch: { min: 0.3, max: 0.4 },
        dinner: { min: 0.2, max: 0.3 },
        firstSnack: { min: 0.05, max: 0.1 },
        secondSnack: { min: 0, max: 0.1 }
    };

    const selectedMeals = meals.filter(meal => baseProportions[meal]);

    let remainingCalories = calories;
    let remainingProportion = 1;

    const adjustedProportions = {};

    selectedMeals.forEach(meal => {
        const min = baseProportions[meal].min;
        const max = baseProportions[meal].max;
        const maxPossible = Math.min(max, remainingProportion);
        const proportion = Math.max(min, Math.min(maxPossible, min + (maxPossible - min) / 2));
        adjustedProportions[meal] = proportion;
        remainingCalories -= calories * proportion;
        remainingProportion -= proportion;
    });

    const snackProportion = adjustedProportions['firstSnack'] || 0 + adjustedProportions['secondSnack'] || 0;
    const snackCalories = Math.round(calories * snackProportion);
    const snackBaseCalories = 200;
    const snackMeals = ['firstSnack', 'secondSnack'].filter(meal => adjustedProportions[meal]);

    if (snackMeals.length > 0 && snackCalories < snackBaseCalories) {
        const deficit = snackBaseCalories - snackCalories;
        const nonSnackMeals = selectedMeals.filter(meal => meal !== 'firstSnack' && meal !== 'secondSnack');
        const deficitPerMeal = deficit / nonSnackMeals.length;
        nonSnackMeals.forEach(meal => {
            adjustedProportions[meal] -= deficitPerMeal / calories;
        });
    }

    const totalMainProportion = selectedMeals.filter(meal => meal !== 'firstSnack' && meal !== 'secondSnack')
        .reduce((sum, meal) => sum + adjustedProportions[meal], 0);

    const season = getSeason();

    const totalMainCalories = Math.round(remainingCalories * (totalMainProportion / (1 - snackProportion)));
    const flexMarginCalories = Math.round(calories * (1 - totalMainProportion - snackProportion)); // 0%-10%

    const availableFoods = fetchFoodsFromGrok(null, location, season, dietType, conditions, allergies);
    console.log('availableFoods:', availableFoods); // Depuración para verificar datos

    if (!availableFoods.snacks || availableFoods.snacks.length === 0) {
        console.error('Error: No se encontraron snacks en availableFoods');
        availableFoods.snacks = ['Almendras']; // Valor por defecto si falla
    }

    let counters = {
        carbs: { all: 0, breakfast: 0 },
        proteins: { all: 0, breakfast: 0 },
        vegetables: 0,
        fruits: 0,
        snacks: 0
    };

    let result = `
        <h2>Plan de Dieta para ${name}</h2>
        <p class="summary"><strong>Días Totales:</strong> ${days} | <strong>Calorías Diarias:</strong> ${Math.round(calories)} kcal | <strong>Temporada:</strong> ${season.charAt(0).toUpperCase() + season.slice(1)} | <strong>Ciudad:</strong> ${location.replace('-', ' ').charAt(0).toUpperCase() + location.replace('-', ' ').slice(1)}</p>
        <div class="diet-plan">
    `;

    for (let day = 1; day <= days; day++) {
        const dayClass = day % 2 === 0 ? 'day-even' : 'day-odd';
        result += `
            <section class="day-section ${dayClass}">
                <h3>Día ${day}</h3>
                <div class="meal-grid">
        `;
        meals.forEach(meal => {
            const isBreakfast = meal === 'breakfast';
            const isSnack = meal === 'firstSnack' || meal === 'secondSnack';
            let mealCalories;
            if (isSnack) {
                mealCalories = snackCalories / snackMeals || snackBaseCalories; // Dividir entre número de snacks
            } else {
                const proportion = adjustedProportions[meal] || 0;
                mealCalories = proportion > 0 ? Math.round(totalMainCalories * (proportion / totalMainProportion)) : 0;
                if (proportion > 0 && mealCalories < Math.round(remainingCalories * baseProportions[meal].min)) {
                    mealCalories = Math.round(remainingCalories * baseProportions[meal].min);
                }
            }
            const scaleFactor = mealCalories / 626; // Base de 626 kcal

            result += `
                <div class="meal-card ${isSnack ? 'snack-card' : ''}">
                    <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)} (~${mealCalories} kcal)</h4>
                    <table class="meal-table">
            `;

            if (isSnack) {
                const snacks = availableFoods.snacks || ['Almendras'];
                const snack = snacks[counters.snacks % snacks.length];
                counters.snacks++;
                result += `
                    <tr><td>Snack:</td><td>${snack} - 30g</td></tr>
                `;
            } else {
                const carbs = isBreakfast ? availableFoods.carbs.breakfast || [] : availableFoods.carbs.all || [];
                const proteins = isBreakfast ? availableFoods.proteins.breakfast || [] : availableFoods.proteins.all || [];
                const vegetables = availableFoods.vegetables || [];
                const fruits = availableFoods.fruits || [];

                const carbQty = Math.round((isBreakfast ? 50 : 100) * scaleFactor);
                const proteinQty = Math.round((isBreakfast ? 30 : 80) * scaleFactor);
                const vegQty = Math.round(100 * scaleFactor);
                const fruitQty = Math.round(150 * scaleFactor);

                const carb = carbs.length > 0 ? carbs[counters.carbs[isBreakfast ? 'breakfast' : 'all'] % carbs.length] : 'Sin carbohidrato';
                const protein = proteins.length > 0 ? proteins[counters.proteins[isBreakfast ? 'breakfast' : 'all'] % proteins.length] : 'Sin proteína';
                const vegetable = vegetables.length > 0 ? vegetables[counters.vegetables % vegetables.length] : 'Sin vegetal';
                const fruit = fruits.length > 0 ? fruits[counters.fruits % fruits.length] : 'Sin fruta';

                counters.carbs[isBreakfast ? 'breakfast' : 'all']++;
                counters.proteins[isBreakfast ? 'breakfast' : 'all']++;
                counters.vegetables++;
                counters.fruits++;

                result += `
                    <tr><td>Carbohidratos:</td><td>${carb} - ${carbQty}g</td></tr>
                    <tr><td>Proteínas:</td><td>${protein} - ${proteinQty}g</td></tr>
                    <tr><td>Vegetales:</td><td>${vegetable} - ${vegQty}g</td></tr>
                    <tr><td>Frutas:</td><td>${fruit} - ${fruitQty}g</td></tr>
                `;
            }
            result += `
                    </table>
                </div>
            `;
        });
        if (flexMarginCalories > 0) {
            result += `
                <div class="meal-card">
                    <h4>Margen Flexible (~${flexMarginCalories} kcal)</h4>
                    <table class="meal-table">
                        <tr><td>Nota:</td><td>Calorías no asignadas, disponibles para ajustes.</td></tr>
                    </table>
                </div>
            `;
        }
        result += `
                </div>
            </section>
        `;
    }

    result += `</div>`;
    document.getElementById('result').innerHTML = result;
}
